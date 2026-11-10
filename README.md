# 🏥 WISN Tools Project

### ប្រព័ន្ធកម្រងសំណួរ និងវិភាគបន្ទុកការងារ WISN - មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់
### *Workload Indicators of Staffing Need (WISN) Assessment Platform - RH Stung Trang*

> **វេទិកាស្ទង់មតិ និងគណនាបន្ទុកការងារបុគ្គលិកសុខាភិបាល តាមវិធីសាស្ត្រ WISN របស់អង្គការសុខភាពពិភពលោក (WHO) សហការរវាង វិទ្យាស្ថានជាតិសុខភាពសាធារណៈ (NIPH) និង មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់ ខេត្តកំពង់ចាម**

---

## 🗄️ Where answers are stored (Google Sheet)

All answers, accounts and the shared survey form are kept in one Google Sheet,
through a small Google Apps Script web app ([`apps-script/Code.gs`](apps-script/Code.gs)).
Logins and admin/interviewer rights are checked there, not in the page. Answers
save on the device first and upload when there is internet.

- Setup (once): [`docs/SETUP_GOOGLE_SHEETS.md`](docs/SETUP_GOOGLE_SHEETS.md), then put the web app URL in `src/config.ts`.
- Backup of every interview to a private GitHub repo: [`docs/GITHUB_BACKUP.md`](docs/GITHUB_BACKUP.md).
- Local testing without Google: `npm run mock`, `npm run test:api`, `npm run test:backup`.
- Offline survey as one HTML file (no internet; publish to the Sheet later):
  `npm run build:offline` → `offline/WISN-Tools-Project-Offline.html`, see [`docs/OFFLINE_SURVEY.md`](docs/OFFLINE_SURVEY.md).

---

## 🌟 ការកែលម្អថ្មីចុងក្រោយ (Latest Enhancements)

1. **ការគណនារូបមន្ត WISN ស្តង់ដារ WHO ពេញលេញ (Full WHO WISN Engine):**
   * គណនា **Available Working Time (AWT)** ជាក់ស្តែងតាមបុគ្គលិក និងតាមមុខតំណែង (Cadre)
   * គណនា **Core Staffing Requirement ($W_c$)** = (Annual Workload × AST) / AWT
   * គណនា **Category Allowance Factor (CAF)** = $1 / (1 - \text{CAS \%})$ សម្រាប់ការងារគាំទ្រ
   * គណនា **Individual Allowance Factor (IAF)** = $\text{IAS Hours} / \text{AWT Hours}$ សម្រាប់ការងាររដ្ឋបាល
   * គណនា **Total Required Staff** = $(W_c \times \text{CAF}) + \text{IAF}$
   * បង្ហាញ **WISN Difference (Gap)** និង **WISN Ratio** ជាមួយកម្រិតសម្ពាធការងារ (Shortage, Balanced, Surplus)

2. **ផ្ទាំងគ្រប់គ្រងស្ថិតិសេវាប្រចាំឆ្នាំ (HO2 Annual Workload Manager & Scenarios):**
   * បញ្ជីសូចនាករសេវា HO2 ឆ្នាំ២០២៥ ចំនួន ១៧ សូចនាករ (OPD, NCD, ER, IPD, Deliveries, EENC, PNC, ANC, VIA, Eye, CBC, AFB, Pharmacy, Ambulance Referrals, CSSD Autoclave, Incinerator)
   * អាចកែប្រែចំនួនករណីប្រចាំឆ្នាំបានភ្លាមៗ និងរក្សាទុកក្នុង LocalStorage
   * ម៉ាស៊ីនពិសោធន៍សេណារីយ៉ូ (Scenario Multiplier): Baseline 2025, +10% Forecast, +20% Expansion, +30% High Surge

3. **ការវិភាគការផ្ទេរភារកិច្ចរដ្ឋបាល (Task Shifting Simulation):**
   * គំរូទាញម៉ោងថែទាំអ្នកជំងឺត្រឡប់មកវិញសម្រាប់វេជ្ជបណ្ឌិត គិលានុបដ្ឋាក និងឆ្មប
   * បង្ហាញផលជះនៃការជ្រើសរើស **ស្មៀនបញ្ចូលទិន្នន័យ (Data Clerks)** ចំនួន ១ ទៅ ៣ នាក់ ដើម្បីកាត់បន្ថយការងាររដ្ឋបាល (IAS) ៥០% ទៅ ៨៥%

