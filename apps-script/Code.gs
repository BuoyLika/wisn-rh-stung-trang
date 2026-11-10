/**
 * WISN survey backend: a Google Apps Script web app bound to one Google Sheet.
 *
 * Tabs it keeps (made by "WISN > Set up"):
 *   Responses   one row per interview (main columns + full answer JSON)
 *   Duplicates  answers whose staff code already exists, kept for admin review
 *   Deleted     answers an admin deleted (nothing is ever lost)
 *   Users       accounts (passwords stored as salted hashes)
 *   Sessions    login tokens
 *   Config      shared survey form + HO2 indicators
 *
 * The page talks to it with POST {action, token, ...}. Every action except
 * "login" needs a valid token, and the role checks happen here, not in the page.
 * Setup steps: docs/SETUP_GOOGLE_SHEETS.md
 */

var APP_VERSION = '1';
var SESSION_DAYS = 30;
var CHUNK = 45000;          // a Sheets cell holds at most 50,000 characters
var HASH_ROUNDS = 300;
var MAX_FAILS = 8;          // wrong passwords before a 15-minute lock

var SH = {
  responses: 'Responses',
  duplicates: 'Duplicates',
  deleted: 'Deleted',
  users: 'Users',
  sessions: 'Sessions',
  config: 'Config',
  table: 'Answers table'
};

var RESP_COLS = ['id', 'submittedAt', 'interviewerId', 'staffCode', 'staffName', 'staffPhone',
  'primaryDepartment', 'cadre', 'completionTimeSeconds', 'surveyId', 'updatedAt', 'updatedBy'];
var DUP_COLS = ['heldAt', 'heldBy', 'existingId'].concat(RESP_COLS);
var DEL_COLS = ['deletedAt', 'deletedBy'].concat(RESP_COLS);
var USER_COLS = ['id', 'username', 'name', 'role', 'interviewerCode', 'phone', 'organization',
  'active', 'createdAt', 'salt', 'hash'];
var SESSION_COLS = ['token', 'userId', 'createdAt', 'expiresAt'];
var CONFIG_COLS = ['key', 'updatedAt', 'updatedBy'];

// ---------------------------------------------------------------- web app

function doGet() {
  return out_({ ok: true, result: { app: 'wisn-survey', version: APP_VERSION } });
}

function doPost(e) {
  var req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: 'Bad request', code: 'bad_request' });
  }
  try {
    var fn = Object.prototype.hasOwnProperty.call(ACTIONS, req.action) ? ACTIONS[req.action] : null;
    if (!fn) throw err_('Unknown action', 'bad_request');
    return out_({ ok: true, result: fn(req) });
  } catch (err) {
    return out_({ ok: false, error: err.message || String(err), code: err.code || 'error' });
  }
}

