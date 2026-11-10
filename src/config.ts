// Address of the Google Apps Script web app that stores all answers.
// Paste the "Web app URL" from the deployment here (ends with /exec).
// See docs/SETUP_GOOGLE_SHEETS.md. It is not a secret: every action needs a login.
// For local testing, VITE_SHEETS_API_URL overrides it (e.g. the mock at http://localhost:8787).
const fromEnv = ((import.meta as any).env?.VITE_SHEETS_API_URL as string | undefined) || '';

export const SHEETS_API_URL: string = fromEnv || '';
