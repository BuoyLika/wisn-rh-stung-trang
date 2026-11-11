import { ResearchSurvey, SurveyResponse, UserAccount, MergeResult } from '../types';
import { initialSampleSurvey, sampleMockResponses } from '../data/sampleSurvey';
import { HO2Indicator, defaultHO2Indicators } from '../data/ho2WorkloadData';
import { apiCall, ApiError } from './api';
import { OFFLINE_MODE } from '../config';
import { saveAnswersToFolder } from './pcFolder';

// All answers live in the Google Sheet (see apps-script/Code.gs).
// This file keeps a copy on the device so the app works without internet:
//   - cache:  the answers last downloaded from the Sheet
//   - outbox: answers made on this device that are not uploaded yet
// Both are kept per user, so two people sharing a tablet don't mix.

const SURVEY_STORAGE_KEY = 'wisn_stung_trang_survey_config_v7';
const HO2_STORAGE_KEY = 'wisn_stung_trang_ho2_indicators_v1';
const SESSION_KEY = 'wisn_session_v2';
const cacheKey = (uid: string) => `wisn_responses_cache_v2_${uid}`;
const outboxKey = (uid: string) => `wisn_outbox_v2_${uid}`;
const problemsKey = (uid: string) => `wisn_upload_problems_v2_${uid}`;

// Old version (before the Sheet): answers were only in this browser.
const OLD_RESPONSES_KEY = 'wisn_stung_trang_responses_v7';
// Old version kept accounts with plain passwords here; remove them.
['wisn_stung_trang_auth_users_v1', 'wisn_stung_trang_current_user_v1'].forEach((k) => {
  try { localStorage.removeItem(k); } catch { /* storage blocked */ }
});

// ---------------------------------------------------------------- small helpers

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Could not save on this device:', err);
  }
}

function removeKey(key: string): void {
  try { localStorage.removeItem(key); } catch { /* storage blocked */ }
}

// ---------------------------------------------------------------- offline HTML file (answers kept on the PC)

const OFF_PROFILE = 'wisn_offline_profile_v1';
const OFF_ANSWERS = 'wisn_offline_answers_v1';
const OFF_PUBLISHED = 'wisn_offline_published_v1';

export interface OfflineProfile {
  name: string;
  interviewerCode: string;
}

export const getOfflineProfile = (): OfflineProfile | null => readJson<OfflineProfile | null>(OFF_PROFILE, null);

export const setOfflineProfile = (p: OfflineProfile | null): void => {
  if (p) writeJson(OFF_PROFILE, p);
  else removeKey(OFF_PROFILE);
};

const offAnswers = (): SurveyResponse[] => readJson<SurveyResponse[]>(OFF_ANSWERS, []);
const offPublished = (): Set<string> => new Set(readJson<string[]>(OFF_PUBLISHED, []));
const setOffPublished = (ids: Set<string>) => writeJson(OFF_PUBLISHED, [...ids]);

/** Unlike writeJson, this one must not fail quietly: the answers live only here. */
const setOffAnswers = (list: SurveyResponse[]) => {
  try {
    localStorage.setItem(OFF_ANSWERS, JSON.stringify(list));
  } catch {
    throw new Error(
      'កន្លែងផ្ទុកក្នុង Browser ពេញ។ សូម Publish ឬ Download ទិន្នន័យ។ (Browser storage is full: publish or download the answers, then remove published ones.)'
    );
  }
  saveAnswersToFolder([], list).catch(() => { /* no folder */ });
};

const offView = (): SurveyResponse[] => {
  const pub = offPublished();
  return offAnswers().map((r) => (pub.has(r.id) ? r : { ...r, syncStatus: 'pending' as const }));
};

const offUnpublished = (): SurveyResponse[] => {
  const pub = offPublished();
  return offAnswers().filter((r) => !pub.has(r.id));
};

/** Every answer on this PC (for the backup download). */
export const getAllOfflineAnswers = (): SurveyResponse[] => offAnswers();

export interface PublishResult {
  total: number;
  sent: number;
  held: number;
  failed: number;
}

/**
 * Sends the answers not yet published to the Google Sheet. Log in as an admin to
 * keep each answer's own interviewer code (an interviewer login stamps their code).
 */