var ACTIONS = {
  login: function (req) {
    var username = String(req.username || '').trim().toLowerCase();
    if (!username) throw err_('Enter a username', 'bad_login');
    var cache = CacheService.getScriptCache();
    var key = 'fail_' + username;
    var fails = Number(cache.get(key) || 0);
    if (fails >= MAX_FAILS) throw err_('Too many wrong tries. Wait 15 minutes.', 'locked');

    var u = find_(table_(SH.users, USER_COLS), function (o) {
      return String(o.username).toLowerCase() === username;
    });
    if (!u || u.o.active !== 'TRUE' || hash_(u.o.salt, String(req.password || '')) !== u.o.hash) {
      cache.put(key, String(fails + 1), 900);
      throw err_('Wrong username or password', 'bad_login');
    }
    cache.remove(key);

    return withLock_(function () {
      var st = table_(SH.sessions, SESSION_COLS);
      var now = Date.now();
      // drop expired sessions, bottom up so row numbers stay right
      for (var i = st.items.length - 1; i >= 0; i--) {
        if (Number(st.items[i].o.expiresAt) < now) st.sh.deleteRow(st.items[i].row);
      }
      var token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
      var expiresAt = now + SESSION_DAYS * 86400000;
      append_(table_(SH.sessions, SESSION_COLS), {
        token: token, userId: u.o.id, createdAt: iso_(now), expiresAt: String(expiresAt)
      });
      return { token: token, user: publicUser_(u.o), expiresAt: expiresAt };
    });
  },

  logout: function (req) {
    var token = String(req.token || '');
    if (!token) return { done: true };
    return withLock_(function () {
      var st = table_(SH.sessions, SESSION_COLS);
      var s = find_(st, function (o) { return o.token === token; });
      if (s) st.sh.deleteRow(s.row);
      return { done: true };
    });
  },

  me: function (req) {
    return { user: publicUser_(auth_(req)) };
  },

  /** Responses the caller may see: admin = all, interviewer = own. */
  list: function (req) {
    var user = auth_(req);
    var t = table_(SH.responses, RESP_COLS);
    var list = [];
    t.items.forEach(function (it) {
      var r = parse_(it.json);
      if (!r) return;
      if (user.role !== 'admin' && r.interviewerId !== user.interviewerCode) return;
      list.push(r);
    });
    list.sort(function (a, b) { return String(b.submittedAt).localeCompare(String(a.submittedAt)); });
    var res = { responses: list };
    if (user.role === 'admin') res.duplicatesHeld = table_(SH.duplicates, DUP_COLS).items.length;
    return res;
  },

  /**
   * Save answers.
   * mode "queue" (default, from the survey form): insert or update by id;
   *   a new answer whose staff code already exists goes to Duplicates.
   * mode "import" (admin only, from a backup file): keeps the original interviewer,
   *   skips ids that exist unless overwrite is true, skips duplicate staff codes.
   * mode "publish" (from the offline HTML file): like "queue", but an admin keeps
   *   each answer's own interviewer code.
   */
  submit: function (req) {
    var user = auth_(req);
    var list = Array.isArray(req.responses) ? req.responses : [];
    if (list.length > 300) throw err_('Too many answers in one upload', 'bad_request');
    var importMode = req.mode === 'import';
    if (importMode && user.role !== 'admin') throw err_('Admin only', 'forbidden');
    var overwrite = !!req.overwrite;
    var keepInterviewer = importMode || (req.mode === 'publish' && user.role === 'admin');

    return withLock_(function () {
      var t = table_(SH.responses, RESP_COLS);
      var byId = {}, byCode = {};
      t.items.forEach(function (it) {
        byId[String(it.o.id)] = it;
        if (it.o.staffCode) byCode[codeKey_(it.o.staffCode)] = it;
      });
      var dupT = null;
      var now = iso_(Date.now());
      var results = [];

      list.forEach(function (raw) {
        var r = cleanResponse_(raw);
        if (!r) { results.push({ id: raw && raw.id, status: 'invalid' }); return; }
        if (!keepInterviewer) {
          r.interviewerId = user.interviewerCode;
          r.answers.interviewer_id = user.interviewerCode;
        }
        r.updatedAt = now;
        r.updatedBy = user.username;

        var ex = byId[r.id];
        if (ex) {
          if (importMode && !overwrite) { results.push({ id: r.id, status: 'skipped' }); return; }
          var old = parse_(ex.json) || {};
          if (user.role !== 'admin' && old.interviewerId !== user.interviewerCode) {
            results.push({ id: r.id, status: 'forbidden' }); return;
          }
          var other = r.staffCode && byCode[codeKey_(r.staffCode)];
          if (other && other !== ex) {
            results.push({ id: r.id, status: 'duplicate', existingId: other.o.id }); return;
          }
          writeResponse_(t, ex.row, r);
          results.push({ id: r.id, status: 'updated' });
          return;
        }

        var dup = r.staffCode && byCode[codeKey_(r.staffCode)];
        if (dup) {
          if (!importMode) {
            dupT = dupT || table_(SH.duplicates, DUP_COLS);
            var held = respRow_(r);
            held.heldAt = now; held.heldBy = user.username; held.existingId = dup.o.id;
            append_(dupT, held, JSON.stringify(r));
          }
          results.push({ id: r.id, status: 'duplicate', existingId: dup.o.id });
          return;
        }

        var row = append_(t, respRow_(r), JSON.stringify(r));
        var item = { row: row, o: respRow_(r), json: JSON.stringify(r) };
        byId[r.id] = item;
        if (r.staffCode) byCode[codeKey_(r.staffCode)] = item;
        results.push({ id: r.id, status: 'added' });
      });
      return { results: results };
    });
  },

  update: function (req) {
    var user = auth_(req);
    var id = String(req.id || '');
    var data = req.data && typeof req.data === 'object' ? req.data : null;
    if (!id || !data) throw err_('Missing id or data', 'bad_request');
    return withLock_(function () {
      var t = table_(SH.responses, RESP_COLS);
      var ex = find_(t, function (o) { return String(o.id) === id; });
      if (!ex) throw err_('Answer not found', 'not_found');
      var old = parse_(ex.json) || {};
      if (user.role !== 'admin' && old.interviewerId !== user.interviewerCode) {
        throw err_('You can only edit your own answers', 'forbidden');
      }
      var merged = {};
      Object.keys(old).forEach(function (k) { merged[k] = old[k]; });
      Object.keys(data).forEach(function (k) { merged[k] = data[k]; });
      merged.id = old.id;
      if (user.role !== 'admin') merged.interviewerId = old.interviewerId;
      var r = cleanResponse_(merged);
      if (!r) throw err_('Answer data is not valid', 'bad_request');
      if (r.staffCode && codeKey_(r.staffCode) !== codeKey_(old.staffCode || '')) {
        var other = find_(t, function (o) { return codeKey_(o.staffCode) === codeKey_(r.staffCode); });
        if (other) throw err_('Staff code ' + r.staffCode + ' is already used', 'duplicate');
      }
      r.updatedAt = iso_(Date.now());
      r.updatedBy = user.username;
      writeResponse_(t, ex.row, r);
      return { response: r };
    });
  },

  remove: function (req) {
    var user = auth_(req, true);
    var id = String(req.id || '');
    return withLock_(function () {
      var t = table_(SH.responses, RESP_COLS);
      var ex = find_(t, function (o) { return String(o.id) === id; });
      if (!ex) throw err_('Answer not found', 'not_found');
      moveToDeleted_([ex], user);
      t.sh.deleteRow(ex.row);
      return { removed: id };
    });
  },

  clearAll: function (req) {
    var user = auth_(req, true);
    if (req.confirm !== 'DELETE ALL') throw err_('Not confirmed', 'bad_request');
    return withLock_(function () {
      var t = table_(SH.responses, RESP_COLS);
      var n = t.items.length;
      if (n) {
        moveToDeleted_(t.items, user);
        ensureRows_(t.sh, n + 2); // Sheets refuses to delete every non-frozen row
        t.sh.deleteRows(2, n);
      }
      return { moved: n };
    });
  },

  getConfig: function (req) {
    auth_(req);
    var t = table_(SH.config, CONFIG_COLS);
    var res = { survey: null, ho2: null };
    t.items.forEach(function (it) {
      if (it.o.key === 'survey' || it.o.key === 'ho2') res[it.o.key] = parse_(it.json);
    });
    return res;
  },

  saveConfig: function (req) {
    var user = auth_(req, true);
    var key = String(req.key || '');
    if (key !== 'survey' && key !== 'ho2') throw err_('Unknown setting', 'bad_request');
    if (!req.value || typeof req.value !== 'object') throw err_('Missing value', 'bad_request');
    var json = JSON.stringify(req.value);
    if (json.length > 2000000) throw err_('Setting too large', 'bad_request');
    return withLock_(function () {
      var t = table_(SH.config, CONFIG_COLS);
      var row = { key: key, updatedAt: iso_(Date.now()), updatedBy: user.username };
      var ex = find_(t, function (o) { return o.key === key; });
      if (ex) writeRow_(t, ex.row, row, json); else append_(t, row, json);
      return { saved: key };
    });
  },

  listUsers: function (req) {
    auth_(req, true);
    return { users: table_(SH.users, USER_COLS).items.map(function (it) { return publicUser_(it.o); }) };
  },

  createUser: function (req) {
    var admin = auth_(req, true);
    var u = req.user || {};
    var username = String(u.username || '').trim().toLowerCase();
    var code = String(u.interviewerCode || '').trim().toUpperCase();
    var name = String(u.name || '').trim();
    var role = u.role === 'admin' ? 'admin' : 'interviewer';
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) throw err_('Username: 3-30 letters, numbers, . _ -', 'bad_request');
    if (!code) throw err_('Interviewer code is required', 'bad_request');
    if (!name) throw err_('Name is required', 'bad_request');
    checkPassword_(u.password);
    return withLock_(function () {
      var t = table_(SH.users, USER_COLS);
      if (find_(t, function (o) { return String(o.username).toLowerCase() === username; })) {
        throw err_('Username already taken', 'duplicate');
      }
      if (find_(t, function (o) { return String(o.interviewerCode).toUpperCase() === code; })) {
        throw err_('Interviewer code already used', 'duplicate');
      }
      var salt = Utilities.getUuid();
      var rec = {
        id: 'user-' + Utilities.getUuid().slice(0, 8), username: username, name: name, role: role,
        interviewerCode: code, phone: String(u.phone || ''), organization: String(u.organization || ''),
        active: 'TRUE', createdAt: iso_(Date.now()), salt: salt, hash: hash_(salt, String(u.password))
      };
      append_(t, rec);
      log_('createUser ' + username + ' by ' + admin.username);
      return { user: publicUser_(rec) };
    });
  },

  /** Admin: change name/phone/org/role, turn an account on/off, set a new password. */
  updateUser: function (req) {
    var admin = auth_(req, true);
    var id = String(req.id || '');
    var f = req.fields || {};
    return withLock_(function () {
      var t = table_(SH.users, USER_COLS);
      var ex = find_(t, function (o) { return o.id === id; });
      if (!ex) throw err_('User not found', 'not_found');
      var o = ex.o;
      if (o.id === admin.id && (f.active === false || f.role === 'interviewer')) {
        throw err_('You cannot turn off or demote your own account', 'bad_request');
      }
      ['name', 'phone', 'organization'].forEach(function (k) {
        if (typeof f[k] === 'string') o[k] = f[k].trim();
      });
      if (f.role === 'admin' || f.role === 'interviewer') o.role = f.role;
      if (typeof f.active === 'boolean') o.active = f.active ? 'TRUE' : 'FALSE';
      if (f.newPassword) {
        checkPassword_(f.newPassword);
        o.salt = Utilities.getUuid();
        o.hash = hash_(o.salt, String(f.newPassword));
      }
      writeRow_(t, ex.row, o);
      if (o.active !== 'TRUE' || f.newPassword) endSessions_(o.id);
      return { user: publicUser_(o) };
    });
  },

  changePassword: function (req) {
    var user = auth_(req);
    checkPassword_(req.newPassword);
    return withLock_(function () {
      var t = table_(SH.users, USER_COLS);
      var ex = find_(t, function (o) { return o.id === user.id; });
      if (hash_(ex.o.salt, String(req.oldPassword || '')) !== ex.o.hash) {
        throw err_('Old password is wrong', 'bad_login');
      }
      ex.o.salt = Utilities.getUuid();
      ex.o.hash = hash_(ex.o.salt, String(req.newPassword));
      writeRow_(t, ex.row, ex.o);
      return { done: true };
    });
  }
};