4. **របាយការណ៍បច្ចេកទេស និងអនុសាសន៍គោលនយោបាយស្វ័យប្រវត្ត (Executive Policy Brief - Print/PDF):**
   * ប៊ូតុង «របាយការណ៍បច្ចេកទេស (Policy Brief)» បើកឯកសារផ្លូវការសម្រាប់ថ្នាក់ដឹកនាំ NIPH, មន្ទីរសុខាភិបាលខេត្ត និងប្រធានមន្ទីរពេទ្យ
   * រួមមាន Executive Summary, តារាង WHO Staffing Gap, ការវិភាគ Task Shifting, អនុសាសន៍គោលនយោបាយ និងកន្លែងចុះហត្ថលេខា
   * គាំទ្រការបោះពុម្ព ឬ Save ជា PDF ដោយផ្ទាល់ (`window.print()`)

5. **ការទាញយកទិន្នន័យជា Excel កម្រិតស្ដង់ដារ (Multi-Sheet WHO WISN Export):**
   * សន្លឹកទី ១៖ `WISN_Staff_Data` (ទិន្នន័យបុគ្គលិក និង AWT)
   * សន្លឹកទី ២៖ `WISN_Cadre_Proportions` (សមាមាត្រ Core, CAS, IAS)
   * សន្លឹកទី ៣៖ `Unlisted_Custom_Tasks` (សកម្មភាពបន្ថែមផ្ទាល់)
   * សន្លឹកទី ៤៖ `WHO_WISN_Staffing_Model` (តារាងគណនា $W_c$, CAF, IAF, Required Staff, Ratio)
   * សន្លឹកទី ៥៖ `Task_Shifting_Impact` (ផលជះនៃការផ្ទេរការងាររដ្ឋបាល)
   * សន្លឹកទី ៦៖ `HO2_Annual_Workload` (ស្ថិតិប្រចាំឆ្នាំទាំង ១៧ សូចនាករ)
   * សន្លឹកទី ៧៖ `WISN_Codebook` & `Study_Metadata`

6. **ប្រព័ន្ធផ្ទៀងផ្ទាត់សមហេតុផលនៃទិន្នន័យ (Range & Plausibility Validation):**
   * លោត Alert ព្រមានទន់ភ្លន់ (Soft Warning) ពេលបុគ្គលិកវាយបញ្ចូលម៉ោង/ថ្ងៃ > ១៦ ម៉ោង ឬរយៈពេល > ៤៨០ នាទី (៨ ម៉ោង) ក្នុងមួយករណី ដើម្បីការពារការច្រឡំរវាងនាទី និងម៉ោង។

7. **ប្រព័ន្ធបម្រុងទុក និងច្របាច់បញ្ចូលទិន្នន័យពី Tablet (Multi-Device Backup & Sync):**
   * **នាំចេញ Backup JSON:** ទាញយកទិន្នន័យចម្លើយទាំងអស់ជាកញ្ចប់ឯកសារ JSON រក្សាទុកការពារការបាត់បង់
   * **នាំចូល និងច្របាច់បញ្ចូលគ្នា (Merge Multi-Device Responses):** ច្របាច់បញ្ចូលទិន្នន័យពី Tablet ច្រើនគ្រឿងដោយស្វ័យប្រវត្តិ (Auto-Deduplicate តាម Response ID ឬ Staff Code) ព្រមទាំងបង្ហាញស្ថិតិចម្លើយដែលបានបន្ថែមថ្មី ឬរំលង។

8. **ប្រព័ន្ធគ្រប់គ្រងសិទ្ធិ និងចុះឈ្មោះអ្នកសម្ភាសន៍ (Login, Admin & Interviewer Registration):**
   * **តួនាទី Admin (NIPH Research Lead):** សិទ្ធិពេញលេញលើប្រព័ន្ធ (កែទម្រង់សំណួរ, គណនា WISN, កែ/លុបទិន្នន័យចម្លើយ, កំណត់សូចនាករ HO2)
   * **តួនាទី Interviewer (អ្នកជួយសម្ភាសន៍):** ចុះឈ្មោះ និងបង្កើតកូដសម្គាល់ (ឧ. K001, K002) ដោយប្រព័ន្ធនឹង Auto-fill លេខកូដអ្នកសម្ភាសន៍ចូលក្នុងកម្រងសំណួរស្វ័យប្រវត្តិ និងការពារកុំឱ្យលុបទិន្នន័យស្នូល។
   * មានមុខងារ Quick Switch Account និងប៊ូតុងចុះឈ្មោះអ្នកសម្ភាសន៍ថ្មីបានភ្លាមៗ។