export const publishToSheet = async (
  username: string,
  password: string,
  onProgress?: (done: number, total: number) => void
): Promise<PublishResult> => {
  const login = await apiCall<{ token: string }>('login', { username, password });
  const token = login.token;
  const todo = offUnpublished();
  const out: PublishResult = { total: todo.length, sent: 0, held: 0, failed: 0 };
  try {
    for (let i = 0; i < todo.length; i += 25) {
      const batch = todo.slice(i, i + 25);
      const res = await apiCall<{ results: { id: string; status: string }[] }>('submit', { mode: 'publish', responses: batch }, token);
      const pub = offPublished();
      res.results.forEach((r) => {
        if (r.status === 'added' || r.status === 'updated') {
          pub.add(r.id);
          out.sent++;
        } else if (r.status === 'duplicate') {
          pub.add(r.id); // kept in the Sheet's "Duplicates" tab
          out.held++;
        } else {
          out.failed++;
        }
      });
      setOffPublished(pub);
      onProgress?.(Math.min(i + 25, todo.length), todo.length);
    }
  } finally {
    apiCall('logout', {}, token).catch(() => { /* fine */ });
  }
  return out;
};

/** Removes answers that are already in the Sheet from this PC (folder copies stay). */
export const removePublishedFromPC = (): number => {
  const pub = offPublished();
  const all = offAnswers();
  const keep = all.filter((r) => !pub.has(r.id));
  setOffAnswers(keep);
  setOffPublished(new Set());
  return all.length - keep.length;
};