// ---------------------------------------------------------------- sheet menu

function onOpen() {
  SpreadsheetApp.getUi().createMenu('WISN')
    .addItem('1. Set up (tabs + first admin)', 'setup')
    .addItem('Reset a user password', 'menuResetPassword')
    .addItem('Build "Answers table" tab', 'buildAnswersTable')
    .addToUi();
}

/** Makes the tabs and, if there is no admin yet, an "admin" account with a random password. */
function setup() {
  [[SH.responses, RESP_COLS], [SH.duplicates, DUP_COLS], [SH.deleted, DEL_COLS],
    [SH.users, USER_COLS], [SH.sessions, SESSION_COLS], [SH.config, CONFIG_COLS]]
    .forEach(function (p) { sheet_(p[0], p[1]); });
  var t = table_(SH.users, USER_COLS);
  var hasAdmin = t.items.some(function (it) { return it.o.role === 'admin'; });
  var msg;
  if (hasAdmin) {
    msg = 'Tabs are ready. An admin account already exists.';
  } else {
    var pw = randomPassword_();
    var salt = Utilities.getUuid();
    append_(t, {
      id: 'user-admin', username: 'admin', name: 'Admin', role: 'admin', interviewerCode: 'ADM-01',
      phone: '', organization: 'NIPH', active: 'TRUE', createdAt: iso_(Date.now()),
      salt: salt, hash: hash_(salt, pw)
    });
    msg = 'Tabs are ready.\n\nAdmin login\nusername: admin\npassword: ' + pw +
      '\n\nWrite it down now. Change it in the app after the first login.';
  }
  notify_(msg);
  return msg;
}

