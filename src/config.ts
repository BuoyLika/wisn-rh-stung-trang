// Address of the Google Apps Script web app that stores all answers.
// Paste the "Web app URL" from the deployment here (ends with /exec).
// See docs/SETUP_GOOGLE_SHEETS.md. It is not a secret: every action needs a login.
// For local testing, VITE_SHEETS_API_URL overrides it (e.g. the mock at http://localhost:8787).
const env = ((import.meta as any).env || {}) as Record<string, string | undefined>;

export const SHEETS_API_URL: string = env.VITE_SHEETS_API_URL || '';

// Offline HTML file (npm run build:offline): answers stay on the PC until
// "Publish to Google Sheet". No login needed to fill the survey.
export const OFFLINE_MODE: boolean = env.VITE_OFFLINE === '1';