/** A unique id for a new answer. */
export const newResponseId = (interviewerCode: string, staffCode: string): string =>
  `RESP-${interviewerCode || 'X'}-${staffCode || '000'}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

// ---------------------------------------------------------------- survey form + HO2 (shared config)

const isCompleteSurvey = (s: any): boolean =>
  !!s &&
  s.sections?.some((x: any) => x.id === 'sec-g-opd-obgyn') &&
  s.sections?.some((x: any) => x.id === 'sec-g-eye') &&
  (s.questions?.length || 0) >= initialSampleSurvey.questions.length;

export const getSavedSurvey = (): ResearchSurvey => {
  const parsed = readJson<ResearchSurvey | null>(SURVEY_STORAGE_KEY, null);
  if (!isCompleteSurvey(parsed)) {
    writeJson(SURVEY_STORAGE_KEY, initialSampleSurvey);
    return initialSampleSurvey;
  }
  return parsed as ResearchSurvey;
};

export const saveSurvey = (survey: ResearchSurvey): void => writeJson(SURVEY_STORAGE_KEY, survey);

export const resetSurveyToDefault = (): ResearchSurvey => {
  removeKey(SURVEY_STORAGE_KEY);
  return initialSampleSurvey;
};

let configLoaded = false;
let lastRemoteHo2 = '';
let ho2Timer: ReturnType<typeof setTimeout> | null = null;

/** Downloads the shared survey form and HO2 numbers, and keeps them on the device. */
export const loadConfig = async (): Promise<{ survey: ResearchSurvey | null; ho2: HO2Indicator[] | null }> => {
  if (OFFLINE_MODE) return { survey: null, ho2: null };
  const res = await apiCall<{ survey: ResearchSurvey | null; ho2: HO2Indicator[] | null }>('getConfig', {}, getToken());
  const survey = isCompleteSurvey(res.survey) ? res.survey : null;
  if (survey) saveSurvey(survey);
  if (Array.isArray(res.ho2)) {
    writeJson(HO2_STORAGE_KEY, res.ho2);
    lastRemoteHo2 = JSON.stringify(res.ho2);
  } else {
    lastRemoteHo2 = '';
  }
  configLoaded = true;
  return { survey, ho2: Array.isArray(res.ho2) ? res.ho2 : null };
};

/** Admin: makes this the survey form for every device. */
export const saveSurveyRemote = async (survey: ResearchSurvey): Promise<void> => {
  saveSurvey(survey);
  if (OFFLINE_MODE) return;
  await apiCall('saveConfig', { key: 'survey', value: survey }, getToken());
};

export const getSavedHO2Indicators = (): HO2Indicator[] => {
  const v = readJson<HO2Indicator[] | null>(HO2_STORAGE_KEY, null);
  return Array.isArray(v) ? v : defaultHO2Indicators;
};

/** Saves on the device; an admin's changes also go to the Sheet (a few seconds later). */
export const saveHO2Indicators = (indicators: HO2Indicator[]): void => {
  writeJson(HO2_STORAGE_KEY, indicators);
  const user = getCurrentUser();
  // Only after the shared copy was loaded, so a new device never overwrites it with defaults.
  if (!configLoaded || user?.role !== 'admin') return;
  const json = JSON.stringify(indicators);
  if (json === lastRemoteHo2) return;
  if (ho2Timer) clearTimeout(ho2Timer);
  ho2Timer = setTimeout(() => {
    apiCall('saveConfig', { key: 'ho2', value: indicators }, getToken())
      .then(() => { lastRemoteHo2 = json; })
      .catch((err) => console.warn('HO2 not saved to the Sheet yet:', err));
  }, 2000);
};

export const resetHO2Indicators = (): HO2Indicator[] => {
  removeKey(HO2_STORAGE_KEY);
  return defaultHO2Indicators;
};

// ---------------------------------------------------------------- login

interface Session {
  token: string | null;
  user: UserAccount;
  expiresAt: number;
}

const getSession = (): Session | null => readJson<Session | null>(SESSION_KEY, null);

export const getToken = (): string | null => (OFFLINE_MODE ? null : getSession()?.token || null);

const DEFAULT_USER: UserAccount = {
  id: 'user-default-01',
  username: 'k001',
  name: 'អ្នកសម្ភាសន៍ (Enumerator K001)',
  role: 'admin',
  interviewerCode: 'K001',
  createdAt: ''
};

/** The logged-in user. Default to active interviewer account (No login block). */
export const getCurrentUser = (): UserAccount => {
  if (OFFLINE_MODE) {
    const p = getOfflineProfile();
    return {
      id: 'local-' + (p?.interviewerCode || 'K001'),
      username: 'local',
      name: p?.name || 'អ្នកសម្ភាសន៍ K001',
      role: 'admin',
      interviewerCode: p?.interviewerCode || 'K001',
      createdAt: ''
    };
  }
  const s = getSession();
  return s?.user || DEFAULT_USER;
};

export const loginUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; user?: UserAccount; error?: unknown }> => {
  try {
    const res = await apiCall<{ token: string; user: UserAccount; expiresAt: number }>('login', { username, password });
    const prev = getSession();
    if (prev && prev.user.id !== res.user.id) removeKey(cacheKey(prev.user.id));
    writeJson(SESSION_KEY, { token: res.token, user: res.user, expiresAt: res.expiresAt });
    configLoaded = false;
    return { success: true, user: res.user };
  } catch (error) {
    return { success: false, error };
  }
};

/** Logs out. Answers still waiting to upload stay on the device for the next login. */
export const logoutUser = async (): Promise<void> => {
  if (OFFLINE_MODE) {
    setOfflineProfile(null);
    return;
  }
  const s = getSession();
  if (!s) return;
  removeKey(SESSION_KEY);
  removeKey(cacheKey(s.user.id));
  configLoaded = false;
  if (s.token) apiCall('logout', {}, s.token).catch(() => { /* offline: token expires on its own */ });
};

/** The server said the login is no longer valid. */
const dropToken = () => {
  const s = getSession();
  if (s) writeJson(SESSION_KEY, { ...s, token: null });
};

export const changePassword = (oldPassword: string, newPassword: string) =>
  apiCall('changePassword', { oldPassword, newPassword }, getToken());

// ---------------------------------------------------------------- user accounts (admin)

export type NewUser = Omit<UserAccount, 'id' | 'createdAt' | 'active'> & { password: string };

export const listUsers = async (): Promise<UserAccount[]> =>
  (await apiCall<{ users: UserAccount[] }>('listUsers', {}, getToken())).users;

export const createUser = async (user: NewUser): Promise<UserAccount> =>
  (await apiCall<{ user: UserAccount }>('createUser', { user }, getToken())).user;

export const updateUser = async (
  id: string,
  fields: Partial<Pick<UserAccount, 'name' | 'phone' | 'organization' | 'role' | 'active'>> & { newPassword?: string }
): Promise<UserAccount> => (await apiCall<{ user: UserAccount }>('updateUser', { id, fields }, getToken())).user;

// ---------------------------------------------------------------- answers

export interface UploadProblem {
  id: string;
  staffCode: string;
  status: string;
  at: string;
  response: SurveyResponse;
}

const uid = () => getSession()?.user.id || '';
const getOutbox = (): SurveyResponse[] => (uid() ? readJson<SurveyResponse[]>(outboxKey(uid()), []) : []);
const setOutbox = (list: SurveyResponse[]) => uid() && writeJson(outboxKey(uid()), list);
const getCache = (): SurveyResponse[] => (uid() ? readJson<SurveyResponse[]>(cacheKey(uid()), []) : []);
const setCache = (list: SurveyResponse[]) => uid() && writeJson(cacheKey(uid()), list);

export const getPendingCount = (): number => (OFFLINE_MODE ? offUnpublished().length : getOutbox().length);

export const getUploadProblems = (): UploadProblem[] => (uid() ? readJson<UploadProblem[]>(problemsKey(uid()), []) : []);

export const clearUploadProblems = (): void => { if (uid()) removeKey(problemsKey(uid())); };

const addProblems = (items: UploadProblem[]) => {
  if (!items.length || !uid()) return;
  writeJson(problemsKey(uid()), [...items, ...getUploadProblems()].slice(0, 200));
};

/** What the screens show: answers waiting to upload first, then the Sheet's copy. */
export const getSavedResponses = (): SurveyResponse[] => {
  if (OFFLINE_MODE) return offView();
  const outbox = getOutbox().map((r) => ({ ...r, syncStatus: 'pending' as const }));
  const ids = new Set(outbox.map((r) => r.id));
  return [...outbox, ...getCache().filter((r) => !ids.has(r.id))];
};

/** Saves a new answer on the device; syncNow() uploads it. */
export const queueResponse = (response: SurveyResponse): SurveyResponse[] => {
  const clean = { ...response };
  delete clean.syncStatus;
  if (OFFLINE_MODE) {
    const list = [clean, ...offAnswers().filter((r) => r.id !== clean.id)];
    setOffAnswers(list);
    saveAnswersToFolder([clean], list).catch(() => { /* no folder */ });
    return offView();
  }
  setOutbox([clean, ...getOutbox().filter((r) => r.id !== clean.id)]);
  return getSavedResponses();
};

export interface SyncResult {
  responses: SurveyResponse[];
  uploaded: number;
  newProblems: UploadProblem[];
  pending: number;
  duplicatesHeld?: number;
  error?: ApiError;
}

let syncing: Promise<SyncResult> | null = null;

/** Uploads waiting answers, then downloads the current list. Safe to call often. */
export const syncNow = (): Promise<SyncResult> => {
  if (OFFLINE_MODE) {
    return Promise.resolve({ responses: offView(), uploaded: 0, newProblems: [], pending: getPendingCount() });
  }
  if (!syncing) syncing = doSync().finally(() => { syncing = null; });
  return syncing;
};

const doSync = async (): Promise<SyncResult> => {
  const token = getToken();
  let uploaded = 0;
  const newProblems: UploadProblem[] = [];
  const done = (extra: Partial<SyncResult> = {}): SyncResult => ({
    responses: getSavedResponses(), uploaded, newProblems, pending: getPendingCount(), ...extra,
  });
  try {
    let outbox = getOutbox();
    while (outbox.length) {
      const batch = outbox.slice(0, 25);
      const res = await apiCall<{ results: { id: string; status: string; existingId?: string }[] }>(
        'submit', { mode: 'queue', responses: batch, interviewerCode: getCurrentUser().interviewerCode }, token
      );
      const settled = new Set<string>();
      const now = new Date().toISOString();
      res.results.forEach((r) => {
        const sent = batch.find((b) => b.id === r.id);
        if (!sent) return;
        settled.add(r.id);
        if (r.status === 'added' || r.status === 'updated') uploaded++;
        else newProblems.push({ id: r.id, staffCode: sent.staffCode, status: r.status, at: now, response: sent });
      });
      // Every answer the server replied about leaves the outbox; problems are kept aside.
      outbox = getOutbox().filter((r) => !settled.has(r.id));
      setOutbox(outbox);
      if (!settled.size) break;
    }
    addProblems(newProblems);

    const list = await apiCall<{ responses: SurveyResponse[]; duplicatesHeld?: number }>('list', {}, token);
    setCache(list.responses);
    return done({ duplicatesHeld: list.duplicatesHeld });
  } catch (err) {
    const e = err instanceof ApiError ? err : new ApiError(String(err), 'error');
    if (e.code === 'auth') dropToken();
    addProblems(newProblems);
    return done({ error: e });
  }
};

export const updateResponse = async (responseId: string, data: Partial<SurveyResponse>): Promise<SurveyResponse[]> => {
  if (OFFLINE_MODE) {
    const list = offAnswers().map((r) => (r.id === responseId ? { ...r, ...data, id: r.id, syncStatus: undefined } : r));
    setOffAnswers(list);
    const pub = offPublished();
    pub.delete(responseId); // publish again so the Sheet gets the change
    setOffPublished(pub);
    const changed = list.find((r) => r.id === responseId);
    if (changed) saveAnswersToFolder([changed], list).catch(() => { /* no folder */ });
    return offView();
  }
  const outbox = getOutbox();
  if (outbox.some((r) => r.id === responseId)) {
    setOutbox(outbox.map((r) => (r.id === responseId ? { ...r, ...data, id: r.id, syncStatus: undefined } : r)));
    return getSavedResponses();
  }
  const clean = { ...data };
  delete clean.syncStatus;
  const res = await apiCall<{ response: SurveyResponse }>('update', { id: responseId, data: clean }, getToken());
  setCache(getCache().map((r) => (r.id === responseId ? res.response : r)));
  return getSavedResponses();
};

/** Waiting answers are removed from the device; uploaded ones go to the Sheet's "Deleted" tab (admin). */
export const deleteResponse = async (responseId: string): Promise<SurveyResponse[]> => {
  if (OFFLINE_MODE) {
    setOffAnswers(offAnswers().filter((r) => r.id !== responseId));
    return offView();
  }
  const outbox = getOutbox();
  if (outbox.some((r) => r.id === responseId)) {
    setOutbox(outbox.filter((r) => r.id !== responseId));
    return getSavedResponses();
  }
  await apiCall('remove', { id: responseId }, getToken());
  setCache(getCache().filter((r) => r.id !== responseId));
  return getSavedResponses();
};

/** Admin: moves every answer in the Sheet to its "Deleted" tab. */
export const clearAllResponses = async (): Promise<SurveyResponse[]> => {
  if (OFFLINE_MODE) {
    setOffAnswers([]);
    setOffPublished(new Set());
    return [];
  }
  await apiCall('clearAll', { confirm: 'DELETE ALL' }, getToken());
  setCache([]);
  return getSavedResponses();
};

/** Admin: uploads answers from a backup file, keeping who interviewed. */
export const importResponses = async (incoming: SurveyResponse[], overwrite: boolean): Promise<{ result: MergeResult; responses: SurveyResponse[] }> => {
  if (OFFLINE_MODE) {
    const byId = new Map(offAnswers().map((r) => [r.id, r]));
    let added = 0, updated = 0, skipped = 0;
    incoming.forEach((r) => {
      if (!r || !r.id || typeof r.answers !== 'object') { skipped++; return; }
      const c = { ...r };
      delete c.syncStatus;
      if (byId.has(c.id)) {
        if (overwrite) { byId.set(c.id, c); updated++; } else skipped++;
      } else { byId.set(c.id, c); added++; }
    });
    const list = [...byId.values()].sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));
    setOffAnswers(list);
    return { result: { added, updated, skipped, totalIncoming: incoming.length, newTotal: list.length }, responses: offView() };
  }
  const token = getToken();
  let added = 0, updated = 0, skipped = 0;
  for (let i = 0; i < incoming.length; i += 50) {
    const batch = incoming.slice(i, i + 50).map((r) => {
      const c = { ...r };
      delete c.syncStatus;
      return c;
    });
    const res = await apiCall<{ results: { status: string }[] }>('submit', { mode: 'import', overwrite, responses: batch }, token);
    res.results.forEach((r) => {
      if (r.status === 'added') added++;
      else if (r.status === 'updated') updated++;
      else skipped++;
    });
  }
  const sync = await syncNow();
  return {
    result: { added, updated, skipped, totalIncoming: incoming.length, newTotal: sync.responses.length },
    responses: sync.responses,
  };
};

// ---------------------------------------------------------------- answers left by the old version

const isSampleAnswer = (r: SurveyResponse): boolean =>
  sampleMockResponses.some((s) => s.id === r.id && s.staffName === r.staffName) ||
  String(r.staffName || '').startsWith('បុគ្គលិក ST-');

/** Real answers that the old version saved only in this browser. */
export const getOldLocalResponses = (): SurveyResponse[] =>
  OFFLINE_MODE ? [] : readJson<SurveyResponse[]>(OLD_RESPONSES_KEY, []).filter((r) => r && r.id && !isSampleAnswer(r));

/** Puts the old answers in the upload queue (they upload under the logged-in interviewer). */
export const queueOldLocalResponses = (): number => {
  const old = getOldLocalResponses();
  const outbox = getOutbox();
  const have = new Set(outbox.map((r) => r.id));
  const add = old
    .filter((r) => !have.has(r.id))
    .map((r) => ({ ...r, id: newResponseId(getCurrentUser()?.interviewerCode || '', r.staffCode) }));
  setOutbox([...add, ...outbox]);
  removeKey(OLD_RESPONSES_KEY);
  return add.length;
};
