# Offline survey (one HTML file)

`offline/WISN-Tools-Project-Offline.html` is the whole survey in one file. Copy it to
any Windows PC and double-click it: it opens in the browser and works with no
internet and no server.

Use **Chrome or Edge** (they can also save every answer into a folder).

## On the PC

1. Double-click `WISN-Tools-Project-Offline.html`.
2. Type your name and interviewer code (e.g. `K001`), then **Start**.
3. Click **Choose folder** in the bar and pick a folder, e.g. `Documents\WISN answers`.
   Every answer is then also saved there as its own `.json` file, plus
   `WISN-all-answers.json` with everything. After the file is reopened, the bar
   asks once to **Allow** the folder again.
4. Do the interviews. The black bar shows how many answers are on this PC and
   how many are not published yet.

Answers are kept in the browser on this PC (they stay after closing it) and in
the folder. **Download all** saves one backup file at any time.

Keep using the same browser on the same PC: answers saved in Chrome are not
seen by Edge, and the other way round. Clearing the browser's site data deletes
them there, so keep the folder on, or press **Download all** often. A backup
file can be loaded back with "Sync Tablet → Import".

## Publish to the Google Sheet (when online)

1. Click **Publish to Google Sheet**.
2. Paste the Sheet's web app link (ends with `/exec`, see `SETUP_GOOGLE_SHEETS.md`);
   it is remembered after the first time.
3. Log in with an **admin** account (keeps each answer's own interviewer code).
4. **Publish now**. Sending again is safe: answers already in the Sheet are
   updated, not doubled. An answer whose staff code is already in the Sheet goes
   to its "Duplicates" tab for review.
5. Optional: **Remove published answers from this PC** to free space (the folder
   files stay).

Editing an answer after publishing marks it "not published" again; publish
again to update the Sheet.

## Build the file (developers)

```bash
npm run build:offline     # writes offline/WISN-Tools-Project-Offline.html
```
