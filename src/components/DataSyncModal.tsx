import React, { useState, useRef } from 'react';
import { SurveyResponse, MergeResult, ResearchSurvey } from '../types';
import { importResponses } from '../utils/storage';
import { errorText } from '../utils/api';
import { 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Tablet, 
  RefreshCw, 
  HardDriveDownload 
} from 'lucide-react';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: ResearchSurvey;
  responses: SurveyResponse[];
  isAdmin: boolean;
  onMergeSuccess: (updatedList: SurveyResponse[]) => void;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({
  isOpen,
  onClose,
  survey,
  responses,
  isAdmin,
  onMergeSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // 1. Export Tablet Backup JSON
  const handleExportBackup = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupData = {
      app: 'WISN Assessment Platform - RH Stung Trang',
      institution: 'National Institute of Public Health (NIPH)',
      facility: survey.hospitalNameKm || 'មន្ទីរពេទ្យបង្អែក ហ៊ុន សែន ស្ទឹងត្រង់',
      exportedAt: new Date().toISOString(),
      totalResponses: responses.length,
      surveyId: survey.id,
      responses
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `WISN_Tablet_Backup_${timestamp}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Handle File Upload & Merge
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setMergeResult(null);

    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let incomingList: SurveyResponse[] = [];
        if (Array.isArray(parsed)) {
          incomingList = parsed;
        } else if (parsed && Array.isArray(parsed.responses)) {
          incomingList = parsed.responses;
        } else {
          throw new Error('ឯកសារ JSON មិនមានទម្រង់ចម្លើយស្ទង់មតិត្រឹមត្រូវទេ (Invalid response structure)');
        }

        if (incomingList.length === 0) {
          throw new Error('ឯកសារ JSON នេះទទេ គ្មានចម្លើយណាត្រូវបានរកឃើញទេ (No responses in file)');
        }

        // Upload into the Google Sheet (keeps who interviewed; staff codes already there are skipped)
        const { result, responses: merged } = await importResponses(incomingList, overwrite);
        setMergeResult(result);
        onMergeSuccess(merged);
      } catch (err: any) {
        setErrorMsg(err?.code ? errorText(err) : err?.message || 'បរាជ័យក្នុងការអានឯកសារ JSON (Failed to parse JSON)');
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      setErrorMsg('មានបញ្ហាក្នុងការអានឯកសារ (Error reading file)');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 text-[11px] font-bold text-teal-200 mb-2 border border-teal-700">
            <Tablet className="w-3.5 h-3.5 text-teal-400" />
            <span>Multi-Device Data Sync Engine</span>
          </div>
          <h2 className="text-xl font-black">
            ការបម្រុងទុក និងច្របាច់បញ្ចូលទិន្នន័យពី Tablet (Backup & Merge)
          </h2>
          <p className="text-xs text-teal-200/90 mt-1">
            សម្រាប់ក្រុមការងារ NIPH ចុះប្រមូលទិន្នន័យដោយប្រើ Tablet/ទូរស័ព្ទច្រើនគ្រឿងក្នុងពេលតែមួយ
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Action 1: Export Backup */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-teal-600" />
                  <span>១. នាំចេញទិន្នន័យបម្រុងទុក (Export Tablet Backup JSON)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  ទាញយកចម្លើយទាំងអស់ (សរុប {responses.length} ករណី) ពី Tablet នេះ ទៅជាឯកសារ JSON ដើម្បីផ្ញើទៅកុំព្យូទ័រមេ ឬរក្សាទុកការពារការបាត់បង់។
                </p>
              </div>
            </div>

            <button
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 text-slate-800 hover:text-teal-900 font-bold text-xs transition shadow-xs"
            >
              <HardDriveDownload className="w-4 h-4 text-teal-600" />
              <span>ទាញយកឯកសារបម្រុងទុក (.json)</span>
            </button>
          </div>

          {/* Action 2: Import into the Google Sheet (admin only) */}
          {isAdmin && (
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-teal-700" />
                <span>២. នាំចូល និងច្របាច់ទិន្នន័យ (Import & Merge Data from other Tablets)</span>
              </h3>
              <p className="text-xs text-teal-900/80 mt-1 leading-relaxed">
                ជ្រើសរើសឯកសារ JSON ពី Tablet ផ្សេងទៀត។ ចម្លើយនឹងត្រូវបញ្ចូលទៅក្នុង Google Sheet (Answers go into the Google Sheet; staff codes already there are skipped).
              </p>
            </div>

            {/* Overwrite Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span>សរសេរជាន់លើចម្លើយចាស់បើសិនជាមានលេខកូដសម្គាល់ដូចគ្នា (Overwrite duplicates)</span>
            </label>

            {/* Hidden Input & Trigger */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'កំពុងច្របាច់ទិន្នន័យ...' : 'ជ្រើសរើសឯកសារ JSON ដើម្បីច្របាច់ទិន្នន័យ'}</span>
            </button>
          </div>
          )}

          {/* Merge Result Banner */}
          {mergeResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-xs">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ការច្របាច់បញ្ចូលទិន្នន័យបានជោគជ័យ! (Merge Completed)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-white border border-emerald-100">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">ចម្លើយនាំចូល</div>
                  <div className="text-base font-black text-slate-900">{mergeResult.totalIncoming}</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-emerald-100">
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">បន្ថែមថ្មី</div>
                  <div className="text-base font-black text-emerald-700">+{mergeResult.added}</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-emerald-100">
                  <div className="text-[10px] text-amber-600 font-bold uppercase">រំលងជាន់គ្នា</div>
                  <div className="text-base font-black text-amber-600">{mergeResult.skipped}</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-emerald-100">
                  <div className="text-[10px] text-teal-800 font-bold uppercase">សរុបថ្មី</div>
                  <div className="text-base font-black text-teal-800">{mergeResult.newTotal}</div>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
          >
            បិទ (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
