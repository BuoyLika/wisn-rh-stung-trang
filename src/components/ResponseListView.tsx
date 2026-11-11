import React, { useState } from 'react';
import { ResearchSurvey, SurveyResponse, Language, UserAccount } from '../types';
import { useTranslation } from '../i18n/translations';
import { 
  Search, 
  Eye, 
  X, 
  Calendar, 
  FileText, 
  Trash2, 
  Edit3, 
  Save, 
  Plus, 
  CheckCircle2, 
  Phone,
  Layers,
  Stethoscope,
  Users2,
  FileCheck,
  Tablet
} from 'lucide-react';
import { calculateResponseTierBreakdown } from '../utils/wisnCalculations';

interface ResponseListViewProps {
  survey: ResearchSurvey;
  responses: SurveyResponse[];
  language: Language;
  onDeleteResponse: (responseId: string) => void;
  onUpdateResponse: (responseId: string, updated: Partial<SurveyResponse>) => void;
  currentUser?: UserAccount;
  onOpenSync?: () => void;
}

export const ResponseListView: React.FC<ResponseListViewProps> = ({
  survey,
  responses,
  language,
  onDeleteResponse,
  onUpdateResponse,
  currentUser,
  onOpenSync,
}) => {
  const t = useTranslation(language);
  const [search, setSearch] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [editingResponse, setEditingResponse] = useState<SurveyResponse | null>(null);
  const [editSuccessMessage, setEditSuccessMessage] = useState(false);

  const filtered = responses.filter((r) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    if (r.id.toLowerCase().includes(query)) return true;
    if (r.staffCode.toLowerCase().includes(query)) return true;
    if (r.staffName && r.staffName.toLowerCase().includes(query)) return true;
    if (r.cadre && r.cadre.toLowerCase().includes(query)) return true;
    if (r.primaryDepartment && r.primaryDepartment.toLowerCase().includes(query)) return true;
    return Object.values(r.answers).some((val) =>
      String(val).toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: string, staffName: string) => {
    const confirmMsg = language === 'km'
      ? `តើអ្នកពិតជាចង់លុបទិន្នន័យរបស់ ${staffName || id} នេះមែនទេ? (ទិន្នន័យដែលលុបមិនអាចទាញយកមកវិញបានទេ)`
      : `Are you sure you want to delete response ${staffName || id}?`;
    if (window.confirm(confirmMsg)) {
      onDeleteResponse(id);
      if (selectedResponse?.id === id) setSelectedResponse(null);
      if (editingResponse?.id === id) setEditingResponse(null);
    }
  };

  const handleSaveEdit = () => {
    if (!editingResponse) return;
    onUpdateResponse(editingResponse.id, editingResponse);
    setEditSuccessMessage(true);
    setTimeout(() => {
      setEditSuccessMessage(false);
      setEditingResponse(null);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.responsesTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ទិន្នន័យបុគ្គលិកសរុប {responses.length} នាក់ (បង្ហាញ {filtered.length} នាក់)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenSync && (
            <button
              onClick={onOpenSync}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition shadow-2xs shrink-0"
              title="បម្រុងទុក និងច្របាច់បញ្ចូលទិន្នន័យពី Tablet"
            >
              <Tablet className="w-4 h-4 text-teal-700" />
              <span>Sync Tablet</span>
            </button>
          )}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះ កូដ ផ្នែក..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs sm:text-sm">
            មិនមានទិន្នន័យត្រូវនឹងការស្វែងរករបស់អ្នកទេ។ (No matching records)
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-5">កូដបុគ្គលិក (ID)</th>
                  <th className="py-4 px-5">ឈ្មោះបុគ្គលិក</th>
                  <th className="py-4 px-5">មុខតំណែង (Cadre)</th>
                  <th className="py-4 px-5">ផ្នែកបម្រើការងារ</th>
                  <th className="py-4 px-4 text-center">សមាមាត្រការងារ (Core / CAS / IAS)</th>
                  <th className="py-4 px-5">កាលបរិច្ឆេទសម្ភាសន៍</th>
                  <th className="py-4 px-5 text-right">សកម្មភាព (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => {
                  const dateStr = new Date(r.submittedAt).toLocaleDateString(
                    language === 'km' ? 'km-KH' : 'en-US',
                    { dateStyle: 'medium' }
                  );
                  const breakdown = calculateResponseTierBreakdown(r, survey);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-5 font-black text-teal-700">
                        {r.staffCode}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {r.staffName || <span className="text-slate-400 italic">មិនបានបញ្ជាក់</span>}
                        {r.staffPhone && (
                          <div className="text-[11px] font-normal text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{r.staffPhone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 text-slate-700 font-medium">
                        {r.cadre || r.answers['cadre'] || '-'}
                      </td>
                      <td className="py-4 px-5 text-slate-600">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {r.primaryDepartment || r.answers['primary_department'] || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className="text-teal-700">Core: {breakdown.corePercent}%</span>
                          <span className="text-sky-700">CAS: {breakdown.casPercent}%</span>
                          <span className="text-purple-700">IAS: {breakdown.iasPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex shadow-inner">
                          <div 
                            className="bg-teal-500 h-full" 
                            style={{ width: `${breakdown.corePercent}%` }} 
                            title={`Core: ${breakdown.corePercent}%`} 
                          />
                          <div 
                            className="bg-sky-500 h-full" 
                            style={{ width: `${breakdown.casPercent}%` }} 
                            title={`CAS: ${breakdown.casPercent}%`} 
                          />
                          <div 
                            className="bg-purple-500 h-full" 
                            style={{ width: `${breakdown.iasPercent}%` }} 
                            title={`IAS: ${breakdown.iasPercent}%`} 
                          />
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => setSelectedResponse(r)}
                            className="p-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold text-xs transition"
                            title="មើលលម្អិត (View Details)"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingResponse(JSON.parse(JSON.stringify(r)))}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-xs transition"
                            title="កែប្រែទិន្នន័យ (Edit Data)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button (Admin Only) */}
                          {currentUser?.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(r.id, r.staffName || r.staffCode)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition"
                              title="លុបទិន្នន័យ (Admin Delete Response)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    បុគ្គលិក៖ {selectedResponse.staffName || selectedResponse.staffCode} (ID: {selectedResponse.staffCode})
                  </h3>
                  <div className="text-xs text-slate-500">
                    {selectedResponse.cadre} • {selectedResponse.primaryDepartment} • {new Date(selectedResponse.submittedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = JSON.parse(JSON.stringify(selectedResponse));
                    setSelectedResponse(null);
                    setEditingResponse(toEdit);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs flex items-center gap-1 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>កែប្រែ</span>
                </button>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Individual WISN Activity Breakdown Card */}
              {(() => {
                const b = calculateResponseTierBreakdown(selectedResponse, survey);
                return (
                  <div className="bg-gradient-to-r from-teal-50/60 via-sky-50/60 to-purple-50/60 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-teal-600" />
                        <span>សមាមាត្របន្ទុកការងារទាំង ៣ ប្រភេទ (Staff Activity Breakdown %)</span>
                      </h4>
                      <span className="text-[11px] font-bold text-slate-600">
                        សរុបពេលវេលា៖ {b.totalMins} នាទី
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex shadow-inner">
                      <div 
                        className="bg-teal-500 h-full" 
                        style={{ width: `${b.corePercent}%` }} 
                        title={`Core: ${b.corePercent}%`} 
                      />
                      <div 
                        className="bg-sky-500 h-full" 
                        style={{ width: `${b.casPercent}%` }} 
                        title={`CAS: ${b.casPercent}%`} 
                      />
                      <div 
                        className="bg-purple-500 h-full" 
                        style={{ width: `${b.iasPercent}%` }} 
                        title={`IAS: ${b.iasPercent}%`} 
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-teal-200 shadow-sm">
                        <div className="text-[10px] font-bold text-teal-700 flex items-center justify-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          <span>១. ការងារស្នូល</span>
                        </div>
                        <div className="text-base font-black text-teal-950 mt-0.5">{b.corePercent}%</div>
                        <div className="text-[10px] text-teal-700">{b.coreMins} នាទី</div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-sky-200 shadow-sm">
                        <div className="text-[10px] font-bold text-sky-700 flex items-center justify-center gap-1">
                          <Users2 className="w-3 h-3" />
                          <span>២. ការងារគាំទ្រ</span>
                        </div>
                        <div className="text-base font-black text-sky-950 mt-0.5">{b.casPercent}%</div>
                        <div className="text-[10px] text-sky-700">{b.casMins} នាទី</div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-sm">
                        <div className="text-[10px] font-bold text-purple-700 flex items-center justify-center gap-1">
                          <FileCheck className="w-3 h-3" />
                          <span>៣. ការងាររដ្ឋបាល</span>
                        </div>
                        <div className="text-base font-black text-purple-950 mt-0.5">{b.iasPercent}%</div>
                        <div className="text-[10px] text-purple-700">{b.iasMins} នាទី</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Question answers list */}
              <div className="space-y-3">
                {survey.questions.map((q) => {
                  const answer = selectedResponse.answers[q.id];
                  if (answer === undefined || answer === null || answer === '') return null;
                  return (
                    <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-xs font-bold text-slate-600 mb-1">
                        {q.titleKm}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-teal-900">
                        {Array.isArray(answer) ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {answer.map((item, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span>{String(answer)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unlisted Custom Tasks */}
              {selectedResponse.customTasks && selectedResponse.customTasks.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-black text-slate-800 uppercase mb-3">
                    សកម្មភាពការងារបន្ថែម (Unlisted Custom Tasks)៖
                  </h4>
                  <div className="space-y-2">
                    {selectedResponse.customTasks.map((task, i) => (
                      <div key={i} className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-teal-950">{i + 1}. {task.name}</span>
                          <span className="ml-2 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                            {task.category}
                          </span>
                        </div>
                        <div className="font-semibold text-teal-900">
                          {task.cases} / {task.period} • {task.mins}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Response Modal */}
      {editingResponse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    កែប្រែទិន្នន័យបុគ្គលិក៖ {editingResponse.staffName || editingResponse.staffCode}
                  </h3>
                  <div className="text-xs text-slate-500">
                    ID: {editingResponse.staffCode} • អ្នកអាចកែសម្រួលចម្លើយ និងបន្ថែមសកម្មភាព
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingResponse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {editSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ទិន្នន័យត្រូវបានកែប្រែ និងរក្សាទុកដោយជោគជ័យ!</span>
                </div>
              )}

              {/* Basic Profile Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    កូដបុគ្គលិក (Staff Code)
                  </label>
                  <input
                    type="text"
                    value={editingResponse.staffCode}
                    onChange={(e) =>
                      setEditingResponse((prev) => prev ? { ...prev, staffCode: e.target.value } : null)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    ឈ្មោះបុគ្គលិក
                  </label>
                  <input
                    type="text"
                    value={editingResponse.staffName || ''}
                    onChange={(e) =>
                      setEditingResponse((prev) => prev ? { ...prev, staffName: e.target.value } : null)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    លេខទូរស័ព្ទ
                  </label>
                  <input
                    type="text"
                    value={editingResponse.staffPhone || ''}
                    onChange={(e) =>
                      setEditingResponse((prev) => prev ? { ...prev, staffPhone: e.target.value } : null)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Question Answers Editor */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  ចម្លើយសកម្មភាពការងារ (Activity Standards & AWT Values)
                </h4>
                {survey.questions.map((q) => {
                  const val = editingResponse.answers[q.id] ?? '';
                  if (q.id === 'staff_name' || q.id === 'staff_code' || q.id === 'staff_phone') return null;

                  return (
                    <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {q.titleKm}
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(val) ? val.join(', ') : val}
                        onChange={(e) => {
                          const updatedAnswers = { ...editingResponse.answers, [q.id]: e.target.value };
                          setEditingResponse((prev) => prev ? { ...prev, answers: updatedAnswers } : null);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Custom Tasks Editor */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    សកម្មភាពបន្ថែម (Unlisted Custom Tasks)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newTask: any = {
                        id: 'ct-' + Date.now(),
                        name: 'សកម្មភាពថ្មី',
                        category: 'cas',
                        cases: '1',
                        period: 'Per Day',
                        mins: '15min'
                      };
                      setEditingResponse((prev) =>
                        prev ? { ...prev, customTasks: [...(prev.customTasks || []), newTask] } : null
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ បន្ថែមសកម្មភាព</span>
                  </button>
                </div>

                {editingResponse.customTasks?.map((task, idx) => (
                  <div key={task.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => {
                        const updated = [...(editingResponse.customTasks || [])];
                        updated[idx].name = e.target.value;
                        setEditingResponse((prev) => prev ? { ...prev, customTasks: updated } : null);
                      }}
                      className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-bold"
                      placeholder="ឈ្មោះសកម្មភាព"
                    />
                    <select
                      value={task.category}
                      onChange={(e) => {
                        const updated = [...(editingResponse.customTasks || [])];
                        updated[idx].category = e.target.value as any;
                        setEditingResponse((prev) => prev ? { ...prev, customTasks: updated } : null);
                      }}
                      className="px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-semibold"
                    >
                      <option value="core">Core</option>
                      <option value="cas">CAS</option>
                      <option value="ias">IAS</option>
                    </select>
                    <input
                      type="text"
                      value={task.cases}
                      onChange={(e) => {
                        const updated = [...(editingResponse.customTasks || [])];
                        updated[idx].cases = e.target.value;
                        setEditingResponse((prev) => prev ? { ...prev, customTasks: updated } : null);
                      }}
                      className="w-16 px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-center"
                      placeholder="ករណី"
                    />
                    <input
                      type="text"
                      value={task.mins}
                      onChange={(e) => {
                        const updated = [...(editingResponse.customTasks || [])];
                        updated[idx].mins = e.target.value;
                        setEditingResponse((prev) => prev ? { ...prev, customTasks: updated } : null);
                      }}
                      className="w-20 px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-center font-bold"
                      placeholder="នាទី"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (editingResponse.customTasks || []).filter((_, i) => i !== idx);
                        setEditingResponse((prev) => prev ? { ...prev, customTasks: updated } : null);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingResponse(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                បោះបង់ (Cancel)
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="inline-flex items-center px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                <Save className="w-4 h-4 mr-1.5" />
                <span>រក្សាទុកការកែប្រែ (Save Changes)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
