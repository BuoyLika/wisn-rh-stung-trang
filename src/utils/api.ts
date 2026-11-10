import { SHEETS_API_URL } from '../config';

export class ApiError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
  /** True when the server was not reached (no internet, server down). */
  get offline() {
    return this.code === 'offline';
  }
}

export const isApiConfigured = () => !!SHEETS_API_URL;

/**
 * Calls the Apps Script web app. The body is sent as text/plain on purpose:
 * a JSON content type makes the browser send a CORS preflight that Google
 * does not answer.
 */
export async function apiCall<T = any>(action: string, payload: Record<string, unknown> = {}, token?: string | null): Promise<T> {
  if (!SHEETS_API_URL) throw new ApiError('Server address not set', 'not_configured');
  let res: Response;
  try {
    res = await fetch(SHEETS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, token: token || undefined, ...payload }),
      redirect: 'follow',
    });
  } catch {
    throw new ApiError('No connection', 'offline');
  }
  if (!res.ok) throw new ApiError(`Server error ${res.status}`, 'offline');
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new ApiError('Server sent a bad reply', 'offline');
  }
  if (!data || data.ok !== true) throw new ApiError(data?.error || 'Error', data?.code || 'error');
  return data.result as T;
}

/** Khmer + English text for an error, for showing to people. */
export function errorText(err: unknown): string {
  const e = err as ApiError;
  switch (e?.code) {
    case 'offline':
      return 'គ្មានអ៊ីនធឺណិត ឬម៉ាស៊ីនមេមិនឆ្លើយតប (No connection to the server)';
    case 'auth':
      return 'សូមចូលប្រើប្រព័ន្ធម្តងទៀត (Please log in again)';
    case 'forbidden':
      return 'អ្នកមិនមានសិទ្ធិធ្វើការនេះទេ (You are not allowed to do this)';
    case 'bad_login':
      return 'ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ (Wrong username or password)';
    case 'locked':
      return 'ព្យាយាមខុសច្រើនដងពេក សូមរង់ចាំ ១៥ នាទី (Too many wrong tries, wait 15 minutes)';
    case 'not_configured':
      return 'មិនទាន់កំណត់អាសយដ្ឋានម៉ាស៊ីនមេ (Server address not set)';
    default:
      return e?.message || String(err);
  }
}
