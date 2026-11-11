import React from 'react';
import { CheckCircle2, CloudOff, RefreshCw, AlertTriangle, UploadCloud, Download, X } from 'lucide-react';
import { Language } from '../types';
import { ApiError, errorText } from '../utils/api';

interface SyncBarProps {
  language: Language;
  pending: number;
  syncing: boolean;
  error: ApiError | null;
  lastSync: Date | null;
  problemCount: number;
  duplicatesHeld: number;
  oldLocalCount: number;
  onSyncNow: () => void;
  onUploadOld: () => void;
  onDownloadProblems: () => void;
  onClearProblems: () => void;
}

/** One line under the menu: are all answers in the Google Sheet? */
export const SyncBar: React.FC<SyncBarProps> = ({
  language, pending, syncing, error, lastSync, problemCount, duplicatesHeld, oldLocalCount,
  onSyncNow, onUploadOld, onDownloadProblems, onClearProblems,
}) => {
  const km = language === 'km';
  const time = lastSync ? lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  let tone = 'bg-emerald-50 border-emerald-200 text-emerald-900';
  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
  let text: string;
  if (pending > 0) {
    tone = 'bg-amber-50 border-amber-200 text-amber-900';
    icon = error?.offline ? <CloudOff className="w-4 h-4 text-amber-600 shrink-0" /> : <UploadCloud className="w-4 h-4 text-amber-600 shrink-0" />;
    text = km
      ? `ចម្លើយ ${pending} កំពុងរង់ចាំបញ្ជូន (រក្សាទុកលើឧបករណ៍នេះ)`
      : `${pending} answer${pending > 1 ? 's' : ''} waiting to upload (saved on this device)`;
    if (error) text += ' — ' + errorText(error);
  } else if (error) {
    tone = 'bg-amber-50 border-amber-200 text-amber-900';
    icon = <CloudOff className="w-4 h-4 text-amber-600 shrink-0" />;
    text = errorText(error);
  } else if (lastSync) {
    text = km ? `ចម្លើយទាំងអស់បានរក្សាទុកក្នុង Google Sheet · ${time}` : `All answers saved to the Google Sheet · ${time}`;
  } else {
    tone = 'bg-slate-50 border-slate-200 text-slate-700';
    icon = <RefreshCw className="w-4 h-4 text-slate-500 shrink-0 animate-spin" />;
    text = km ? 'កំពុងភ្ជាប់ទៅ Google Sheet…' : 'Connecting to the Google Sheet…';
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 space-y-2">
      <div className={`flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${tone}`}>
        {icon}
        <span className="flex-1 min-w-0">{text}</span>
        <button
          onClick={onSyncNow}
          disabled={syncing}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 border border-current/20 hover:bg-white disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {km ? 'ធ្វើសមកាលកម្ម' : 'Sync now'}
        </button>
      </div>

      {oldLocalCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl border bg-sky-50 border-sky-200 text-sky-900 text-xs font-semibold">
          <UploadCloud className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="flex-1 min-w-0">
            {km
              ? `ឧបករណ៍នេះមានចម្លើយ ${oldLocalCount} ពីកំណែចាស់ ដែលមិនទាន់នៅក្នុង Google Sheet`
              : `This device has ${oldLocalCount} answers from the old version that are not in the Google Sheet`}
          </span>
          <button onClick={onUploadOld} className="px-2.5 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700">
            {km ? 'បញ្ជូនឥឡូវ' : 'Upload them'}
          </button>
        </div>
      )}

      {problemCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl border bg-rose-50 border-rose-200 text-rose-900 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="flex-1 min-w-0">
            {km
              ? `ចម្លើយ ${problemCount} មិនត្រូវបានបញ្ចូលក្នុងបញ្ជីទេ (លេខកូដបុគ្គលិកមានរួចហើយ ឬគ្មានសិទ្ធិ)។ Admin អាចពិនិត្យនៅផ្ទាំង Duplicates។`
              : `${problemCount} answer${problemCount > 1 ? 's were' : ' was'} not added (staff code already used, or not allowed). The admin can check them in the Sheet's "Duplicates" tab.`}
          </span>
          <button onClick={onDownloadProblems} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 hover:bg-rose-100">
            <Download className="w-3.5 h-3.5" /> {km ? 'ទាញយក' : 'Download'}
          </button>
          <button onClick={onClearProblems} className="p-1 rounded-lg hover:bg-rose-100" title={km ? 'បិទ' : 'Dismiss'}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {duplicatesHeld > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-violet-50 border-violet-200 text-violet-900 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-violet-600 shrink-0" />
          <span>
            {km
              ? `ចម្លើយ ${duplicatesHeld} ដែលមានលេខកូដបុគ្គលិកស្ទួន កំពុងរង់ចាំការពិនិត្យនៅផ្ទាំង "Duplicates" ក្នុង Google Sheet`
              : `${duplicatesHeld} answer${duplicatesHeld > 1 ? 's' : ''} with a repeated staff code wait for review in the Sheet's "Duplicates" tab`}
          </span>
        </div>
      )}
    </div>
  );
};
