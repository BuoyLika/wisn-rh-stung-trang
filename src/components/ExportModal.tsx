import React from 'react';
import { ResearchSurvey, SurveyResponse, Language } from '../types';
import { useTranslation } from '../i18n/translations';
import { exportToExcel, exportToCSV, exportToJSON } from '../utils/exportUtils';
import { X, FileSpreadsheet, Table, Code2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: ResearchSurvey;
  responses: SurveyResponse[];
  language: Language;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  survey,
  responses,
  language,
}) => {
  const t = useTranslation(language);

  if (!isOpen) return null;

  const handleExportExcel = () => {
    exportToExcel(survey, responses, `${survey.id}_Dataset.xlsx`);
    onClose();
  };

  const handleExportCsv = () => {
    exportToCSV(survey, responses, `${survey.id}_SPSS_Ready.csv`);
    onClose();
  };

  const handleExportJson = () => {
    exportToJSON(survey, responses, `${survey.id}_Complete.json`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {t.exportModalTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Dataset: {responses.length} responses recorded
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Excel Export Option */}
          <button
            onClick={handleExportExcel}
            className="w-full flex items-start gap-4 p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                {t.exportExcel}
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.exportExcelDesc}
              </div>
            </div>
          </button>

          {/* CSV Export Option */}
          <button
            onClick={handleExportCsv}
            className="w-full flex items-start gap-4 p-4 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-teal-800">
                {t.exportCsv}
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.exportCsvDesc}
              </div>
            </div>
          </button>

          {/* JSON Export Option */}
          <button
            onClick={handleExportJson}
            className="w-full flex items-start gap-4 p-4 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-left transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-purple-800">
                {t.exportJson}
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.exportJsonDesc}
              </div>
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