1. **បន្ថែមផ្នែកថ្មីចំនួន ២ (New Clinical Departments Added):**
   * **ផ្នែកពិនិត្យជំងឺក្រៅសម្ភព និងរោគស្ត្រី (OPD OB/GYN Clinic):**
     - ការពិនិត្យផ្ទៃពោះ ANC, អេកូសាស្ត្រសម្ភព, ពិនិត្យមហារីកមាត់ស្បូន VIA, សេវាពន្យារកំណើត (ចាក់ថ្នាំ, កងក្នុងស្បូន, កងក្រោមស្បែក Implanon), និងការពិគ្រោះជំងឺរោគស្ត្រី
   * **ផ្នែកភ្នែក (Eye Clinic / Ophthalmology):**
     - ការពិគ្រោះជំងឺភ្នែកទូទៅ (ស្ថិតិ HO2: 60 ករណី/ឆ្នាំ), វាស់គំហើញ Snellen Chart, ពិនិត្យ Slit-Lamp & Tonometry, លាងសម្អាត និងឆ្កឹះកម្ទេចកំទីភ្នែក, និងពិនិត្យភ្នែកឡើងបាយ Cataract

2. **ការបែងចែកសកម្មភាពជា ៣ ជាន់ស្តង់ដារ WHO WISN (3-Tier Activity Breakdown):**
   * **១. ការងារស្នូល (Core / Clinical Service Activities):** សកម្មភាពដែលបំពេញផ្ទាល់លើអ្នកជំងឺ (គិតជា នាទី/ម្នាក់ ឬ នាទី/ករណី)
   * **២. ការងារគាំទ្រ (Support Activities / CAS):** សកម្មភាពរួមក្រុម (Handover, IPC, សម្អាត, Standby)
   * **៣. ការងាររដ្ឋបាល និងឯកសារ (Administrative Activities / IAS):** សកម្មភាពកត់ត្រាឯកសារ, បញ្ចូលទិន្នន័យ HO2/CamLIS, បិទបញ្ជី, ធ្វើបុងថ្នាំ

3. **ប៊ូតុងបន្ថែមសកម្មភាពផ្ទាល់នៅចុងសំណួរ (Inline Dynamic Activity Adder):**
   * នៅខាងចុងផ្នែកនីមួយៗ មានប៊ូតុង **«+ សកម្មភាពស្នូល (Core)»**, **«+ សកម្មភាពគាំទ្រ (CAS)»**, **«+ ការងាររដ្ឋបាល (IAS)»** ដើម្បីឱ្យអ្នកសម្ភាសន៍អាចបន្ថែមសកម្មភាពថ្មី និងវាយបញ្ចូលចំនួនករណី និងរយៈពេលបានភ្លាមៗនៅលើអេក្រង់។

4. **ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យពេញលេញ (Edit & Delete Responses):**
   * នៅលើផ្ទាំង «បញ្ជីចម្លើយ (Responses)» មានប៊ូតុង៖
     - 👁️ **មើលលម្អិត (View Details)**
     - ✏️ **កែប្រែទិន្នន័យ (Edit Data Modal):** កែឈ្មោះ លេខកូដ ទូរស័ព្ទ និងរាល់ចម្លើយ
     - 🗑️ **លុបទិន្នន័យ (Delete Response):** លុបទិន្នន័យមិនត្រឹមត្រូវចេញពីប្រព័ន្ធ

5. **លុបចោលផ្នែកវាយតម្លៃបន្ទុកការងារ (Workload Perception Removed):**
   * បានដកចេញផ្នែកយល់ឃើញពីបន្ទុកការងារ ដើម្បីផ្តោតលើទិន្នន័យបរិមាណពេលវេលា WISN សុទ្ធសាធ។

---

## 🚀 របៀបតំឡើង និងដំណើរការក្នុងម៉ាស៊ីន (Local Run)

```bash
cd "d:\Questionaire for Research"
npm install
npm run dev
```
បើក Browser ទៅកាន់អាសយដ្ឋាន៖ `http://localhost:5173`។

---

## 🐙 របៀបដាក់គម្រោងនេះចូល GitHub (Push to GitHub)

ចុចបើកឯកសារ `push_to_github.bat` ក្នុងថត `d:\Questionaire for Research` ហើយ Paste URL នៃ GitHub Repository របស់អ្នក រួចចុច Enter។