function menuResetPassword() {
  var ui = SpreadsheetApp.getUi();
  var ans = ui.prompt('Reset password', 'Username:', ui.ButtonSet.OK_CANCEL);
  if (ans.getSelectedButton() !== ui.Button.OK) return;
  var username = ans.getResponseText().trim().toLowerCase();
  withLock_(function () {
    var t = table_(SH.users, USER_COLS);
    var ex = find_(t, function (o) { return String(o.username).toLowerCase() === username; });
    if (!ex) { ui.alert('No user "' + username + '"'); return; }
    var pw = randomPassword_();
    ex.o.salt = Utilities.getUuid();
    ex.o.hash = hash_(ex.o.salt, pw);
    ex.o.active = 'TRUE';
    writeRow_(t, ex.row, ex.o);
    endSessions_(ex.o.id);
    ui.alert('New password for ' + username + ':\n\n' + pw);
  });
}

/** One row per answer, one column per question: easy to read or download as Excel/CSV. */
function buildAnswersTable() {
  var t = table_(SH.responses, RESP_COLS);
  var keys = [], seen = {};
  var rows = t.items.map(function (it) { return parse_(it.json) || {}; });
  rows.forEach(function (r) {
    Object.keys(r.answers || {}).forEach(function (k) { if (!seen[k]) { seen[k] = 1; keys.push(k); } });
  });
  var header = RESP_COLS.concat(keys);
  var values = [header].concat(rows.map(function (r) {
    return RESP_COLS.map(function (c) { return cell_(r[c]); })
      .concat(keys.map(function (k) { return cell_((r.answers || {})[k]); }));
  }));
  var ss = book_();
  var sh = ss.getSheetByName(SH.table) || ss.insertSheet(SH.table);
  sh.clear();
  ensureRows_(sh, values.length);
  ensureCols_(sh, header.length);
  sh.getRange(1, 1, values.length, header.length).setNumberFormat('@').setValues(values);
  sh.setFrozenRows(1);
  notify_('Answers table: ' + rows.length + ' answers, ' + keys.length + ' questions.');
}

