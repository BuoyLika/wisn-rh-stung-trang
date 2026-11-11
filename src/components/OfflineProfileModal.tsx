import React, { useState } from 'react';
import { HardDrive, X } from 'lucide-react';
import { OfflineProfile } from '../utils/storage';

interface Props {
  isOpen: boolean;
  current: OfflineProfile | null;
  onSave: (p: OfflineProfile) => void;
  onClose: () => void;
}

/** Offline file: who is interviewing on this PC (no password, nothing leaves the PC). */
export const OfflineProfileModal: React.FC<Props> = ({ isOpen, current, onSave, onClose }) => {
  const [name, setName] = useState(current?.name || '');
  const [code, setCode] = useState(current?.interviewerCode || '');
  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    onSave({ name: name.trim(), interviewerCode: code.trim().toUpperCase() });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-teal-900 text-white p-6 relative">
          {current && (
            <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/20" title="Close">
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-teal-200 mb-2 border border-white/20">
            <HardDrive className="w-3.5 h-3.5" /> Offline
          </div>
          <h2 className="text-xl font-black">អ្នកសម្ភាសន៍លើកុំព្យូទ័រនេះ (Interviewer on this PC)</h2>
          <p className="text-xs text-teal-100/90 mt-1">
            ចម្លើយត្រូវបានរក្សាទុកលើកុំព្យូទ័រនេះ រហូតដល់អ្នក Publish ទៅ Google Sheet។ (Answers stay on this PC until you publish them.)
          </p>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះ (Your name) *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">លេខកូដអ្នកសម្ភាសន៍ (Interviewer code) *</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="K001"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-teal-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md">
            ចាប់ផ្តើម (Start)
          </button>
        </form>
      </div>
    </div>
  );
};
