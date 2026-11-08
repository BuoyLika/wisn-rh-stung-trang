import { ResearchSurvey, SurveyResponse, UserAccount, MergeResult } from '../types';
import { initialSampleSurvey, sampleMockResponses } from '../data/sampleSurvey';
import { HO2Indicator, defaultHO2Indicators } from '../data/ho2WorkloadData';

const SURVEY_STORAGE_KEY = 'wisn_stung_trang_survey_config_v7';
const RESPONSES_STORAGE_KEY = 'wisn_stung_trang_responses_v7';
const HO2_STORAGE_KEY = 'wisn_stung_trang_ho2_indicators_v1';
const USERS_STORAGE_KEY = 'wisn_stung_trang_auth_users_v1';
const CURRENT_USER_STORAGE_KEY = 'wisn_stung_trang_current_user_v1';

export const defaultUsers: UserAccount[] = [
  {
    id: 'user-admin-01',
    username: 'admin',
    password: 'admin123',
    name: 'ប្រធានក្រុមស្រាវជ្រាវ (NIPH Lead)',
    role: 'admin',
    interviewerCode: 'ADM-01',
    phone: '012 888 999',
    organization: 'National Institute of Public Health (NIPH)',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'user-int-01',
    username: 'k001',
    password: '123',
    name: 'អ្នកសម្ភាសន៍ ក១ (Enumerator K001)',
    role: 'interviewer',
    interviewerCode: 'K001',
    phone: '097 555 1234',
    organization: 'RH Stung Trang Field Team',
    createdAt: '2026-09-10T08:00:00.000Z'
  },
  {
    id: 'user-int-02',
    username: 'k002',
    password: '123',
    name: 'អ្នកសម្ភាសន៍ ក២ (Enumerator K002)',
    role: 'interviewer',
    interviewerCode: 'K002',
    phone: '097 555 5678',
    organization: 'RH Stung Trang Field Team',
    createdAt: '2026-09-10T08:00:00.000Z'
  }
];

export const getSavedSurvey = (): ResearchSurvey => {
  try {
    const raw = localStorage.getItem(SURVEY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(initialSampleSurvey));
      return initialSampleSurvey;
    }
    const parsed = JSON.parse(raw);
    const hasOpdObGyn = parsed.sections?.some((s: any) => s.id === 'sec-g-opd-obgyn');
    const hasEye = parsed.sections?.some((s: any) => s.id === 'sec-g-eye');
    const isComplete = (parsed.questions?.length || 0) >= initialSampleSurvey.questions.length;
    
    if (!hasOpdObGyn || !hasEye || !isComplete) {
      console.warn('Auto-upgrading outdated survey in storage to latest WISN schema');
      localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(initialSampleSurvey));
      return initialSampleSurvey;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load saved survey from storage:', err);
    return initialSampleSurvey;
  }
};

export const saveSurvey = (survey: ResearchSurvey): void => {
  try {
    localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(survey));
  } catch (err) {
    console.error('Failed to save survey to storage:', err);
  }
};

export const resetSurveyToDefault = (): ResearchSurvey => {
  localStorage.removeItem(SURVEY_STORAGE_KEY);
  return initialSampleSurvey;
};

export const getSavedResponses = (): SurveyResponse[] => {
  try {
    const raw = localStorage.getItem(RESPONSES_STORAGE_KEY);
    if (!raw) return sampleMockResponses;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load responses from storage:', err);
    return sampleMockResponses;
  }
};

