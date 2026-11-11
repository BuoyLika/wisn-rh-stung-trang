import React, { useEffect, useState } from 'react';
import { HardDrive, FolderOpen, FolderCheck, Download, UploadCloud, X, CheckCircle2, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Language, SurveyResponse } from '../types';
import { folderState, connectFolder, saveAnswersToFolder, FolderState } from '../utils/pcFolder';
import { getAllOfflineAnswers, publishToSheet, removePublishedFromPC, PublishResult } from '../utils/storage';
import { getApiUrl, setApiUrl, errorText } from '../utils/api';

interface OfflineBarProps {
  language: Language;
  responses: SurveyResponse[];
  pending: number;
  onChanged: () => void;
}

/** Offline HTML file: what is on this PC, the save folder, and Publish to the Google Sheet. */
export const OfflineBar: React.FC<OfflineBarProps> = ({ language, responses, pending, onChanged }) => {
  const km = language === 'km';
  const [folder, setFolder] = useState<FolderState>({ status: 'none' });
  const [showPublish, setShowPublish] = useState(false);

  useEffect(() => {
    folderState().then(setFolder).catch(() => setFolder({ status: 'unsupported' }));
  }, [responses.length]);

  const handleFolder = async (pickNew: boolean) => {
    try {
      const st = await connectFolder(pickNew);
      setFolder(st);
      // catch up: write every answer into the folder
      if (st.status === 'ready') {
        const all = getAllOfflineAnswers();
        await saveAnswersToFolder(all, all);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') alert(String(err?.message || err));
    }
  };

  const handleDownload = () => {
    const all = getAllOfflineAnswers();
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const blob = new Blob(
      [JSON.stringify({ app: 'WISN offline survey', exportedAt: new Date().toISOString(), totalResponses: all.length, responses: all }, null, 2)],
      { type: 'application/json;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WISN_offline_answers_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const folderLine = (() => {
    switch (folder.status) {
      case 'ready':
        return {
          tone: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: <FolderCheck className="w-4 h-4 text-emerald-600 shrink-0" />,
          text: km ? `ចម្លើយនីមួយៗក៏ត្រូវបានរក្សាទុកជាឯកសារក្នុង Folder «${folder.name}»` : `Each answer is also saved as a file in the folder "${folder.name}"`,
          button: km ? 'ប្តូរ Folder' : 'Change folder',
          pickNew: true,
        };
      case 'needs_permission':
        return {
          tone: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: <FolderOpen className="w-4 h-4 text-amber-600 shrink-0" />,
          text: km ? `ចុចដើម្បីអនុញ្ញាតឱ្យរក្សាទុកក្នុង Folder «${folder.name}» ម្តងទៀត` : `Click to allow saving into the folder "${folder.name}" again`,
          button: km ? 'អនុញ្ញាត' : 'Allow',
          pickNew: false,
        };
      case 'none':
        return {
          tone: 'bg-sky-50 border-sky-200 text-sky-900',
          icon: <FolderOpen className="w-4 h-4 text-sky-600 shrink-0" />,
          text: km ? 'ជ្រើស Folder លើកុំព្យូទ័រ ដើម្បីរក្សាទុកច្បាប់ចម្លងនៃចម្លើយនីមួយៗ (ការពារការបាត់បង់)' : 'Choose a folder on this PC to keep a file copy of every answer (safer)',
          button: km ? 'ជ្រើស Folder' : 'Choose folder',
          pickNew: true,
        };
      default:
        return {
          tone: 'bg-slate-50 border-slate-200 text-slate-700',
          icon: <HardDrive className="w-4 h-4 text-slate-500 shrink-0" />,
          text: km
            ? 'Browser នេះមិនអាចរក្សាទុកក្នុង Folder បានទេ។ សូមប្រើ Chrome ឬ Edge ឬចុច Download ជាប្រចាំ។'
            : "This browser can't save into a folder. Use Chrome or Edge, or press Download often.",
          button: '',
          pickNew: false,
        };
    }
  })();

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl border bg-slate-900 border-slate-900 text-white text-xs font-semibold">
        <HardDrive className="w-4 h-4 text-teal-300 shrink-0" />
        <span className="flex-1 min-w-0">
          {km
            ? `ឯកសារ Offline · ចម្លើយ ${responses.length} នៅលើកុំព្យូទ័រនេះ · ${pending} មិនទាន់ Publish`
            : `Offline file · ${responses.length} answers on this PC · ${pending} not published yet`}
        </span>
        <button onClick={handleDownload} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20">
          <Download className="w-3.5 h-3.5" /> {km ? 'ទាញយកទាំងអស់' : 'Download all'}
        </button>
        <button
          onClick={() => setShowPublish(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950"
        >
          <UploadCloud className="w-3.5 h-3.5" /> {km ? 'Publish ទៅ Google Sheet' : 'Publish to Google Sheet'}
        </button>
      </div>

      <div className={`flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${folderLine.tone}`}>
        {folderLine.icon}
        <span className="flex-1 min-w-0">{folderLine.text}</span>
        {folderLine.button && (
          <button onClick={() => handleFolder(folderLine.pickNew)} className="px-2.5 py-1 rounded-lg bg-white border border-current/20 hover:bg-white/70">
            {folderLine.button}
          </button>
        )}
      </div>

      {showPublish && (
        <PublishDialog
          km={km}
          pending={pending}
          onClose={() => setShowPublish(false)}
          onChanged={onChanged}
        />
      )}
    </div>
  );
};

const inputCls =
  'w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/50 focus:outline-none';

const PublishDialog: React.FC<{ km: boolean; pending: number; onClose: () => void; onChanged: () => void }> = ({
  km, pending, onClose, onChanged,
}) => {
  const [url, setUrl] = useState(getApiUrl());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState<PublishResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!/^https?:\/\//.test(url.trim())) {
      setError(km ? 'សូមបញ្ចូលតំណ Google Sheet (/exec)' : 'Enter the Google Sheet web app link (ends with /exec)');
      return;
    }
    setApiUrl(url);
    setBusy(true);
    try {
      const r = await publishToSheet(username, password, (d, t) => setProgress(`${d} / ${t}`));
      setResult(r);
      setPassword('');
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
      setProgress('');
      onChanged();
    }
  };

  const handleRemovePublished = () => {
    const msg = km
      ? 'លុបចម្លើយដែលបាន Publish រួចពីកុំព្យូទ័រនេះ? (វានៅក្នុង Google Sheet និងក្នុង Folder)'
      : 'Remove the answers already in the Google Sheet from this PC? (They stay in the Sheet and in the folder.)';
    if (!confirm(msg)) return;
    try {
      const n = removePublishedFromPC();
      alert(km ? `បានលុប ${n}` : `Removed ${n}`);
      onChanged();
    } catch (err: any) {
      alert(String(err?.message || err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800">
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20" title="Close">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-black flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> {km ? 'Publish ទៅ Google Sheet' : 'Publish to Google Sheet'}
          </h2>
          <p className="text-xs text-teal-100 mt-1">
            {km ? `ចម្លើយ ${pending} នឹងត្រូវបញ្ជូន (ត្រូវការអ៊ីនធឺណិត)` : `${pending} answers will be sent (needs internet)`}
          </p>
        </div>

        <form onSubmit={handlePublish} className="p-5 space-y-3">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> <span>{error}</span>
            </div>
          )}
          {result && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {km ? `បានបញ្ជូន ${result.sent} / ${result.total}` : `Sent ${result.sent} of ${result.total}`}
              </div>
              {result.held > 0 && (
                <div>{km ? `${result.held} មានលេខកូដបុគ្គលិកស្ទួន → ផ្ទាំង Duplicates` : `${result.held} had a staff code already in the Sheet → kept in its "Duplicates" tab`}</div>
              )}
              {result.failed > 0 && (
                <div className="text-rose-700">{km ? `${result.failed} មិនបានបញ្ជូន (សូមព្យាយាមម្តងទៀត)` : `${result.failed} not sent (try again)`}</div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{km ? 'តំណ Google Sheet (Web app /exec)' : 'Google Sheet link (web app, ends with /exec)'}</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://script.google.com/macros/s/…/exec" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{km ? 'ឈ្មោះគណនី' : 'Username'}</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" autoComplete="username" className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{km ? 'ពាក្យសម្ងាត់' : 'Password'}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={inputCls} required />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            {km
              ? 'ប្រើគណនី Admin ដើម្បីរក្សាលេខកូដអ្នកសម្ភាសន៍របស់ចម្លើយនីមួយៗ។'
              : "Use an admin account to keep each answer's own interviewer code (an interviewer account puts its own code on all of them)."}
          </p>
          <button
            type="submit"
            disabled={busy || pending === 0}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
          >
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {busy ? progress || (km ? 'កំពុងបញ្ជូន…' : 'Sending…') : pending === 0 ? (km ? 'គ្មានអ្វីត្រូវ Publish' : 'Nothing to publish') : km ? 'Publish ឥឡូវ' : 'Publish now'}
          </button>
          <button
            type="button"
            onClick={handleRemovePublished}
            className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> {km ? 'លុបចម្លើយដែល Publish រួចពីកុំព្យូទ័រនេះ' : 'Remove published answers from this PC'}
          </button>
        </form>
      </div>
    </div>
  );
};
