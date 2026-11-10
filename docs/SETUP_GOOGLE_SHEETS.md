# Set up the Google Sheet that stores all answers

About 10 minutes, done once by the research lead (the person whose Google
account will own the data).

## 1. Make the Sheet

1. Go to <https://sheets.new> with the research Google account.
2. Name it, e.g. **WISN RH Stung Trang – answers**.
3. Share it only with the research team. It will hold staff names and phone
   numbers, and the consent page promises they stay confidential.

## 2. Add the script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete what is in `Code.gs` and paste all of [`apps-script/Code.gs`](../apps-script/Code.gs).
3. **Project Settings** (gear icon) → Time zone: *(GMT+07:00) Bangkok/Phnom Penh*.
4. Press **Save**.

## 3. Run Setup once

1. Go back to the Sheet and reload it. A **WISN** menu appears.
2. **WISN → 1. Set up (tabs + first admin)**.
3. Google asks for permission. Because this is your own script, it shows
   "Google hasn't verified this app": choose **Advanced → Go to … (unsafe)** → **Allow**.
   The script only uses this one Sheet.
4. A box shows the **admin password**. Write it down. (Run Setup again later: it
   will not make a second admin.)

The Sheet now has tabs: Responses, Duplicates, Deleted, Users, Sessions, Config.

## 4. Publish it as a web app

1. In Apps Script: **Deploy → New deployment**.
2. Type (gear): **Web app**.
3. Execute as: **Me**. Who has access: **Anyone**.
   ("Anyone" only means the app can reach it. Nothing can be read or saved
   without logging in with an account from the Users tab.)
4. **Deploy**, then copy the **Web app URL** (ends with `/exec`).

## 5. Connect the app

Send the `/exec` URL to Claude, or paste it into `src/config.ts`:

```ts
export const SHEETS_API_URL: string = fromEnv || 'https://script.google.com/macros/s/…/exec';
```

Then push to GitHub; GitHub Pages rebuilds the site by itself.
Until the URL is set, the site only shows "Not connected to the Google Sheet".

## 6. First login

1. Open the site, log in as `admin` with the password from step 3.
2. Click **Admin** (top right) → **Password** tab → set your own password.
3. **Users** tab → add one account per interviewer (username, code like `K001`,
   password). Give each interviewer their username and password.

## Daily use

- Interviewers log in on their phone/tablet and fill the survey. Answers save on
  the device first and upload by themselves when there is internet. The bar
  under the menu shows "N waiting to upload" until they are in the Sheet.
- **Responses** tab: one row per interview (main columns + the full answer in
  `json_1…`). For one column per question: **WISN → Build "Answers table" tab**,
  then **File → Download → Excel**. The app's own Export button works too.
- **Duplicates** tab: answers whose staff code was already used. Usually the
  same person interviewed twice, or a typo in the staff code. They are kept, not
  counted.
- **Deleted** tab: anything an admin deleted in the app. Nothing is lost.
- Forgot a password: admin → **Users** tab → **Password**. Admin forgot their
  own: in the Sheet, **WISN → Reset a user password**.
- Interviewer leaves the team: **Users** → **Turn off** (they are logged out at once).

## Changing the script later

Paste the new `Code.gs`, Save, then **Deploy → Manage deployments → ✏️ →
Version: New version → Deploy**. The URL stays the same.

## Limits

- Each save or load takes 1–3 seconds (Google Apps Script speed).
- Fine for a few hundred interviews and ~20 interviewers. Google allows about
  20,000 web app calls a day on a free account; each phone uses about 1 a minute while
  the app is open.

## Testing without Google (for developers)

```bash
npm run mock        # local stand-in on http://localhost:8787, prints an admin password
npm run test:api    # 43 checks of the backend rules
VITE_SHEETS_API_URL=http://localhost:8787 npm run dev
```