// ---------------------------------------------------------------- helpers

function err_(msg, code) { var e = new Error(msg); e.code = code; return e; }

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function iso_(ms) { return new Date(ms).toISOString(); }

function notify_(msg) {
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { Logger.log(msg); }
}

function log_(msg) { Logger.log(msg); }

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function hash_(salt, pw) {
  var h = String(pw);
  for (var i = 0; i < HASH_ROUNDS; i++) {
    h = Utilities.base64Encode(Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, salt + ':' + h, Utilities.Charset.UTF_8));
  }
  return h;
}

function randomPassword_() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 12);
}

function checkPassword_(pw) {
  if (typeof pw !== 'string' || pw.length < 6) throw err_('Password must be at least 6 characters', 'bad_request');
}

function codeKey_(c) { return String(c || '').trim().toUpperCase(); }

function cell_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function parse_(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) { return null; }
}

function publicUser_(o) {
  return {
    id: o.id, username: o.username, name: o.name, role: o.role, interviewerCode: o.interviewerCode,
    phone: o.phone, organization: o.organization, active: o.active === 'TRUE', createdAt: o.createdAt
  };
}

function auth_(req, needAdmin) {
  var token = String(req.token || '');
  if (!token) throw err_('Please log in', 'auth');
  var s = find_(table_(SH.sessions, SESSION_COLS), function (o) { return o.token === token; });
  if (!s || Number(s.o.expiresAt) < Date.now()) throw err_('Session ended, please log in again', 'auth');
  var u = find_(table_(SH.users, USER_COLS), function (o) { return o.id === s.o.userId; });
  if (!u || u.o.active !== 'TRUE') throw err_('Account is turned off', 'auth');
  if (needAdmin && u.o.role !== 'admin') throw err_('Admin only', 'forbidden');
  return u.o;
}

function endSessions_(userId) {
  var st = table_(SH.sessions, SESSION_COLS);
  for (var i = st.items.length - 1; i >= 0; i--) {
    if (st.items[i].o.userId === userId) st.sh.deleteRow(st.items[i].row);
  }
}

/** Checks an incoming answer and copies only known fields. */
function cleanResponse_(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.id || typeof raw.answers !== 'object' || raw.answers === null || Array.isArray(raw.answers)) return null;
  var r = {
    id: String(raw.id).slice(0, 100),
    surveyId: String(raw.surveyId || ''),
    submittedAt: String(raw.submittedAt || iso_(Date.now())),
    completionTimeSeconds: Number(raw.completionTimeSeconds) || 0,
    interviewerId: String(raw.interviewerId || ''),
    staffCode: String(raw.staffCode || '').trim(),
    staffName: raw.staffName == null ? '' : String(raw.staffName),
    staffPhone: raw.staffPhone == null ? '' : String(raw.staffPhone),
    primaryDepartment: raw.primaryDepartment == null ? '' : String(raw.primaryDepartment),
    cadre: raw.cadre == null ? '' : String(raw.cadre),
    answers: raw.answers
  };
  if (Array.isArray(raw.customTasks)) r.customTasks = raw.customTasks;
  return r;
}

