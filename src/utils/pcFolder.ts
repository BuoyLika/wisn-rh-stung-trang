// Saves a copy of every answer as a .json file in a folder on the PC
// (offline HTML file). Uses the browser's folder access (Chrome / Edge).
// The folder is picked once; the browser remembers it, but after the page is
// reopened it asks again for permission, which needs one click.
import { SurveyResponse } from '../types';

const DB = 'wisn_offline_fs';
const STORE = 'handles';
const KEY = 'answers_folder';

export type FolderState = { status: 'unsupported' | 'none' | 'needs_permission' | 'ready'; name?: string };

export const folderSupported = (): boolean => typeof (window as any).showDirectoryPicker === 'function';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idb<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

let handle: any = null;

async function getHandle(): Promise<any> {
  if (handle) return handle;
  try {
    handle = (await idb<any>('readonly', (s) => s.get(KEY))) || null;
  } catch {
    handle = null;
  }
  return handle;
}

export async function folderState(): Promise<FolderState> {
  if (!folderSupported()) return { status: 'unsupported' };
  const h = await getHandle();
  if (!h) return { status: 'none' };
  const p = await h.queryPermission({ mode: 'readwrite' });
  return { status: p === 'granted' ? 'ready' : 'needs_permission', name: h.name };
}

/** Pick (or re-allow) the folder. Must be called from a click. */
export async function connectFolder(pickNew: boolean): Promise<FolderState> {
  let h = pickNew ? null : await getHandle();
  if (!h) {
    h = await (window as any).showDirectoryPicker({ id: 'wisn-answers', mode: 'readwrite' });
    handle = h;
    await idb('readwrite', (s) => s.put(h, KEY));
  }
  const p = await h.requestPermission({ mode: 'readwrite' });
  return { status: p === 'granted' ? 'ready' : 'needs_permission', name: h.name };
}

async function writeFile(name: string, text: string): Promise<boolean> {
  const st = await folderState();
  if (st.status !== 'ready') return false;
  const fh = await handle.getFileHandle(name, { create: true });
  const w = await fh.createWritable();
  await w.write(text);
  await w.close();
  return true;
}

const safeName = (s: string) => s.replace(/[^A-Za-z0-9._-]/g, '_');

let queue: Promise<unknown> = Promise.resolve();

/** One file per answer + one file with everything. Returns false if no folder is connected. */
export function saveAnswersToFolder(changed: SurveyResponse[], all: SurveyResponse[]): Promise<boolean> {
  // one write at a time: two writers on the same file can fail in the browser
  const job = queue.then(() => writeAll(changed, all));
  queue = job.catch(() => undefined);
  return job;
}

async function writeAll(changed: SurveyResponse[], all: SurveyResponse[]): Promise<boolean> {
  try {
    for (const r of changed) {
      const ok = await writeFile(`${safeName(r.id)}.json`, JSON.stringify(r, null, 2));
      if (!ok) return false;
    }
    return await writeFile(
      'WISN-all-answers.json',
      JSON.stringify({ app: 'WISN offline survey', savedAt: new Date().toISOString(), total: all.length, responses: all }, null, 2)
    );
  } catch (err) {
    console.warn('Could not write to the answers folder:', err);
    return false;
  }
}
