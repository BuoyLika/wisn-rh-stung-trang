// Local stand-in for the Google Apps Script web app, for testing only.
// Runs apps-script/Code.gs in Node with a fake in-memory spreadsheet.
//   node tools/mock-gas/server.mjs [port]      (default 8787)
// Prints the admin password made by setup(). Data is lost when it stops,
// unless MOCK_GAS_FILE=path.json is set (then it is saved there).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const codePath = path.join(here, '..', '..', 'apps-script', 'Code.gs');
const port = Number(process.argv[2] || 8787);
const saveFile = process.env.MOCK_GAS_FILE || '';

// ---------------- fake SpreadsheetApp
class FakeRange {
  constructor(sh, r, c, nr, nc) {
    if (r < 1 || c < 1 || r + nr - 1 > sh.maxRows || c + nc - 1 > sh.maxCols) {
      throw new Error(`Range ${r},${c},${nr},${nc} outside sheet ${sh.name} (${sh.maxRows}x${sh.maxCols})`);
    }
    Object.assign(this, { sh, r, c, nr, nc });
  }
  getValues() {
    const out = [];
    for (let i = 0; i < this.nr; i++) {
      const row = this.sh.data[this.r - 1 + i] || [];
      const vals = [];
      for (let j = 0; j < this.nc; j++) vals.push(row[this.c - 1 + j] ?? '');
      out.push(vals);
    }
    return out;
  }
  setValues(vals) {
    if (vals.length !== this.nr || vals.some((v) => v.length !== this.nc)) throw new Error('setValues size mismatch');
    for (let i = 0; i < this.nr; i++) {
      const ri = this.r - 1 + i;
      while (this.sh.data.length <= ri) this.sh.data.push([]);
      for (let j = 0; j < this.nc; j++) {
        const v = vals[i][j];
        if (typeof v === 'string' && v.length > 50000) throw new Error('Cell over 50000 characters');
        this.sh.data[ri][this.c - 1 + j] = v === null || v === undefined ? '' : String(v);
      }
    }
    save();
    return this;
  }
  setNumberFormat() { return this; }
}

class FakeSheet {
  constructor(name) { this.name = name; this.data = []; this.maxRows = 1000; this.maxCols = 26; }
  getName() { return this.name; }
  getMaxRows() { return this.maxRows; }
  getMaxColumns() { return this.maxCols; }
  getLastRow() {
    for (let i = this.data.length - 1; i >= 0; i--) if ((this.data[i] || []).some((v) => v !== '' && v != null)) return i + 1;
    return 0;
  }
  getLastColumn() {
    let m = 0;
    this.data.forEach((row) => row.forEach((v, j) => { if (v !== '' && v != null) m = Math.max(m, j + 1); }));
    return m;
  }
  getRange(r, c, nr = 1, nc = 1) { return new FakeRange(this, r, c, nr, nc); }
  insertRowsAfter(_after, n) { this.maxRows += n; }
  insertColumnsAfter(_after, n) { this.maxCols += n; }
  deleteRow(r) { this.deleteRows(r, 1); }
  deleteRows(r, n) {
    if (this.maxRows - n < 2) throw new Error('Cannot delete all non-frozen rows');
    this.data.splice(r - 1, n);
    this.maxRows -= n;
    save();
  }
  setFrozenRows() {}
  clear() { this.data = []; save(); }
}

const book = { sheets: new Map() };
if (saveFile && fs.existsSync(saveFile)) {
  for (const s of JSON.parse(fs.readFileSync(saveFile, 'utf8'))) {
    const sh = new FakeSheet(s.name);
    Object.assign(sh, s);
    book.sheets.set(s.name, sh);
  }
}
function save() {
  if (!saveFile) return;
  fs.writeFileSync(saveFile, JSON.stringify([...book.sheets.values()].map((s) => ({
    name: s.name, data: s.data, maxRows: s.maxRows, maxCols: s.maxCols
  }))));
}

const spreadsheet = {
  getSheetByName: (n) => book.sheets.get(n) || null,
  insertSheet: (n) => { const s = new FakeSheet(n); book.sheets.set(n, s); save(); return s; },
};

// ---------------- fake GitHub (for the backup). On when MOCK_GITHUB_REPO is set.
// GET /__github shows the fake repo; GET /__github/fail?n=3 makes the next 3 GitHub calls fail;
// GET /__github/public?on=1 makes the repo public; GET /__run/<fn> runs a Code.gs function.
const ghRepo = process.env.MOCK_GITHUB_REPO || '';
const props = ghRepo ? { GITHUB_TOKEN: 'mock-token', GITHUB_REPO: ghRepo } : {};
const github = { files: new Map(), commits: [], failNext: 0, isPublic: false };
function fakeGithub(url, opts = {}) {
  const method = String(opts.method || 'get').toUpperCase();
  const reply = (code, obj) => ({ getResponseCode: () => code, getContentText: () => JSON.stringify(obj) });
  if (github.failNext > 0) { github.failNext--; return reply(503, { message: 'mock outage' }); }
  if ((opts.headers || {}).Authorization !== 'Bearer mock-token') return reply(401, { message: 'Bad credentials' });
  const u = new URL(url);
  const base = `/repos/${ghRepo}`;
  if (u.pathname === base && method === 'GET') return reply(200, { full_name: ghRepo, private: !github.isPublic });
  if (!u.pathname.startsWith(base + '/contents/')) return reply(404, { message: 'Not Found' });
  const p = decodeURIComponent(u.pathname.slice((base + '/contents/').length));
  const cur = github.files.get(p);
  const body = opts.payload ? JSON.parse(opts.payload) : {};
  if (method === 'GET') return cur ? reply(200, { sha: cur.sha, content: cur.content }) : reply(404, { message: 'Not Found' });
  if (method === 'PUT') {
    if (cur && body.sha !== cur.sha) return reply(409, { message: 'sha mismatch' });
    if (!cur && body.sha) return reply(422, { message: 'sha given for a new file' });
    const sha = crypto.createHash('sha1').update(body.content + Date.now() + Math.random()).digest('hex');
    github.files.set(p, { sha, content: body.content });
    github.commits.push({ message: body.message, path: p, op: cur ? 'update' : 'create' });
    return reply(cur ? 200 : 201, { content: { sha } });
  }
  if (method === 'DELETE') {
    if (!cur) return reply(404, { message: 'Not Found' });
    if (body.sha !== cur.sha) return reply(409, { message: 'sha mismatch' });
    github.files.delete(p);
    github.commits.push({ message: body.message, path: p, op: 'delete' });
    return reply(200, {});
  }
  return reply(405, { message: 'method' });
}
const triggers = [];