export const saveResponse = (response: SurveyResponse): SurveyResponse[] => {
  const current = getSavedResponses();
  const updated = [response, ...current];
  localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateResponse = (responseId: string, updatedData: Partial<SurveyResponse>): SurveyResponse[] => {
  const current = getSavedResponses();
  const updated = current.map((r) => (r.id === responseId ? { ...r, ...updatedData } : r));
  localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteResponse = (responseId: string): SurveyResponse[] => {
  const current = getSavedResponses();
  const updated = current.filter((r) => r.id !== responseId);
  localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAllResponses = (): void => {
  localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify([]));
};

export const getSavedHO2Indicators = (): HO2Indicator[] => {
  try {
    const raw = localStorage.getItem(HO2_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(HO2_STORAGE_KEY, JSON.stringify(defaultHO2Indicators));
      return defaultHO2Indicators;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load HO2 indicators:', err);
    return defaultHO2Indicators;
  }
};

export const saveHO2Indicators = (indicators: HO2Indicator[]): void => {
  try {
    localStorage.setItem(HO2_STORAGE_KEY, JSON.stringify(indicators));
  } catch (err) {
    console.error('Failed to save HO2 indicators:', err);
  }
};

export const resetHO2Indicators = (): HO2Indicator[] => {
  localStorage.removeItem(HO2_STORAGE_KEY);
  return defaultHO2Indicators;
};


export const seedMockResponses = (): SurveyResponse[] => {
  const cadres = [
    { cadre: 'Medical Doctor', dept: 'OPD' },
    { cadre: 'Medical Assistant', dept: 'Eye Clinic' },
    { cadre: 'Secondary Nurse', dept: 'Pediatrics Ward' },
    { cadre: 'Secondary Midwife', dept: 'OPD OB/GYN' },
    { cadre: 'Lab Technician', dept: 'Laboratory' },
    { cadre: 'Secondary Pharmacist', dept: 'Pharmacy' },
    { cadre: 'Ambulance Driver', dept: 'General Support' },
    { cadre: 'Accountant', dept: 'Admin & Finance' }
  ];

  const generated: SurveyResponse[] = [...sampleMockResponses];

  for (let i = 4; i <= 15; i++) {
    const pad = String(i).padStart(3, '0');
    const selected = cadres[i % cadres.length];

    generated.push({
      id: `RESP-ST-${pad}`,
      surveyId: 'wisn-rh-stung-trang-2026',
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 86400000)).toISOString(),
      completionTimeSeconds: Math.floor(Math.random() * 90) + 120,
      interviewerId: 'K001',
      staffCode: pad,
      staffName: `បុគ្គលិក ST-${pad}`,
      staffPhone: `012 ${Math.floor(100000 + Math.random() * 899999)}`,
      primaryDepartment: selected.dept,
      cadre: selected.cadre,
      answers: {
        'interview_date': '2026-11-04',
        'interviewer_id': 'K001',
        'staff_code': pad,
        'gender': i % 2 === 0 ? 'Female' : 'Male',
        'employment_status': i % 4 === 0 ? 'Contract' : 'Civil Servant',
        'cadre': selected.cadre,
        'primary_department': selected.dept,
        'has_second_dept': i % 2 === 0 ? 'Yes' : 'No',
        'work_experience': '> 5 years',
        'awt_days_week': 5,
        'awt_hours_day': 8,
        'awt_annual_leave': 15,
        'awt_holidays': 22,
        'awt_sick_leave': 2,
        'awt_special_leave': 1,
        'awt_training_days': 5,
      }
    });
  }

  localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(generated));
  return generated;
};

// ==========================================
// User Authentication & Management
// ==========================================

export const getSavedUsers = (): UserAccount[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load users:', err);
    return defaultUsers;
  }
};

export const saveUsers = (users: UserAccount[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
};

export const getCurrentUser = (): UserAccount | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return null;
  } catch (err) {
    console.error('Failed to load current user:', err);
    return null;
  }
};

export const setCurrentUser = (user: UserAccount | null): void => {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  }
};

export const loginUser = (username: string, password: string): { success: boolean; user?: UserAccount; error?: string } => {
  const users = getSavedUsers();
  const found = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  if (!found) {
    return { success: false, error: 'រកមិនឃើញគណនីនេះទេ (Account not found)' };
  }
  if (found.password && found.password !== password) {
    return { success: false, error: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ (Invalid password)' };
  }
  setCurrentUser(found);
  return { success: true, user: found };
};

export const registerUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>): { success: boolean; user?: UserAccount; error?: string } => {
  const users = getSavedUsers();
  const exists = users.some((u) => u.username.toLowerCase() === userData.username.trim().toLowerCase());
  if (exists) {
    return { success: false, error: 'ឈ្មោះគណនីនេះមានរួចហើយ (Username already taken)' };
  }
  
  const newUser: UserAccount = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const updated = [...users, newUser];
  saveUsers(updated);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

// ==========================================
// Multi-Device Data Sync & Merge Engine
// ==========================================

export const mergeResponses = (
  incomingResponses: SurveyResponse[],
  overwriteExisting: boolean = false
): MergeResult => {
  const current = getSavedResponses();
  const existingMap = new Map(current.map((r) => [r.id, r]));
  // Also track by staffCode to avoid duplicate submissions for the same staff member
  const codeMap = new Map(current.map((r) => [r.staffCode, r]));

  let added = 0;
  let updated = 0;
  let skipped = 0;

  incomingResponses.forEach((inc) => {
    const existingById = existingMap.get(inc.id);
    const existingByCode = inc.staffCode ? codeMap.get(inc.staffCode) : undefined;

    if (existingById) {
      if (overwriteExisting) {
        existingMap.set(inc.id, inc);
        updated++;
      } else {
        skipped++;
      }
    } else if (existingByCode && !overwriteExisting) {
      // Duplicate staff code
      skipped++;
    } else {
      existingMap.set(inc.id, inc);
      if (inc.staffCode) codeMap.set(inc.staffCode, inc);
      added++;
    }
  });

  const mergedList = Array.from(existingMap.values());
  // Sort latest first
  mergedList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(mergedList));

  return {
    added,
    updated,
    skipped,
    totalIncoming: incomingResponses.length,
    newTotal: mergedList.length
  };
};

