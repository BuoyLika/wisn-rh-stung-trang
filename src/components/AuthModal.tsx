import React, { useState } from 'react';
import { UserAccount } from '../types';
import { getSavedUsers, loginUser } from '../utils/storage';
import { 
  User, 
  Check, 
  X, 
  CheckCircle2, 
  UserCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [customCode, setCustomCode] = useState('');
  const allSavedUsers = getSavedUsers();

  if (!isOpen) return null;

  const handleSelectUser = (u: UserAccount) => {
    const res = loginUser(u.username);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  const handleApplyCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode.trim()) return;
    const cleanCode = customCode.trim().toUpperCase();
    const res = loginUser(cleanCode);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
            title="បិទ (Close)"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 text-[11px] font-bold text-teal-200 mb-2 border border-teal-700">
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>កំណត់លេខកូដអ្នកសម្ភាសន៍ (Interviewer ID)</span>
          </div>
          <h2 className="text-lg font-black">
            ជ្រើសរើស ឬប្តូរលេខកូដអ្នកសម្ភាសន៍
          </h2>
          <p className="text-xs text-teal-200/90 mt-1">
            កូដបច្ចុប្បន្ន៖ <strong className="text-white underline">{currentUser.interviewerCode}</strong> ({currentUser.name})
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              ជ្រើសរើសកូដរហ័ស (Quick Select):
            </label>
            <div className="grid grid-cols-1 gap-2">
              {allSavedUsers.map((u) => {
                const isSelected = currentUser.interviewerCode === u.interviewerCode;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/80 text-teal-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.interviewerCode}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{u.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {u.organization || 'មន្ទីរពេទ្យបង្អែកស្ទឹងត្រង់'}
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-transparent hover:text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Code Input */}
          <form onSubmit={handleApplyCustomCode} className="pt-3 border-t border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              ឬវាយបញ្ចូលកូដផ្ទាល់ខ្លួន (Custom Code):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="ឧ. K004 ឬ ST-05"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs sm:text-sm font-semibold uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition shrink-0"
              >
                កំណត់កូដ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