const cache = new Map();
const sandbox = {
  SpreadsheetApp: {
    getActiveSpreadsheet: () => spreadsheet,
    getUi: () => { throw new Error('no UI in mock'); },
  },
  Utilities: {
    getUuid: () => crypto.randomUUID(),
    DigestAlgorithm: { SHA_256: 'sha256' },
    Charset: { UTF_8: 'utf8' },
    computeDigest: (alg, s) => [...crypto.createHash(alg).update(String(s), 'utf8').digest()].map((b) => (b > 127 ? b - 256 : b)),
    base64Encode: (data) =>
      typeof data === 'string'
        ? Buffer.from(data, 'utf8').toString('base64')
        : Buffer.from(data.map((b) => (b + 256) % 256)).toString('base64'),
  },
  PropertiesService: {
    getScriptProperties: () => ({ getProperty: (k) => (k in props ? props[k] : null) }),
  },
  UrlFetchApp: { fetch: fakeGithub },
  ScriptApp: {
    getProjectTriggers: () => triggers,
    newTrigger: (fn) => {
      const b = { timeBased: () => b, everyMinutes: () => b, create: () => triggers.push({ getHandlerFunction: () => fn }) };
      return b;
    },
  },
  CacheService: {
    getScriptCache: () => ({
      get: (k) => { const e = cache.get(k); return e && e.until > Date.now() ? e.v : null; },
      put: (k, v, sec) => cache.set(k, { v, until: Date.now() + sec * 1000 }),
      remove: (k) => cache.delete(k),
    }),
  },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ContentService: {
    MimeType: { JSON: 'application/json' },
    createTextOutput: (text) => ({ text, setMimeType() { return this; } }),
  },
  Logger: { log: (m) => console.log('[Logger]', m) },
  console,
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(codePath, 'utf8'), sandbox, { filename: 'Code.gs' });

if (!book.sheets.get('Users')) console.log(vm.runInContext('setup()', sandbox));
else console.log('Loaded saved data from', saveFile);

http.createServer((req, res) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  if (req.method === 'OPTIONS') { res.writeHead(204, headers); res.end(); return; }
  if (req.method === 'GET' && req.url.startsWith('/__')) {
    const u = new URL(req.url, 'http://x');
    let out;
    if (u.pathname === '/__github') {
      out = {
        files: Object.fromEntries([...github.files].map(([p, f]) => [p, JSON.parse(Buffer.from(f.content, 'base64').toString('utf8'))])),
        commits: github.commits,
      };
    } else if (u.pathname === '/__github/fail') {
      github.failNext = Number(u.searchParams.get('n') || 1); out = { failNext: github.failNext };
    } else if (u.pathname === '/__github/public') {
      github.isPublic = u.searchParams.get('on') === '1'; cache.clear(); out = { isPublic: github.isPublic };
    } else if (u.pathname.startsWith('/__run/')) {
      const fn = u.pathname.slice('/__run/'.length);
      out = /^[A-Za-z]\w*$/.test(fn) ? { result: vm.runInContext(`${fn}()`, sandbox) ?? null } : { error: 'bad name' };
    } else if (u.pathname === '/__sheet') {
      const sh = book.sheets.get(u.searchParams.get('name'));
      out = { rows: sh ? sh.data : null };
    }
    res.writeHead(out ? 200 : 404, headers); res.end(JSON.stringify(out || { error: 'not found' })); return;
  }
  // Like Apps Script: a JSON body with a non-simple content type would need a preflight
  // that Google does not answer, so the app must send text/plain.
  if (req.method === 'POST' && !/^text\/plain/.test(req.headers['content-type'] || '')) {
    res.writeHead(415, headers); res.end('{"ok":false,"error":"send text/plain like Apps Script needs"}'); return;
  }
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    let out;
    try {
      out = req.method === 'POST' ? sandbox.doPost({ postData: { contents: body } }) : sandbox.doGet({});
    } catch (e) {
      out = { text: JSON.stringify({ ok: false, error: 'mock crash: ' + e.message }) };
    }
    res.writeHead(200, headers);
    res.end(out.text);
  });
}).listen(port, () => console.log(`Mock Apps Script on http://localhost:${port}`));

// for tests that import this file directly
export { sandbox, book };
