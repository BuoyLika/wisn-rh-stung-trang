export interface HO2Indicator {
  id: string;
  code: string;
  nameKm: string;
  nameEn: string;
  cadre: string;
  department: string;
  category: 'Clinical' | 'Maternity' | 'Inpatient' | 'Diagnostic' | 'Referral' | 'Support';
  baselineCases2025: number;
  currentCases: number;
  unitKm: string;
  unitEn: string;
  defaultAstMins: number; // Activity standard in minutes
  source: string;
}

export const defaultHO2Indicators: HO2Indicator[] = [
  {
    id: 'ind-opd-consult',
    code: 'HO2-OPD-01',
    nameKm: 'ការពិនិត្យ និងពិគ្រោះជំងឺក្រៅទូទៅ (OPD General Consult)',
    nameEn: 'Outpatient General Consultation',
    cadre: 'Medical Assistant / Doctor',
    department: 'OPD / Emergency',
    category: 'Clinical',
    baselineCases2025: 7879,
    currentCases: 7879,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 10,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-opd-ncd',
    code: 'HO2-NCD-02',
    nameKm: 'ការពិគ្រោះ និងតាមដានជំងឺមិនឆ្លង NCD (ទឹកនោមផ្អែម ៧២៥, លើសសម្ពាធឈាម ២៧៩)',
    nameEn: 'NCD Consultations (Diabetes 725, Hypertension 279)',
    cadre: 'Medical Assistant / Doctor',
    department: 'OPD / NCD Clinic',
    category: 'Clinical',
    baselineCases2025: 1004,
    currentCases: 1004,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 20,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-er-resus',
    code: 'HO2-ER-03',
    nameKm: 'ការសង្គ្រោះបន្ទាន់ និងព្យាបាលរបួសធ្ងន់ធ្ងរ (ER Resuscitation & Trauma)',
    nameEn: 'Emergency Resuscitation & Trauma Care',
    cadre: 'Medical Assistant / Doctor',
    department: 'Emergency Room',
    category: 'Clinical',
    baselineCases2025: 835,
    currentCases: 835,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 30,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-ipd-admissions',
    code: 'HO2-IPD-04',
    nameKm: 'ការទទួល និងផ្តាច់អ្នកជំងឺសម្រាកពេទ្យ (IPD Admissions & Discharge)',
    nameEn: 'Inpatient Admissions & Discharges',
    cadre: 'Secondary Nurse',
    department: 'Inpatient Wards',
    category: 'Inpatient',
    baselineCases2025: 1854,
    currentCases: 1854,
    unitKm: 'អ្នកជំងឺ/ឆ្នាំ',
    unitEn: 'admissions/year',
    defaultAstMins: 20,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-ipd-daily-care',
    code: 'HO2-IPD-05',
    nameKm: 'ការតាមដានសញ្ញាជីវិត ថែទាំ និងចាក់ថ្នាំអ្នកជំងឺសម្រាក (Inpatient Daily Bedside Care)',
    nameEn: 'Daily Bedside Care & Vitals (Avg Length of Stay 4.2 days)',
    cadre: 'Secondary Nurse',
    department: 'Inpatient Wards',
    category: 'Inpatient',
    baselineCases2025: 7786, // 1854 admissions x 4.2 days
    currentCases: 7786,
    unitKm: 'ថ្ងៃ-គ្រែ/ឆ្នាំ',
    unitEn: 'bed-days/year',
    defaultAstMins: 15,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥ (ALOS 4.2d)'
  },
  {
    id: 'ind-mat-deliv',
    code: 'HO2-MAT-06',
    nameKm: 'ការជួយសម្រាលកូនធម្មតា និងចាក់អុកស៊ីតូស៊ីន (Normal Delivery & AMTSL)',
    nameEn: 'Normal Vaginal Delivery & Active Management',
    cadre: 'Secondary Midwife',
    department: 'Maternity Ward',
    category: 'Maternity',
    baselineCases2025: 154,
    currentCases: 154,
    unitKm: 'ករណីសម្រាល/ឆ្នាំ',
    unitEn: 'deliveries/year',
    defaultAstMins: 45,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-mat-skin',
    code: 'HO2-MAT-07',
    nameKm: 'ការថែទាំទារកទើបកើត និងស្បែកប៉ះស្បែក ៩០នាទី (EENC Skin-to-Skin)',
    nameEn: 'Early Essential Newborn Care & Skin-to-Skin 90min',
    cadre: 'Secondary Midwife',
    department: 'Maternity Ward',
    category: 'Maternity',
    baselineCases2025: 155,
    currentCases: 155,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 60,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-mat-pnc',
    code: 'HO2-MAT-08',
    nameKm: 'ការពិនិត្យតាមដានសុខភាពម្តាយ និងទារកក្រោយសម្រាល (Postnatal Care - PNC)',
    nameEn: 'Postnatal Care Consultations',
    cadre: 'Secondary Midwife',
    department: 'Maternity Ward',
    category: 'Maternity',
    baselineCases2025: 459,
    currentCases: 459,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 20,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-mat-anc',
    code: 'HO2-MAT-09',
    nameKm: 'ការពិនិត្យតាមដានផ្ទៃពោះ ANC នៅផ្នែកពិគ្រោះក្រៅសម្ភព (Antenatal Care Consult)',
    nameEn: 'Antenatal Care Consultations',
    cadre: 'Secondary Midwife',
    department: 'OPD OB/GYN',
    category: 'Maternity',
    baselineCases2025: 2400,
    currentCases: 2400,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 15,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-mat-via',
    code: 'HO2-MAT-10',
    nameKm: 'ការពិនិត្យស្រាវជ្រាវមហារីកមាត់ស្បូនដោយទឹកខ្មេះ VIA (Cervical Cancer Screening)',
    nameEn: 'VIA Cervical Cancer Screening',
    cadre: 'Secondary Midwife',
    department: 'OPD OB/GYN',
    category: 'Maternity',
    baselineCases2025: 350,
    currentCases: 350,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 20,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-eye-consult',
    code: 'HO2-EYE-11',
    nameKm: 'ការពិគ្រោះ និងវាស់គំហើញផ្នែកភ្នែក (Eye Clinic Consult & Snellen)',
    nameEn: 'Eye Examination & Visual Acuity',
    cadre: 'Medical Assistant / Doctor',
    department: 'Eye Clinic',
    category: 'Clinical',
    baselineCases2025: 60,
    currentCases: 60,
    unitKm: 'ករណី/ឆ្នាំ',
    unitEn: 'cases/year',
    defaultAstMins: 15,
    source: 'HO2 ស្ថិតិមន្ទីរពេទ្យបង្អែក ស្ទឹងត្រង់ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-lab-cbc',
    code: 'HO2-LAB-12',
    nameKm: 'ការធ្វើតេស្តឈាមទូទៅ Complete Blood Count (CBC Analyzer)',
    nameEn: 'Complete Blood Count (CBC) Tests',
    cadre: 'Lab Technician',
    department: 'Laboratory',
    category: 'Diagnostic',
    baselineCases2025: 7985,
    currentCases: 7985,
    unitKm: 'តេស្ត/ឆ្នាំ',
    unitEn: 'tests/year',
    defaultAstMins: 8,
    source: 'HO2 / CamLIS ស្ថិតិមន្ទីរពិសោធន៍ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-lab-afb',
    code: 'HO2-LAB-13',
    nameKm: 'ការពិនិត្យស្លេស្មរកមេរោគរបេង (AFB Sputum Smear Microscopy)',
    nameEn: 'Tuberculosis AFB Smear Microscopy',
    cadre: 'Lab Technician',
    department: 'Laboratory',
    category: 'Diagnostic',
    baselineCases2025: 1026,
    currentCases: 1026,
    unitKm: 'តេស្ត/ឆ្នាំ',
    unitEn: 'tests/year',
    defaultAstMins: 15,
    source: 'HO2 ស្ថិតិមន្ទីរពិសោធន៍ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-pharm-dispense',
    code: 'HO2-PHARM-14',
    nameKm: 'ការរៀបចំ និងចែកថ្នាំអ្នកជំងឺក្រៅ និងក្នុង (Pharmacy Prescription Dispensing)',
    nameEn: 'Prescription Dispensing & Patient Counseling',
    cadre: 'Secondary Pharmacist',
    department: 'Pharmacy',
    category: 'Clinical',
    baselineCases2025: 12500,
    currentCases: 12500,
    unitKm: 'វេជ្ជបញ្ជា/ឆ្នាំ',
    unitEn: 'prescriptions/year',
    defaultAstMins: 5,
    source: 'HO2 ស្ថិតិឱសថស្ថាន ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-referral-ambulance',
    code: 'HO2-REF-15',
    nameKm: 'ការបញ្ជូនអ្នកជំងឺសង្គ្រោះបន្ទាន់ទៅមន្ទីរពេទ្យខេត្តកំពង់ចាម (Ambulance Referral Transfer)',
    nameEn: 'Provincial Ambulance Referrals to Kampong Cham (Round Trip)',
    cadre: 'Ambulance Driver',
    department: 'Emergency & Referral',
    category: 'Referral',
    baselineCases2025: 894,
    currentCases: 894,
    unitKm: 'ជើងបញ្ជូន/ឆ្នាំ',
    unitEn: 'referral trips/year',
    defaultAstMins: 150, // 2.5 hours round trip
    source: 'HO2 សៀវភៅបញ្ជូនអ្នកជំងឺ ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-cssd-sterilize',
    code: 'HO2-CSSD-16',
    nameKm: 'ការលាងសម្អាត និងដុតសម្លាប់មេរោគឧបករណ៍វេជ្ជសាស្ត្រ (Autoclave Sterilization)',
    nameEn: 'Autoclave Instrument Sterilization Cycles',
    cadre: 'Cleaner',
    department: 'CSSD & Support',
    category: 'Support',
    baselineCases2025: 730,
    currentCases: 730,
    unitKm: 'លើកដុត/ឆ្នាំ',
    unitEn: 'cycles/year',
    defaultAstMins: 45,
    source: 'កំណត់ត្រាគ្រប់គ្រងការចម្លងរោគ (IPC) ឆ្នាំ២០២៥'
  },
  {
    id: 'ind-waste-incinerator',
    code: 'HO2-WST-17',
    nameKm: 'ការប្រមូល ដឹកជញ្ជូន និងដុតកម្ទេចសំណល់វេជ្ជសាស្ត្រ (Medical Waste Incineration)',
    nameEn: 'Hazardous Medical Waste Incineration Cycles',
    cadre: 'Cleaner',
    department: 'Hygiene & Support',
    category: 'Support',
    baselineCases2025: 365,
    currentCases: 365,
    unitKm: 'លើកដុត/ឆ្នាំ',
    unitEn: 'cycles/year',
    defaultAstMins: 60,
    source: 'កំណត់ត្រាសុវត្ថិភាពបរិស្ថាន ឆ្នាំ២០២៥'
  }
];
