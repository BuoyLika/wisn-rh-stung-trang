# Back up every interview to a private GitHub repo

Every time an interview is saved, edited or deleted, the Apps Script also
commits a copy as a JSON file to a **private** GitHub repo. If the Sheet is
ever damaged or emptied, every interview (and every earlier version of it)
is still in the repo history.

About 10 minutes, done once.

> **Never use a code repo for this** (`wisn-rh-stung-trang` or
> `wisn-tools-project`). Answers hold staff names and phone numbers, so they
> go only to the separate data repo. The script refuses to back up into a
> public repo.

## 1. The private repo

Already made: **<https://github.com/buoylika/wisn-survey-data>** (private).
Share it only with the research team.

## 2. Make a key that can only write to that repo

Logged in to GitHub as **buoylika**:

1. <https://github.com/settings/personal-access-tokens/new> (fine-grained token).
2. Token name: `WISN Apps Script backup`. Resource owner: `buoylika`.
   Expiration: until the study ends.
3. Repository access: **Only select repositories** → `wisn-survey-data`.
4. Permissions → Repository permissions → **Contents: Read and write**.
   (Metadata: Read-only is added by itself. Nothing else.)
5. **Generate token** and copy it (it starts with `github_pat_`). Keep it
   private: do not paste it in chats, email or the app code.

## 3. Give the key to the Apps Script

1. In the Sheet: **Extensions → Apps Script**.
2. Paste the new [`apps-script/Code.gs`](../apps-script/Code.gs) over the old one and **Save**.
3. **Project Settings** (gear) → **Script properties** → **Add script property**:

   | Property       | Value                                   |
   |----------------|-----------------------------------------|
   | `GITHUB_TOKEN` | the `github_pat_…` key from step 2      |
   | `GITHUB_REPO`  | `buoylika/wisn-survey-data`            |

   **Save script properties.**
4. **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.
   Google asks for permission again (the script now talks to GitHub and runs a
   timer): **Advanced → Go to … (unsafe) → Allow**. The web app URL stays the same.

## 4. Turn it on and copy what is already there

Reload the Sheet, then in the **WISN** menu:

1. **GitHub backup: check settings** → should say *ON … (private)*.
2. **GitHub backup: turn on timer (every 10 min)**.
3. **GitHub backup: copy ALL answers now**. This sends every answer already in
   the Sheet (Responses, Duplicates, Deleted). Big batches finish over the next
   timer runs.

## How it works

- Files: `responses/<id>.json` (current answers), `duplicates/<id>.json`
  (answers held because the staff code was used before), `deleted/<id>.json`
  (answers an admin deleted, with who and when).
- One commit per change, named like `Add interview 001 (resp-…) by k001`.
  An edit is a new commit, so GitHub history keeps every version.
- Saving never waits on GitHub. Copies first go to the **GitHub backup** tab
  in the Sheet; up to 5 are sent at once, the timer sends the rest every
  10 minutes. If GitHub is down or the key expires, copies stay in that tab
  (with the error in `lastError`) and go out when it works again.
- Offline-file interviews are backed up when they are published to the Sheet.

## If something is wrong

- **WISN → GitHub backup: check settings** shows the problem, e.g.
  `Bad credentials` (key wrong or expired: make a new one, step 2–3) or
  `is PUBLIC` (make the repo private).
- Rows piling up in the **GitHub backup** tab = copies not sent yet; read `lastError`.

## Testing (developers)

```bash
npm run test:backup   # fake GitHub in the local mock: save, edit, delete, outage, public-repo refusal
```
