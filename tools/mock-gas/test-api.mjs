// Backend rule tests against the local mock: node tools/mock-gas/test-api.mjs
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8799;
const URL_ = `http://localhost:${PORT}`;

const proc = spawn(process.execPath, [path.join(here, 'server.mjs'), String(PORT)], { stdio: ['ignore', 'pipe', 'inherit'] });
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
const resp = (id, code, extra = {}) => ({
  id, surveyId: 's', submittedAt: new Date().toISOString(), completionTimeSeconds: 100,
  interviewerId: 'FAKE', staffCode: code, staffName: 'Name ' + id, staffPhone: '+855 12 345',
  primaryDepartment: 'OPD', cadre: 'Nurse', answers: { q1: 'a', interviewer_id: 'FAKE' }, ...extra,
});

try {
  // login
  check('no token refused', (await call('list')).code === 'auth');
  check('wrong password refused', (await call('login', { username: 'admin', password: 'x' })).code === 'bad_login');
  const a = await call('login', { username: 'Admin', password: adminPw });
  check('admin login', a.ok && a.result.user.role === 'admin', a);
  const A = a.result.token;
  check('no hash leaked', !('hash' in a.result.user) && !('salt' in a.result.user));

  // users
  const c1 = await call('createUser', { user: { username: 'k001', password: 'pass001', name: 'K one', interviewerCode: 'k001' } }, A);
  check('create k001', c1.ok && c1.result.user.interviewerCode === 'K001', c1);
  await call('createUser', { user: { username: 'k002', password: 'pass002', name: 'K two', interviewerCode: 'K002' } }, A);
  check('dup username refused', (await call('createUser', { user: { username: 'k001', password: 'pass001', name: 'x', interviewerCode: 'K9' } }, A)).code === 'duplicate');
  check('short password refused', (await call('createUser', { user: { username: 'k003', password: '12', name: 'x', interviewerCode: 'K3' } }, A)).code === 'bad_request');
  const K1 = (await call('login', { username: 'k001', password: 'pass001' })).result.token;
  const K2 = (await call('login', { username: 'k002', password: 'pass002' })).result.token;
  check('interviewer cannot list users', (await call('listUsers', {}, K1)).code === 'forbidden');
  check('interviewer cannot create users', (await call('createUser', { user: { username: 'zz1', password: 'pass001', name: 'x', interviewerCode: 'Z' } }, K1)).code === 'forbidden');

  // submit
  const s1 = await call('submit', { responses: [resp('R1', '001'), resp('R2', '002')] }, K1);
  check('k001 adds 2', s1.ok && s1.result.results.every((r) => r.status === 'added'), s1);
  const again = await call('submit', { responses: [resp('R1', '001')] }, K1);
  check('resend same id = updated (safe retry)', again.result.results[0].status === 'updated', again);
  const d = await call('submit', { responses: [resp('R3', '001')] }, K2);
  check('same staff code by k002 = duplicate held', d.result.results[0].status === 'duplicate', d);
  const steal = await call('submit', { responses: [resp('R1', '001')] }, K2);
  check('k002 cannot overwrite k001 answer', steal.result.results[0].status === 'forbidden', steal);
  check('invalid answer flagged', (await call('submit', { responses: [{ id: 'X' }] }, K1)).result.results[0].status === 'invalid');

  // list
  const l1 = (await call('list', {}, K1)).result;
  check('k001 sees own 2', l1.responses.length === 2, l1.responses.length);
  check('interviewer id forced to K001', l1.responses.every((r) => r.interviewerId === 'K001' && r.answers.interviewer_id === 'K001'));
  check('k002 sees none', (await call('list', {}, K2)).result.responses.length === 0);
  const la = (await call('list', {}, A)).result;
  check('admin sees 2 + 1 held duplicate', la.responses.length === 2 && la.duplicatesHeld === 1, la);
  check('text stays text (+855, 001)', la.responses.some((r) => r.staffPhone === '+855 12 345' && r.staffCode === '001'));

  // big answer split over cells
  const bigAns = {}; for (let i = 0; i < 400; i++) bigAns['q' + i] = 'x'.repeat(300) + i;
  const big = await call('submit', { responses: [resp('RBIG', '099', { answers: bigAns })] }, K1);
  check('big answer saved', big.result?.results[0].status === 'added', big);
  const gotBig = (await call('list', {}, K1)).result.responses.find((r) => r.id === 'RBIG');
  check('big answer reads back whole', gotBig && gotBig.answers.q399 === 'x'.repeat(300) + '399');

  // update
  check('k002 cannot edit k001', (await call('update', { id: 'R1', data: { staffName: 'hack' } }, K2)).code === 'forbidden');
  const u = await call('update', { id: 'R1', data: { staffName: 'Fixed', interviewerId: 'K002' } }, K1);
  check('k001 edits own, cannot change interviewer', u.ok && u.result.response.staffName === 'Fixed' && u.result.response.interviewerId === 'K001', u);
  check('edit to used staff code refused', (await call('update', { id: 'R1', data: { staffCode: '002' } }, K1)).code === 'duplicate');

  // import (admin)
  check('interviewer cannot import', (await call('submit', { mode: 'import', responses: [resp('R9', '009')] }, K1)).code === 'forbidden');
  const imp = await call('submit', { mode: 'import', responses: [resp('R1', '001'), resp('R9', '009', { interviewerId: 'OLD7' })] }, A);
  check('import skips existing, keeps interviewer', imp.result.results[0].status === 'skipped' && imp.result.results[1].status === 'added', imp);
  check('imported keeps OLD7', (await call('list', {}, A)).result.responses.find((r) => r.id === 'R9').interviewerId === 'OLD7');

  // publish (offline HTML file)
  const pub = await call('submit', { mode: 'publish', responses: [resp('P1', '501', { interviewerId: 'PC01' }), resp('P2', '009', { interviewerId: 'PC01' })] }, A);
  check('admin publish keeps PC code, holds dup', pub.result.results[0].status === 'added' && pub.result.results[1].status === 'duplicate', pub);
  const p1 = (await call('list', {}, A)).result.responses.find((r) => r.id === 'P1');
  check('published answer keeps PC01', p1 && p1.interviewerId === 'PC01' && p1.answers.interviewer_id === 'FAKE');
  check('re-publish is safe', (await call('submit', { mode: 'publish', responses: [resp('P1', '501', { interviewerId: 'PC01' })] }, A)).result.results[0].status === 'updated');
  const kp = await call('submit', { mode: 'publish', responses: [resp('P3', '502', { interviewerId: 'PC01' })] }, K2);
  check('interviewer publish uses own code', kp.result.results[0].status === 'added');

  // config
  check('interviewer cannot save config', (await call('saveConfig', { key: 'survey', value: { a: 1 } }, K1)).code === 'forbidden');
  const bigCfg = { questions: Array.from({ length: 300 }, (_, i) => ({ id: 'q' + i, text: 'y'.repeat(500) })) };
  check('admin saves big config', (await call('saveConfig', { key: 'survey', value: bigCfg }, A)).ok);
  const cfg = (await call('getConfig', {}, K1)).result;
  check('config reads back', cfg.survey.questions.length === 300 && cfg.ho2 === null);

  // delete
  check('interviewer cannot delete', (await call('remove', { id: 'R1' }, K1)).code === 'forbidden');
  check('admin deletes', (await call('remove', { id: 'R2' }, A)).ok);
  check('clearAll needs confirm', (await call('clearAll', {}, A)).code === 'bad_request');
  const ca = await call('clearAll', { confirm: 'DELETE ALL' }, A);
  check('clearAll moves the rest', ca.ok && ca.result.moved === 5, ca);
  check('list empty after clear', (await call('list', {}, A)).result.responses.length === 0);

  // accounts
  const k1id = (await call('listUsers', {}, A)).result.users.find((x) => x.username === 'k001').id;
  check('admin turns k001 off', (await call('updateUser', { id: k1id, fields: { active: false } }, A)).ok);
  check('k001 session ended', (await call('list', {}, K1)).code === 'auth');
  check('k001 cannot log in', (await call('login', { username: 'k001', password: 'pass001' })).code === 'bad_login');
  const aid = (await call('me', {}, A)).result.user.id;
  check('admin cannot turn self off', (await call('updateUser', { id: aid, fields: { active: false } }, A)).code === 'bad_request');
  check('change own password', (await call('changePassword', { oldPassword: 'pass002', newPassword: 'newpass2' }, K2)).ok);
  check('new password works', (await call('login', { username: 'k002', password: 'newpass2' })).ok);
  check('logout', (await call('logout', {}, K2)).ok && (await call('me', {}, K2)).code === 'auth');

  // lockout
  for (let i = 0; i < 8; i++) await call('login', { username: 'k002', password: 'bad' });
  check('locked after 8 wrong tries', (await call('login', { username: 'k002', password: 'newpass2' })).code === 'locked');
} finally {
  proc.kill();
}
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