function respRow_(r) {
  var o = {};
  RESP_COLS.forEach(function (c) { o[c] = r[c]; });
  return o;
}

function writeResponse_(t, row, r) { writeRow_(t, row, respRow_(r), JSON.stringify(r)); }

function moveToDeleted_(items, user) {
  var dt = table_(SH.deleted, DEL_COLS);
  var now = iso_(Date.now());
  items.forEach(function (it) {
    var o = {};
    Object.keys(it.o).forEach(function (k) { o[k] = it.o[k]; });
    o.deletedAt = now;
    o.deletedBy = user.username;
    append_(dt, o, it.json);
  });
}

// ---- generic tab access. All cells are plain text ('@'), so values that start
// with = + - @ are stored as text, never run as formulas.

function book_() { return SpreadsheetApp.getActiveSpreadsheet(); }

function sheet_(name, cols) {
  var ss = book_();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).setNumberFormat('@');
    ensureCols_(sh, cols.length);
    sh.getRange(1, 1, 1, cols.length).setValues([cols]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function ensureRows_(sh, upto) {
  var max = sh.getMaxRows();
  if (upto > max) {
    var add = upto - max + 200;
    sh.insertRowsAfter(max, add);
    sh.getRange(max + 1, 1, add, sh.getMaxColumns()).setNumberFormat('@');
  }
}

function ensureCols_(sh, upto) {
  var max = sh.getMaxColumns();
  if (upto > max) {
    var add = upto - max + 5;
    sh.insertColumnsAfter(max, add);
    sh.getRange(1, max + 1, sh.getMaxRows(), add).setNumberFormat('@');
  }
}

var JSON_COL = /^json_(\d+)$/;

/** Reads a tab into {sh, header, items:[{row, o, json}], next}. */
function table_(name, cols) {
  var sh = sheet_(name, cols);
  var lastRow = sh.getLastRow();
  var lastCol = Math.max(sh.getLastColumn(), cols.length);
  var values = lastRow > 0 ? sh.getRange(1, 1, lastRow, lastCol).getValues() : [cols];
  var header = values[0].map(function (h) { return String(h); });
  while (header.length && header[header.length - 1] === '') header.pop();
  var items = [];
  for (var i = 1; i < values.length; i++) {
    var v = values[i];
    var o = {}, json = '', empty = true;
    for (var c = 0; c < header.length; c++) {
      var val = v[c] === null || v[c] === undefined ? '' : String(v[c]);
      if (val !== '') empty = false;
      if (JSON_COL.test(header[c])) json += val; else if (header[c]) o[header[c]] = val;
    }
    if (!empty) items.push({ row: i + 1, o: o, json: json });
  }
  return { sh: sh, header: header, items: items, next: values.length + 1 };
}

function find_(t, pred) {
  for (var i = 0; i < t.items.length; i++) if (pred(t.items[i].o)) return t.items[i];
  return null;
}

function splitJson_(s) {
  var parts = [];
  for (var i = 0; i < s.length; i += CHUNK) parts.push(s.slice(i, i + CHUNK));
  return parts;
}

/** Writes one row; json (optional) is split over json_1, json_2, ... columns. */
function writeRow_(t, rowNum, obj, json) {
  var chunks = json == null ? [] : splitJson_(json);
  var header = t.header.slice();
  for (var k = 1; k <= chunks.length; k++) {
    if (header.indexOf('json_' + k) < 0) header.push('json_' + k);
  }
  if (header.length > t.header.length) {
    ensureCols_(t.sh, header.length);
    t.sh.getRange(1, 1, 1, header.length).setValues([header]);
    t.header = header;
  }
  var arr = header.map(function (h) {
    var m = JSON_COL.exec(h);
    if (m) return chunks[Number(m[1]) - 1] || '';
    return cell_(obj[h]);
  });
  ensureRows_(t.sh, rowNum);
  t.sh.getRange(rowNum, 1, 1, arr.length).setValues([arr]);
}

function append_(t, obj, json) {
  var row = t.next;
  writeRow_(t, row, obj, json);
  t.items.push({ row: row, o: obj, json: json || '' });
  t.next = row + 1;
  return row;
}
