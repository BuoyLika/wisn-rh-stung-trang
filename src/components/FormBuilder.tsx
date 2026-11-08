import React, { useState } from 'react';
import { ResearchSurvey, Question, QuestionType, Language, Option } from '../types';
import { useTranslation } from '../i18n/translations';
import { 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Check, 
  Edit3, 
  FolderPlus, 
  Layers,
  Sparkles
} from 'lucide-react';

interface FormBuilderProps {
  survey: ResearchSurvey;
  language: Language;
  onSaveSurvey: (updated: ResearchSurvey) => void;
  onResetDefault: () => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  survey,
  language,
  onSaveSurvey,
  onResetDefault,
}) => {
  const t = useTranslation(language);

  const [localSurvey, setLocalSurvey] = useState<ResearchSurvey>(survey);
  const [activeTab, setActiveTab] = useState<'questions' | 'metadata'>('questions');
  const [savedAlert, setSavedAlert] = useState(false);

  // Metadata change handler
  const handleMetaChange = (field: keyof ResearchSurvey, value: string) => {
    setLocalSurvey((prev) => ({ ...prev, [field]: value }));
  };

  // Add a new section
  const handleAddSection = () => {
    const newSecId = 'sec-' + Date.now();
    const newSection = {
      id: newSecId,
      titleKm: `ផ្នែកថ្មី (ផ្នែកទី ${localSurvey.sections.length + 1})`,
      titleEn: `New Section ${localSurvey.sections.length + 1}`,
      questionIds: []
    };
    setLocalSurvey((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Add a new question to a section
  const handleAddQuestion = (sectionId: string) => {
    const newQId = 'q-' + Date.now();
    const newQuestion: Question = {
      id: newQId,
      type: 'single_choice',
      titleKm: 'សំណួរស្រាវជ្រាវថ្មី',
      titleEn: 'New Research Question',
      required: true,
      category: 'General',
      options: [
        { id: 'opt-1', labelKm: 'ជម្រើសទី ១', labelEn: 'Option 1', value: 'opt1' },
        { id: 'opt-2', labelKm: 'ជម្រើសទី ២', labelEn: 'Option 2', value: 'opt2' }
      ]
    };

    setLocalSurvey((prev) => {
      const updatedQuestions = [...prev.questions, newQuestion];
      const updatedSections = prev.sections.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, questionIds: [...sec.questionIds, newQId] };
        }
        return sec;
      });
      return { ...prev, questions: updatedQuestions, sections: updatedSections };
    });
  };

  // Update question
  const handleUpdateQuestion = (qId: string, updates: Partial<Question>) => {
    setLocalSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === qId ? { ...q, ...updates } : q))
    }));
  };

  // Delete question
  const handleDeleteQuestion = (qId: string) => {
    setLocalSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== qId),
      sections: prev.sections.map((sec) => ({
        ...sec,
        questionIds: sec.questionIds.filter((id) => id !== qId)
      }))
    }));
  };

  // Delete section
  const handleDeleteSection = (secId: string) => {
    if (localSurvey.sections.length <= 1) {
      alert('កម្រងសំណួរត្រូវតែមានផ្នែកយ៉ាងហោចណាស់មួយ! (Must have at least one section)');
      return;
    }
    setLocalSurvey((prev) => {
      const secToDelete = prev.sections.find((s) => s.id === secId);
      const qIdsToRemove = secToDelete ? secToDelete.questionIds : [];
      return {
        ...prev,
        sections: prev.sections.filter((s) => s.id !== secId),
        questions: prev.questions.filter((q) => !qIdsToRemove.includes(q.id))
      };
    });
  };

  // Add Option to MCQ question
  const handleAddOption = (questionId: string) => {
    const q = localSurvey.questions.find((x) => x.id === questionId);
    if (!q) return;
    const currentOptions = q.options || [];
    const newOpt: Option = {
      id: 'opt-' + Date.now(),
      labelKm: `ជម្រើសទី ${currentOptions.length + 1}`,
      labelEn: `Option ${currentOptions.length + 1}`,
      value: `option_${currentOptions.length + 1}`
    };
    handleUpdateQuestion(questionId, { options: [...currentOptions, newOpt] });
  };

  // Remove Option
  const handleRemoveOption = (questionId: string, optionId: string) => {
    const q = localSurvey.questions.find((x) => x.id === questionId);
    if (!q || !q.options) return;
    handleUpdateQuestion(questionId, {
      options: q.options.filter((opt) => opt.id !== optionId)
    });
  };

  // Save changes
  const handleSave = () => {
    onSaveSurvey({
      ...localSurvey,
      updatedAt: new Date().toISOString()
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'single_choice', label: t.typeSingleChoice },
    { value: 'multiple_choice', label: t.typeMultipleChoice },
    { value: 'likert_5', label: t.typeLikert5 },
    { value: 'rating_stars', label: t.typeRatingStars },
    { value: 'text', label: t.typeText },
    { value: 'textarea', label: t.typeTextarea },
    { value: 'number', label: t.typeNumber },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.builderTitle}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
              {localSurvey.questions.length} Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            {t.builderDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              if (confirm(t.confirmReset)) {
                onResetDefault();
              }
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">{t.resetDefaultSurvey}</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-teal-600/30 active:scale-95"
          >
            <Save className="w-4 h-4 mr-2" />
            <span>{t.saveSurvey}</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>កម្រងសំណួរត្រូវបានរក្សាទុកដោយជោគជ័យ! (Survey updated successfully)</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'questions'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ផ្នែក និងកម្រងសំណួរ (Sections & Questions)</span>
        </button>

        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'metadata'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{t.editSurveyDetails}</span>
        </button>
      </div>

      {/* Tab 1: Metadata Editor */}
      {activeTab === 'metadata' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                ចំណងជើងស្រាវជ្រាវ (ភាសាខ្មែរ)
              </label>
              <input
                type="text"
                value={localSurvey.titleKm}
                onChange={(e) => handleMetaChange('titleKm', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Research Title (English)
              </label>
              <input
                type="text"
                value={localSurvey.titleEn}
                onChange={(e) => handleMetaChange('titleEn', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  អ្នកស្រាវជ្រាវដឹកនាំ (Lead Researcher)
                </label>
                <input
                  type="text"
                  value={localSurvey.leadResearcherKm}
                  onChange={(e) => handleMetaChange('leadResearcherKm', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ស្ថាប័ន / Host Institution
                </label>
                <input
                  type="text"
                  value={localSurvey.institutionKm}
                  onChange={(e) => handleMetaChange('institutionKm', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                គោលបំណងស្រាវជ្រាវ (Research Objectives)
              </label>
              <textarea
                rows={3}
                value={localSurvey.objectiveKm}
                onChange={(e) => handleMetaChange('objectiveKm', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                សេចក្តីជូនដំណឹង និងសីលធម៌នៃការស្រាវជ្រាវ (Ethical & Consent Notice)
              </label>
              <textarea
                rows={3}
                value={localSurvey.consentNoticeKm}
                onChange={(e) => handleMetaChange('consentNoticeKm', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sections & Questions Builder */}
      {activeTab === 'questions' && (
        <div className="space-y-8">
          {localSurvey.sections.map((sec, secIdx) => {
            const secQuestions = localSurvey.questions.filter((q) =>
              sec.questionIds.includes(q.id)
            );

            return (
              <div
                key={sec.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
              >
                {/* Section Header Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex-1 w-full sm:w-auto">
                    <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-full">
                      ផ្នែកទី {secIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={sec.titleKm}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLocalSurvey((prev) => ({
                          ...prev,
                          sections: prev.sections.map((s) =>
                            s.id === sec.id ? { ...s, titleKm: val } : s
                          )
                        }));
                      }}
                      className="w-full text-base sm:text-lg font-black text-slate-900 mt-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleAddQuestion(sec.id)}
                      className="inline-flex items-center px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t.addQuestion}
                    </button>
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title={t.deleteSection}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Items in this section */}
                <div className="space-y-4">
                  {secQuestions.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                      មិនទាន់មានសំណួរក្នុងផ្នែកនេះទេ។ ចុច "បន្ថែមសំណួរថ្មី" ខាងលើ។
                    </div>
                  ) : (
                    secQuestions.map((q, qIndex) => (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4 hover:border-teal-300 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">
                              {qIndex + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-500 uppercase">
                              ID: {q.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={q.required}
                                onChange={(e) =>
                                  handleUpdateQuestion(q.id, { required: e.target.checked })
                                }
                                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                              />
                              <span>{t.isRequired}</span>
                            </label>

                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                              title={t.deleteQuestion}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Type Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              {t.questionTitleKm}
                            </label>
                            <input
                              type="text"
                              value={q.titleKm}
                              onChange={(e) =>
                                handleUpdateQuestion(q.id, { titleKm: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              {t.questionType}
                            </label>
                            <select
                              value={q.type}
                              onChange={(e) => {
                                const newType = e.target.value as QuestionType;
                                const updates: Partial<Question> = { type: newType };
                                if (
                                  (newType === 'single_choice' || newType === 'multiple_choice') &&
                                  (!q.options || q.options.length === 0)
                                ) {
                                  updates.options = [
                                    { id: 'opt-1', labelKm: 'ជម្រើសទី ១', labelEn: 'Option 1', value: 'opt1' },
                                    { id: 'opt-2', labelKm: 'ជម្រើសទី ២', labelEn: 'Option 2', value: 'opt2' }
                                  ];
                                }
                                handleUpdateQuestion(q.id, updates);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                            >
                              {questionTypes.map((qt) => (
                                <option key={qt.value} value={qt.value}>
                                  {qt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Options management for MCQ / Single choice */}
                        {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                          <div className="pt-2 pl-2 border-l-2 border-teal-200 space-y-2">
                            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                              <span>{t.optionsLabel}:</span>
                              <button
                                type="button"
                                onClick={() => handleAddOption(q.id)}
                                className="text-teal-600 hover:text-teal-800 text-xs font-bold flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{t.addOption}</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {q.options?.map((opt, optIndex) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-slate-400 w-4">
                                    {optIndex + 1}.
                                  </span>
                                  <input
                                    type="text"
                                    value={opt.labelKm}
                                    onChange={(e) => {
                                      const newLabel = e.target.value;
                                      const updatedOptions = q.options?.map((o) =>
                                        o.id === opt.id ? { ...o, labelKm: newLabel, labelEn: newLabel, value: newLabel } : o
                                      );
                                      handleUpdateQuestion(q.id, { options: updatedOptions });
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                                    placeholder="ឈ្មោះជម្រើស..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(q.id, opt.id)}
                                    className="text-slate-400 hover:text-rose-500 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {q.type === 'likert_5' && (
                          <div className="text-xs text-teal-800 bg-teal-50/60 p-3 rounded-xl border border-teal-100 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                            <span>
                              មាត្រដ្ឋាន Likert ៥ កម្រិត (១: មិនយល់ស្របទាំងស្រុង ទៅ ៥: យល់ស្របទាំងស្រុង) នឹងត្រូវបង្កើតដោយស្វ័យប្រវត្តិ។
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Section Button */}
          <div className="text-center py-4">
            <button
              onClick={handleAddSection}
              className="inline-flex items-center px-6 py-3 rounded-2xl border-2 border-dashed border-teal-400 text-teal-700 bg-teal-50/50 hover:bg-teal-50 font-bold text-sm transition"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              <span>{t.addSection}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
