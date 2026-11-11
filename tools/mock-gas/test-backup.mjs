// GitHub backup tests against the local mock (fake GitHub): node tools/mock-gas/test-backup.mjs
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8798;
const URL_ = `http://localhost:${PORT}`;

const proc = spawn(process.execPath, [path.join(here, 'server.mjs'), String(PORT)], {
  stdio: ['ignore', 'pipe', 'inherit'],
  env: { ...process.env, MOCK_GITHUB_REPO: 'test-owner/wisn-survey-data', MOCK_GAS_FILE: '' },
});
let out = '';
const adminPw = await new Promise((resolve, reject) => {
  proc.stdout.on('data', (d) => {
    out += d;
    const m = /password: (\w+)/.exec(out);
    if (m && out.includes('Mock Apps Script')) resolve(m[1]);
  });
  proc.on('exit', () => reject(new Error('mock exited:\n' + out)));
});

let failed = 0, passed = 0;
function check(name, cond, extra) {
  if (cond) passed++; else { failed++; console.log('FAIL', name, extra !== undefined ? JSON.stringify(extra) : ''); }
}
async function call(action, payload = {}, token) {
  const r = await fetch(URL_, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, token, ...payload }),
  });
  return r.json();
}
const get = async (p) => (await fetch(URL_ + p)).json();
const repo = () => get('/__github');
const queue = async () => ((await get('/__sheet?name=' + encodeURIComponent('GitHub backup'))).rows || []).length - 1;
const resp = (id, code, extra = {}) => ({
  id, surveyId: 's', submittedAt: new Date().toISOString(), completionTimeSeconds: 100,
  interviewerId: 'FAKE', staffCode: code, staffName: 'សុខា ' + id, staffPhone: '+855 12 345',
  primaryDepartment: 'OPD', cadre: 'Nurse', answers: { q1: 'a' }, ...extra,
});

try {
  const A = (await call('login', { username: 'admin', password: adminPw })).result.token;
  await call('createUser', { user: { username: 'k001', password: 'pass001', name: 'K one', interviewerCode: 'K001' } }, A);
  const K1 = (await call('login', { username: 'k001', password: 'pass001' })).result.token;

  // save -> committed right away
  const s = await call('submit', { responses: [resp('R1', '001'), resp('R2', '002')] }, K1);
  check('save ok', s.ok && s.result.results.every((r) => r.status === 'added'), s);
  let g = await repo();
  check('both answers in repo', g.files['responses/R1.json'] && g.files['responses/R2.json'], Object.keys(g.files));
  check('Khmer text kept', g.files['responses/R1.json']?.staffName === 'សុខា R1');
  check('commit message names the interview', g.commits.some((c) => /^Add interview 001 \(R1\) by k001$/.test(c.message)), g.commits);
  check('queue empty after send', (await queue()) === 0);

  // edit -> new commit with new content
  await call('update', { id: 'R1', data: { staffName: 'Fixed' } }, K1);
  g = await repo();
  check('edit committed', g.files['responses/R1.json'].staffName === 'Fixed' && g.commits.some((c) => c.message.startsWith('Edit interview 001')));

  // same content again -> no empty commit
  const before = g.commits.length;
  await call('submit', { responses: [{ ...g.files['responses/R2.json'] }] }, K1);
  g = await repo();
  const r2updates = g.commits.slice(before).filter((c) => c.path === 'responses/R2.json');
  check('re-send of an answer only commits if it changed', r2updates.length <= 1, r2updates);

  // duplicate staff code -> duplicates/
  await call('submit', { responses: [resp('R3', '001')] }, K1);
  g = await repo();
  check('held duplicate backed up', !!g.files['duplicates/R3.json']);

  // GitHub down -> save still works, copy waits, timer sends it later
  await get('/__github/fail?n=50');
  const s2 = await call('submit', { responses: [resp('R4', '004')] }, K1);
  check('save works while GitHub is down', s2.ok && s2.result.results[0].status === 'added', s2);
  check('copy waits in queue', (await queue()) === 1);
  check('not in repo yet', !(await repo()).files['responses/R4.json']);
  await get('/__github/fail?n=0');
  await get('/__run/backupTimer');
  check('timer sends the waiting copy', !!(await repo()).files['responses/R4.json'] && (await queue()) === 0);

  // delete -> deleted/ copy, removed from responses/
  check('admin delete ok', (await call('remove', { id: 'R2' }, A)).ok);
  g = await repo();
  check('deleted copy kept', g.files['deleted/R2.json']?.deletedBy === 'admin');
  check('removed from responses/', !g.files['responses/R2.json']);

  // public repo -> refuses
  await get('/__github/public?on=1');
  await call('submit', { responses: [resp('R5', '005')] }, K1);
  check('public repo: nothing sent', !(await repo()).files['responses/R5.json']);
  check('public repo: copy kept waiting', (await queue()) === 1);
  await get('/__github/public?on=0');
  await get('/__run/backupTimer');
  check('private again: sent', !!(await repo()).files['responses/R5.json']);

  // copy ALL answers
  const all = await get('/__run/backupAll');
  check('backup all queues everything', all.result && all.result.queued >= 5 && all.result.waiting === 0, all);

  // clearAll -> everything moves to deleted/
  await call('clearAll', { confirm: 'DELETE ALL' }, A);
  check('clearAll: only 5 sent during the save, rest waits', (await queue()) === 1);
  await get('/__run/backupTimer');
  g = await repo();
  check('clearAll: responses/ empty', !Object.keys(g.files).some((p) => p.startsWith('responses/')), Object.keys(g.files));
  check('clearAll: deleted/ has them', ['R1', 'R4', 'R5'].every((id) => g.files[`deleted/${id}.json`]));
} finally {
  proc.kill();
}
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
