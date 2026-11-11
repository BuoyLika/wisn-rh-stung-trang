export type QuestionType =
  | 'text'            // Short text answer
  | 'textarea'        // Long descriptive text
  | 'single_choice'   // Radio button (Choose one)
  | 'multiple_choice' // Checkbox (Choose multiple)
  | 'likert_5'        // 5-point Likert Scale
  | 'rating_stars'    // 1-5 Star rating
  | 'number';         // Numerical input (e.g. Minutes, Cases, Days)

export type WisnActivityCategory = 'core' | 'cas' | 'ias';

export interface Option {
  id: string;
  labelKm: string;
  labelEn: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  titleKm: string;
  titleEn: string;
  descriptionKm?: string;
  descriptionEn?: string;
  required: boolean;
  options?: Option[];
  placeholderKm?: string;
  placeholderEn?: string;
  category?: string; // e.g. "AWT", "OPD", "Eye", "Core", "CAS", "IAS"
  activityType?: WisnActivityCategory; // 'core' = ស្នូល, 'cas' = គាំទ្រ, 'ias' = រដ្ឋបាល
  departmentFilter?: string[];
  ho2Stats?: string; // HO2 2025 statistics
  unit?: string;
}

export interface SurveySection {
  id: string;
  titleKm: string;
  titleEn: string;
  descriptionKm?: string;
  descriptionEn?: string;
  questionIds: string[];
  deptCode?: string;
}

export interface CustomTaskItem {
  id: string;
  name: string;
  category: 'core' | 'cas' | 'ias';
  cases: string;
  period: string;
  mins: string;
  notes?: string;
  departmentCode?: string;
}

export interface ResearchSurvey {
  id: string;
  titleKm: string;
  titleEn: string;
  objectiveKm: string;
  objectiveEn: string;
  leadResearcherKm: string;
  leadResearcherEn: string;
  institutionKm: string;
  institutionEn: string;
  consentNoticeKm: string;
  consentNoticeEn: string;
  hospitalNameKm?: string;
  hospitalNameEn?: string;
  sections: SurveySection[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  submittedAt: string;
  completionTimeSeconds: number;
  interviewerId?: string;
  staffCode: string;
  staffName?: string;
  staffPhone?: string;
  primaryDepartment?: string;
  cadre?: string;
  answers: Record<string, any>;
  customTasks?: CustomTaskItem[];
  /** Only on this device: 'pending' = saved here, not uploaded to the Sheet yet. */
  syncStatus?: 'pending';
}

export type Language = 'km' | 'en';

export type AppView = 'survey' | 'wisn_calculator' | 'builder' | 'analytics' | 'responses';

export interface WhoWisnCadreModel {
  cadre: string;
  primaryDepartment: string;
  actualStaff: number;
  sampleAwtHours: number;
  sampleAwtMins: number;
  annualCoreDemandMins: number;
  coreStaffReq: number; // Wc = annualCoreDemandMins / sampleAwtMins
  casPercentage: number;
  caf: number; // 1 / (1 - cas%)
  iasHoursYear: number;
  iaf: number; // iasHoursYear / sampleAwtHours
  requiredStaff: number; // (Wc * CAF) + IAF
  difference: number; // actualStaff - requiredStaff
  wisnRatio: number; // actualStaff / requiredStaff
  status: 'shortage_severe' | 'shortage_moderate' | 'balanced' | 'surplus';
}

export interface TaskShiftingImpact {
  cadre: string;
  currentRatio: number;
  newRatio: number;
  reclaimedHoursPerStaff: number;
  reclaimedDaysPerStaff: number;
  shiftStatus: 'improved' | 'unchanged';
}

export type UserRole = 'admin' | 'interviewer';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  interviewerCode: string;
  phone?: string;
  organization?: string;
  active?: boolean;
  createdAt: string;
}

export interface MergeResult {
  added: number;
  updated: number;
  skipped: number;
  totalIncoming: number;
  newTotal: number;
}


