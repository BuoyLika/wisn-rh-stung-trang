import React, { useState, useEffect } from 'react';
import { ResearchSurvey, Language, SurveyResponse, CustomTaskItem, WisnActivityCategory, Question, UserAccount } from '../types';
import { useTranslation } from '../i18n/translations';
import { wisnActivityDefinitions, ActivityDefinition } from '../data/wisnDefinitions';
import { parseTimeToMinutes } from '../utils/wisnCalculations';
import { newResponseId } from '../utils/storage';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  RotateCcw, 
  ShieldCheck, 
  BookOpen, 
  Building2, 
  BarChart2, 
  Plus, 
  Trash2, 
  Sparkles, 
  X, 
  HelpCircle, 
  Stethoscope, 
  Users2, 
  FileCheck,
  Layers
} from 'lucide-react';

interface RespondentViewProps {
  survey: ResearchSurvey;
  language: Language;
  onSubmit: (response: SurveyResponse) => void;
  onViewAnalytics: () => void;
  onResetSurvey?: () => void;
  currentUser?: UserAccount | null;
}

export const RespondentView: React.FC<RespondentViewProps> = ({
  survey,
  language,
  onSubmit,
  onViewAnalytics,
  onResetSurvey,
  currentUser,
}) => {
  const t = useTranslation(language);

  // States
  const [started, setStarted] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [activeTierTab, setActiveTierTab] = useState<'all' | 'core' | 'cas' | 'ias'>('all');
  const [answers, setAnswers] = useState<Record<string, any>>({
    interview_date: new Date().toISOString().split('T')[0],
    interviewer_id: currentUser?.interviewerCode || 'K001',
    awt_days_week: 5,
    awt_hours_day: 8,
    awt_annual_leave: 15,
    awt_holidays: 22,
    awt_sick_leave: 0,
    awt_special_leave: 0,
    awt_training_days: 3,
  });

  // Sync interviewer_id when currentUser changes
  useEffect(() => {
    if (currentUser?.interviewerCode) {
      setAnswers((prev) => ({
        ...prev,
        interviewer_id: currentUser.interviewerCode
      }));
    }
  }, [currentUser]);
  const [customTasks, setCustomTasks] = useState<CustomTaskItem[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  // required questions left empty when Next/Submit was pressed (shown above the buttons)
  const [missing, setMissing] = useState<Question[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [filterByDept, setFilterByDept] = useState(false);
  const [activeDef, setActiveDef] = useState<ActivityDefinition | null>(null);

  useEffect(() => {
    if (started) {
      setStartTime(Date.now());
    }
  }, [started]);

  // Reset tier tab and the missing list when section changes
  useEffect(() => {
    setActiveTierTab('all');
    setMissing([]);
  }, [currentSectionIndex]);

  // Relevant sections
  const primaryDept = answers['primary_department'] || '';
  const secondDept = Array.isArray(answers['second_department']) ? answers['second_department'] : [];

  const visibleSections = survey.sections.filter((sec) => {
    if (!filterByDept) return true;
    if (sec.id === 'sec-staff-info') return true;

    // Smart filtering based on primary or secondary department
    if (sec.deptCode === 'opd_obgyn') {
      return primaryDept === 'OPD OB/GYN' || secondDept.includes('OPD OB/GYN');
    }
    if (sec.deptCode === 'eye') {
      return primaryDept === 'Eye Clinic' || secondDept.includes('Eye Clinic');
    }
    if (sec.deptCode === 'opd') {
      return primaryDept === 'OPD' || primaryDept === 'Emergency Room' || secondDept.includes('OPD') || secondDept.includes('Emergency Room');
    }
    if (sec.deptCode === 'ipd') {
      return primaryDept.includes('Ward') || primaryDept.includes('General Medicine') || primaryDept.includes('Pediatrics') || primaryDept.includes('TB') || secondDept.some((d: string) => d.includes('Ward'));
    }
    if (sec.deptCode === 'maternity') {
      return primaryDept.includes('Maternity') || answers['cadre'] === 'Secondary Midwife' || secondDept.some((d: string) => d.includes('Maternity'));
    }
    if (sec.deptCode === 'lab') {
      return primaryDept === 'Laboratory' || answers['cadre'] === 'Lab Technician' || secondDept.includes('Laboratory');
    }
    if (sec.deptCode === 'pharmacy') {
      return primaryDept === 'Pharmacy' || answers['cadre']?.includes('Pharmacist') || secondDept.includes('Pharmacy');
    }
    if (sec.deptCode === 'imaging') {
      return primaryDept === 'Imaging' || primaryDept === 'Dental Clinic' || primaryDept === 'Physiotherapy';
    }
    if (sec.deptCode === 'admin') {
      return primaryDept.includes('Admin') || secondDept.includes('Admin & Finance');
    }
    if (sec.deptCode === 'support') {
      return primaryDept === 'General Support' || ['Ambulance Driver', 'Cleaner', 'Hospital Cook', 'Security Guard'].includes(answers['cadre']);
    }
    return true;
  });

  const activeSection = visibleSections[currentSectionIndex] || visibleSections[0];
  const sectionQuestions = survey.questions.filter((q) =>
    activeSection.questionIds.includes(q.id)
  );

  const totalQuestions = survey.questions.length;
  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== '' && (!Array.isArray(answers[k]) || answers[k].length > 0)
  ).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / (totalQuestions || 1)) * 100));

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: false }));
      setMissing((prev) => prev.filter((q) => q.id !== questionId));
    }
  };

  const handleCheckboxChange = (questionId: string, optionValue: string) => {
    const currentList: string[] = Array.isArray(answers[questionId]) ? answers[questionId] : [];
    let updated: string[];
    if (currentList.includes(optionValue)) {
      updated = currentList.filter((item) => item !== optionValue);
    } else {
      updated = [...currentList, optionValue];
    }
    handleInputChange(questionId, updated);
  };

  // Inline custom task adder
  const handleAddInlineCustomTask = (category: WisnActivityCategory = 'core') => {
    const newTask: CustomTaskItem = {
      id: 'ct-' + Date.now(),
      name: '',
      category,
      cases: '1',
      period: 'Per Day',
      mins: '15min',
      departmentCode: activeSection.deptCode || 'general'
    };
    setCustomTasks((prev) => [...prev, newTask]);
  };

  const handleUpdateCustomTask = (taskId: string, field: keyof CustomTaskItem, value: any) => {
    setCustomTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, [field]: value } : t))
    );
  };

  const handleRemoveCustomTask = (taskId: string) => {
    setCustomTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    sectionQuestions.forEach((q) => {
      if (q.required) {
        const val = answers[q.id];
        if (
          val === undefined ||
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.length === 0)
        ) {
          newErrors[q.id] = true;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);
    const missingList = sectionQuestions.filter((q) => newErrors[q.id]);
    setMissing(missingList);
    if (hasError) {
      // show every question (a tier tab may hide the empty one), then go to the first empty one
      setActiveTierTab('all');
      setTimeout(() => scrollToQuestion(missingList[0]?.id), 50);
    }
    return !hasError;
  };

  const scrollToQuestion = (id?: string) => {
    if (!id) return;
    document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleNextSection = () => {
    if (validateCurrentSection()) {
      if (currentSectionIndex < visibleSections.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentSection()) return;

    const completionTimeSeconds = Math.max(20, Math.round((Date.now() - startTime) / 1000));
    // unique per interview; a repeated staff code is caught by the Sheet, not by the id
    const randomId = newResponseId(currentUser?.interviewerCode || answers['interviewer_id'] || '', answers['staff_code'] || '');

    const responsePayload: SurveyResponse = {
      id: randomId,
      surveyId: survey.id,
      submittedAt: new Date().toISOString(),
      completionTimeSeconds,
      interviewerId: answers['interviewer_id'],
      staffCode: answers['staff_code'] || '000',
      staffName: answers['staff_name'] || '',
      staffPhone: answers['staff_phone'] || '',
      primaryDepartment: answers['primary_department'] || '',
      cadre: answers['cadre'] || '',
      answers: { ...answers },
      customTasks: [...customTasks]
    };

    onSubmit(responsePayload);
    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setAnswers({
      interview_date: new Date().toISOString().split('T')[0],
      interviewer_id: currentUser?.interviewerCode || '',
      awt_days_week: 5,
      awt_hours_day: 8,
      awt_annual_leave: 15,
      awt_holidays: 22,
      awt_sick_leave: 0,
      awt_special_leave: 0,
      awt_training_days: 3,
    });
    setCustomTasks([]);
    setErrors({});
    setIsSubmitted(false);
    setStarted(false);
    setCurrentSectionIndex(0);
    setConsentAgreed(false);
  };

  // Thank You Screen
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center animate-fade-in">
          <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            {t.thankYouTitle}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
            ទិន្នន័យបន្ទុកការងារ WISN របស់បុគ្គលិកត្រូវបានកត់ត្រាទុកដោយជោគជ័យ និងចូលទៅក្នុងប្រព័ន្ធវិភាគ AWT និង Staffing Gap របស់មន្ទីរពេទ្យបង្អែកស្ទឹងត្រង់។
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.submitAnother}
            </button>
            <button
              onClick={onViewAnalytics}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition shadow-md shadow-teal-600/30"
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              <span>មើលផ្ទាំងវិភាគ WISN</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Introduction Screen
  if (!started) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>WHO WISN Methodology Assessment Form</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black leading-snug tracking-tight mb-4">
              {survey.titleKm}
            </h1>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              {survey.objectiveKm}
            </p>
          </div>

          {/* Research Metadata Cards */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">មន្ទីរពេទ្យគោលដៅ</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">
                    {survey.hospitalNameKm || 'មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">ស្ថាប័នស្រាវជ្រាវ</div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">
                    {survey.institutionKm}
                  </div>
                </div>
              </div>
            </div>

            {/* Ethics & Consent Notice */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>ការយល់ព្រម និងសីលធម៌នៃការស្រាវជ្រាវ (Ethics Consent)</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                {survey.consentNoticeKm}
              </p>
              
              <label className="flex items-center gap-3 mt-4 pt-3 border-t border-amber-200/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-amber-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs sm:text-sm font-semibold text-amber-950">
                  ខ្ញុំបានអាន និងយល់ព្រមចូលរួមផ្តល់ព័ត៌មានបន្ទុកការងារជាក់ស្តែងដោយស្ម័គ្រចិត្ត
                </span>
              </label>
            </div>

            {/* Start Button */}
            <div className="pt-4 flex justify-end">
              <button
                disabled={!consentAgreed}
                onClick={() => setStarted(true)}
                className={`inline-flex items-center justify-center px-8 py-3.5 rounded-2xl text-sm font-bold transition shadow-lg ${
                  consentAgreed
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30 cursor-pointer active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>ចាប់ផ្តើមបំពេញកម្រងសំណួរ WISN</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question Card Renderer
  const renderQuestionCard = (q: Question, idx: number) => {
    const hasError = errors[q.id];
    const currentValue = answers[q.id];

    return (
      <div
        key={q.id}
        id={`q-${q.id}`}
        className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-sm scroll-mt-24 ${
          hasError
            ? 'border-rose-400 ring-2 ring-rose-100'
            : 'border-slate-200 hover:border-teal-200'
        }`}
      >
        {/* Question Header & HO2 Statistics Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.titleKm}
                {q.required && (
                  <span className="text-rose-500 ml-1.5 text-xs font-bold" title={t.requiredField}>
                    *
                  </span>
                )}
              </h3>
              {q.descriptionKm && (
                <p className="text-xs text-slate-500 mt-1">
                  {q.descriptionKm}
                </p>
              )}

              {/* Operational Definition Pill Button */}
              {wisnActivityDefinitions[q.id] && (
                <button
                  type="button"
                  onClick={() => setActiveDef(wisnActivityDefinitions[q.id])}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 px-2 py-0.5 rounded-md mt-1.5 transition active:scale-95 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3 text-teal-600" />
                  <span>និយមន័យរាប់ម៉ោង (Start/End Boundaries)</span>
                </button>
              )}

              {/* Dual Role Overlapping Warning */}
              {(q.id.includes('handover') || q.id.includes('attendance') || q.id.includes('standby') || q.id.includes('monthly_meet')) && answers['has_second_dept'] === 'Yes' && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>ចំណាំ WISN៖ ប្រសិនបើបានឆ្លើយក្នុងផ្នែកមុនរួចហើយ សូមកុំឆ្លើយត្រួតស៊ីគ្នា (ជៀសវាង Double-Counting)។</span>
                </div>
              )}
            </div>
          </div>

          {q.ho2Stats && (
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
              HO2: {q.ho2Stats}
            </span>
          )}
        </div>

        {/* Inputs by Type */}
        <div className="pt-2">
          {/* Single Choice */}
          {q.type === 'single_choice' && q.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {q.options.map((opt) => {
                const selected = currentValue === opt.value;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                      selected
                        ? 'bg-teal-50/80 border-teal-500 text-teal-900 font-semibold shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={selected}
                      onChange={() => handleInputChange(q.id, opt.value)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                    />
                    <span className="text-xs sm:text-sm">
                      {opt.labelKm}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Multiple Choice */}
          {q.type === 'multiple_choice' && q.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {q.options.map((opt) => {
                const checked = Array.isArray(currentValue) && currentValue.includes(opt.value);
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                      checked
                        ? 'bg-teal-50/80 border-teal-500 text-teal-900 font-semibold shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={q.id}
                      value={opt.value}
                      checked={checked}
                      onChange={() => handleCheckboxChange(q.id, opt.value)}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                    />
                    <span className="text-xs sm:text-sm">
                      {opt.labelKm}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Text / Number / Time */}
          {(q.type === 'text' || q.type === 'number') && (
            <div>
              <input
                type={q.type === 'number' ? 'number' : 'text'}
                value={currentValue ?? ''}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                placeholder={q.placeholderKm || 'វាយបញ្ចូលរយៈពេល ឬចំនួន...'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs sm:text-sm font-medium"
              />
              {/* Soft Range / Plausibility Warnings */}
              {q.id === 'awt_hours_day' && Number(currentValue) > 16 && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-lg mt-1.5 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>⚠️ ម៉ោងធ្វើការលើសពី ១៦ ម៉ោងក្នុងមួយថ្ងៃ។ សូមផ្ទៀងផ្ទាត់ថាតើជាវេនយាម ២៤ ម៉ោង ឬជាម៉ោងធ្វើការធម្មតា (៨ ម៉ោង)។</span>
                </div>
              )}
              {q.activityType && parseTimeToMinutes(currentValue) > 480 && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-lg mt-1.5 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>⚠️ រយៈពេលលើសពី ៤៨០ នាទី (៨ ម៉ោង) ក្នុងមួយករណី។ សូមផ្ទៀងផ្ទាត់ថាតើជា នាទី ឬ ម៉ោង ដើម្បីកុំឱ្យប៉ះពាល់ដល់ការគណនាបន្ទុក។</span>
                </div>
              )}
            </div>
          )}

          {/* Textarea */}
          {q.type === 'textarea' && (
            <textarea
              rows={3}
              value={currentValue ?? ''}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              placeholder={q.placeholderKm || 'សូមសរសេរមតិយោបល់...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs sm:text-sm"
            />
          )}
        </div>

        {hasError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mt-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{t.requiredField}: {t.validationError}</span>
          </div>
        )}
      </div>
    );
  };

  const isProfileSection = activeSection.id === 'sec-staff-info';

  // Group questions by tier
  const coreQuestions = sectionQuestions.filter((q) => q.activityType === 'core');
  const casQuestions = sectionQuestions.filter((q) => q.activityType === 'cas');
  const iasQuestions = sectionQuestions.filter((q) => q.activityType === 'ias');
  const otherQuestions = sectionQuestions.filter((q) => !q.activityType);

  // Group custom tasks for this section by tier
  const deptCustomTasks = customTasks.filter(
    (t) => t.departmentCode === (activeSection.deptCode || 'general')
  );
  const coreCustomTasks = deptCustomTasks.filter((t) => t.category === 'core');
  const casCustomTasks = deptCustomTasks.filter((t) => t.category === 'cas');
  const iasCustomTasks = deptCustomTasks.filter((t) => t.category === 'ias');

  // Render a specific activity tier panel
  const renderTierPanel = (
    tierType: WisnActivityCategory,
    tierTitle: string,
    tierDescription: string,
    tierUnit: string,
    icon: React.ReactNode,
    colorClasses: {
      border: string;
      bg: string;
      badge: string;
      btn: string;
    },
    questions: Question[],
    customItems: CustomTaskItem[]
  ) => {
    return (
      <div className={`rounded-3xl border ${colorClasses.border} ${colorClasses.bg} p-6 shadow-sm space-y-5 transition-all`}>
        {/* Tier Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${colorClasses.badge}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-snug">
                {tierTitle}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{tierDescription}</span>
                <span className="font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 text-[11px]">
                  ⏱️ {tierUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Add Button for this tier */}
          <button
            type="button"
            onClick={() => handleAddInlineCustomTask(tierType)}
            className={`inline-flex items-center px-3.5 py-2 rounded-xl text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer ${colorClasses.btn}`}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>+ បន្ថែម{tierType === 'core' ? 'ការងារស្នូល' : tierType === 'cas' ? 'ការងារគាំទ្រ' : 'ការងាររដ្ឋបាល'}ថ្មី</span>
          </button>
        </div>

        {/* Questions in this tier */}
        <div className="space-y-4">
          {questions.map((q, qIdx) => renderQuestionCard(q, qIdx))}
        </div>

        {/* Custom tasks in this tier */}
        {customItems.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>សកម្មភាពបន្ថែមក្នុងប្រភេទនេះ (Added {tierType.toUpperCase()} Tasks)៖</span>
            </h4>
            {customItems.map((task, tIdx) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    #{tIdx + 1}. សកម្មភាពបន្ថែម
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomTask(task.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="លុបសកម្មភាពនេះ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      ឈ្មោះសកម្មភាពការងារ
                    </label>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => handleUpdateCustomTask(task.id, 'name', e.target.value)}
                      placeholder="ឧ. ពិនិត្យកំហាប់ឈាម, ជួសជុល..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      ចំនួនករណី & កាលកំណត់
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={task.cases}
                        onChange={(e) => handleUpdateCustomTask(task.id, 'cases', e.target.value)}
                        placeholder="ចំនួន"
                        className="w-16 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center font-bold"
                      />
                      <select
                        value={task.period}
                        onChange={(e) => handleUpdateCustomTask(task.id, 'period', e.target.value)}
                        className="flex-1 px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <option value="Per Day">/ថ្ងៃ</option>
                        <option value="Per Week">/សប្តាហ៍</option>
                        <option value="Per Month">/ខែ</option>
                        <option value="Per Year">/ឆ្នាំ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      រយៈពេល ({tierUnit})
                    </label>
                    <input
                      type="text"
                      value={task.mins}
                      onChange={(e) => handleUpdateCustomTask(task.id, 'mins', e.target.value)}
                      placeholder="ឧ. 15min"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-teal-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Sticky Progress Header & Department Filter Switch */}
      <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 sticky top-20 z-20 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>
            ផ្នែកទី {currentSectionIndex + 1} នៃ {visibleSections.length}
          </span>
          <span className="text-teal-700 font-bold">{progressPercent}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Department Quick Jump Selector & Sync Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800">ជ្រើសរើសផ្នែកដើម្បីសម្ភាស (Jump to Department)៖</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeSection.id}
              onChange={(e) => {
                const targetId = e.target.value;
                const idx = visibleSections.findIndex((s) => s.id === targetId);
                if (idx !== -1) {
                  setCurrentSectionIndex(idx);
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-teal-300 bg-teal-50/70 text-xs font-extrabold text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            >
              {visibleSections.map((sec, sIdx) => (
                <option key={sec.id} value={sec.id}>
                  {sIdx + 1}. {sec.titleKm}
                </option>
              ))}
            </select>

            {onResetSurvey && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('តើអ្នកពិតជាចង់ទាញយកកម្រងសំណួរចុងក្រោយ (Sync 212 questions) ឡើងវិញមែនទេ?')) {
                    onResetSurvey();
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 shrink-0"
                title="ទាញយកកម្រងសំណួរថ្មីចុងក្រោយ"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Sync Survey</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Department Navigation Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          {visibleSections.map((sec, sIdx) => {
            const isActive = currentSectionIndex === sIdx;
            const isNew = sec.id === 'sec-g-opd-obgyn' || sec.id === 'sec-g-eye';
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setCurrentSectionIndex(sIdx)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                <span>{sIdx + 1}. {sec.deptCode ? sec.deptCode.toUpperCase() : 'ទូទៅ'}</span>
                {isNew && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-slate-900 font-black">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Smart Department Filter Toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
            {primaryDept ? `ផ្នែកបច្ចុប្បន្ន៖ ${primaryDept}` : 'មិនទាន់រើសផ្នែកចម្បង'}
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer font-bold text-teal-800">
            <input
              type="checkbox"
              checked={filterByDept}
              onChange={(e) => {
                setFilterByDept(e.target.checked);
                setCurrentSectionIndex(0);
              }}
              className="w-3.5 h-3.5 text-teal-600 rounded"
            />
            <span>បង្ហាញតែផ្នែកដែលពាក់ព័ន្ធ (Smart Filter)</span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Title Box */}
        <div className="bg-gradient-to-br from-white to-teal-50/40 rounded-3xl p-6 border border-teal-100 shadow-sm space-y-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
              {activeSection.deptCode ? `ផ្នែក៖ ${activeSection.deptCode.toUpperCase()}` : 'ទូទៅ'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
              {activeSection.titleKm}
            </h2>
            {activeSection.descriptionKm && (
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {activeSection.descriptionKm}
              </p>
            )}
          </div>

          {/* 🌟 Dedicated 3-Tier Activity Filter Tabs (Visible on clinical/operational sections) */}
          {!isProfileSection && (
            <div className="pt-2 border-t border-teal-100/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>ជ្រើសរើសប្រភេទការងារដើម្បីបំពេញ (Activity Tiers)៖</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  សរុប {sectionQuestions.length} សំណួរ
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTierTab('all')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeTierTab === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>បង្ហាញទាំងអស់</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTierTab('core')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeTierTab === 'core'
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                      : 'bg-teal-50/70 text-teal-800 border border-teal-200/80 hover:bg-teal-100'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>១. ការងារស្នូល ({coreQuestions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTierTab('cas')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeTierTab === 'cas'
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                      : 'bg-sky-50/70 text-sky-800 border border-sky-200/80 hover:bg-sky-100'
                  }`}
                >
                  <Users2 className="w-3.5 h-3.5" />
                  <span>២. ការងារគាំទ្រ ({casQuestions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTierTab('ias')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeTierTab === 'ias'
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                      : 'bg-purple-50/70 text-purple-800 border border-purple-200/80 hover:bg-purple-100'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>៣. ការងាររដ្ឋបាល ({iasQuestions.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* Profile Section (Non-clinical) */}
        {/* ============================================================== */}
        {isProfileSection && (
          <div className="space-y-4">
            {sectionQuestions.map((q, idx) => renderQuestionCard(q, idx))}
          </div>
        )}

        {/* ============================================================== */}
        {/* Clinical / Operational Sections (Separated into 3 distinct tiers) */}
        {/* ============================================================== */}
        {!isProfileSection && (
          <div className="space-y-6">
            {/* TIER 1: ការងារស្នូល (Core Clinical Activities) */}
            {(activeTierTab === 'all' || activeTierTab === 'core') && (
              renderTierPanel(
                'core',
                '១. ការងារស្នូល (Core Clinical / Service Activities)',
                'សកម្មភាពព្យាបាល និងថែទាំអ្នកជំងឺផ្ទាល់',
                'នាទី ក្នុងអ្នកជំងឺម្នាក់ ឬ ក្នុងមួយករណី',
                <Stethoscope className="w-5 h-5 text-teal-700" />,
                {
                  border: 'border-teal-300',
                  bg: 'bg-teal-50/30',
                  badge: 'bg-teal-100 text-teal-800',
                  btn: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30'
                },
                coreQuestions,
                coreCustomTasks
              )
            )}

            {/* TIER 2: ការងារគាំទ្រទូទៅ (Support Activities / CAS) */}
            {(activeTierTab === 'all' || activeTierTab === 'cas') && (
              renderTierPanel(
                'cas',
                '២. ការងារគាំទ្រទូទៅ (Category Allowance Standards - CAS)',
                'សកម្មភាពរួមដែលបុគ្គលិកទាំងអស់ក្នុងជំនាញត្រូវធ្វើជាប្រចាំ',
                'នាទី ក្នុងមួយថ្ងៃ ឬ ក្នុងមួយវេន',
                <Users2 className="w-5 h-5 text-sky-700" />,
                {
                  border: 'border-sky-300',
                  bg: 'bg-sky-50/30',
                  badge: 'bg-sky-100 text-sky-800',
                  btn: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/30'
                },
                casQuestions,
                casCustomTasks
              )
            )}

            {/* TIER 3: ការងាររដ្ឋបាល និងឯកសារ (Administrative Activities / IAS) */}
            {(activeTierTab === 'all' || activeTierTab === 'ias') && (
              renderTierPanel(
                'ias',
                '៣. ការងាររដ្ឋបាល និងឯកសារ (Individual Allowance Standards - IAS)',
                'សកម្មភាពកត់ត្រា របាយការណ៍ និងគ្រប់គ្រងស្តុករបស់បុគ្គលិកជាក់លាក់',
                'នាទី ក្នុងមួយថ្ងៃ ឬ ក្នុងមួយខែ',
                <FileCheck className="w-5 h-5 text-purple-700" />,
                {
                  border: 'border-purple-300',
                  bg: 'bg-purple-50/30',
                  badge: 'bg-purple-100 text-purple-800',
                  btn: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
                },
                iasQuestions,
                iasCustomTasks
              )
            )}

            {/* Any remaining un-categorized questions */}
            {otherQuestions.length > 0 && activeTierTab === 'all' && (
              <div className="space-y-4 pt-4">
                {otherQuestions.map((q, idx) => renderQuestionCard(q, idx))}
              </div>
            )}
          </div>
        )}

        {/* Required questions still empty */}
        {missing.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm space-y-2">
            <div className="font-bold">
              សូមឆ្លើយសំណួរចាំបាច់ {missing.length} ដែលមានពណ៌ក្រហម មុននឹងបន្ត
              <span className="block font-semibold text-rose-700/90">
                Please answer the {missing.length} required question{missing.length > 1 ? 's' : ''} in red to continue:
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {missing.map((q) => (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 hover:bg-rose-100 text-left"
                  >
                    {q.titleKm.length > 60 ? q.titleKm.slice(0, 60) + '…' : q.titleKm}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Wizard Footer */}
        <div className="flex items-center justify-between pt-4">
          {currentSectionIndex > 0 ? (
            <button
              type="button"
              onClick={handlePrevSection}
              className="inline-flex items-center px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>ត្រឡប់ក្រោយ</span>
            </button>
          ) : (
            <div />
          )}

          {currentSectionIndex < visibleSections.length - 1 ? (
            <button
              type="button"
              onClick={handleNextSection}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-teal-600/20 active:scale-95"
            >
              <span>បន្ទាប់ (Next Section)</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition shadow-lg shadow-emerald-600/30 active:scale-95"
            >
              <Send className="w-4 h-4 mr-2" />
              <span>បញ្ជូនទិន្នន័យស្ទង់មតិ WISN</span>
            </button>
          )}
        </div>
      </form>

      {/* Operational Definition Modal */}
      {activeDef && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800">
                  WISN Activity Standard Definition
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {activeDef.nameKm}
                </h3>
                <div className="text-xs text-slate-500 font-medium">{activeDef.nameEn}</div>
              </div>
              <button
                onClick={() => setActiveDef(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Start & End Points */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-extrabold text-teal-800 uppercase text-[11px] block">
                    ១. ចំណុចចាប់ផ្តើមរាប់ម៉ោង (Start Point):
                  </span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">{activeDef.startPointKm}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="font-extrabold text-emerald-800 uppercase text-[11px] block">
                    ២. ចំណុចបញ្ចប់ការរាប់ម៉ោង (End Point):
                  </span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">{activeDef.endPointKm}</p>
                </div>
              </div>

              {/* Inclusions */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">
                  ✅ អ្វីដែលត្រូវរាប់បញ្ចូល (Inclusions):
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs pl-1">
                  {activeDef.includedKm.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div>
                <span className="font-bold text-rose-800 block mb-1">
                  ❌ អ្វីដែលមិនត្រូវរាប់បញ្ចូល (Exclusions / កុំឱ្យជាន់គ្នា):
                </span>
                <ul className="list-disc list-inside space-y-1 text-rose-700/90 text-xs pl-1">
                  {activeDef.excludedKm.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Standard Norm */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between text-xs">
                <span className="font-bold">ស្តង់ដារមធ្យមទូទៅ (Typical Standard):</span>
                <span className="font-extrabold text-teal-800">{activeDef.typicalNormKm}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDef(null)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
              >
                យល់ព្រម (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
