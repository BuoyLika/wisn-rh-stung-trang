import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { getSavedUsers, loginUser, registerUser } from '../utils/storage';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('interviewer');
  const [regCode, setRegCode] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOrg, setRegOrg] = useState('RH Stung Trang Field Team');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginUsername.trim()) {
      setLoginError('សូមវាយបញ្ចូលឈ្មោះគណនី (Enter username)');
      return;
    }
    const res = loginUser(loginUsername, loginPassword);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setLoginError(res.error || 'ការចូលប្រើមិនត្រឹមត្រូវ (Login failed)');
    }
  };

  const handleQuickLogin = (u: UserAccount) => {
    const res = loginUser(u.username, u.password || '');
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim() || !regUsername.trim() || !regCode.trim() || !regPassword.trim()) {
      setRegError('សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់ (Fill all required fields)');
      return;
    }

    const res = registerUser({
      name: regName.trim(),
      username: regUsername.trim(),
      role: regRole,
      interviewerCode: regCode.trim(),
      phone: regPhone.trim(),
      organization: regOrg.trim(),
      password: regPassword.trim()
    });

    if (res.success && res.user) {
      setRegSuccess('ចុះឈ្មោះគណនីបានជោគជ័យ! ប្រព័ន្ធបានចូលប្រើដោយស្វ័យប្រវត្តិ។');
      onLoginSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setRegError(res.error || 'ការចុះឈ្មោះមិនបានសម្រេច (Registration failed)');
    }
  };

  const allSavedUsers = getSavedUsers();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 relative">
          {currentUser && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
              title="បិទ (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 text-[11px] font-bold text-teal-200 mb-2 border border-teal-700">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>ប្រព័ន្ធគ្រប់គ្រងសិទ្ធិ និងអ្នកសម្ភាសន៍ (WISN Auth)</span>
          </div>
          <h2 className="text-xl font-black">
            {activeTab === 'login' ? 'ចូលប្រើប្រព័ន្ធ (Login)' : 'ចុះឈ្មោះអ្នកសម្ភាសន៍ថ្មី (Register)'}
          </h2>
          <p className="text-xs text-teal-200/90 mt-1">
            {currentUser ? (
              <>
                គណនីបច្ចុប្បន្ន៖ <strong className="text-white">{currentUser.name}</strong> ({currentUser.role === 'admin' ? '🛡️ Admin' : `📝 អ្នកសម្ភាសន៍ [${currentUser.interviewerCode}]`})
              </>
            ) : (
              <span className="text-amber-300 font-medium">
                ⚠️ សូមចូលប្រើប្រព័ន្ធ ឬជ្រើសរើសគណនីអ្នកសម្ភាសន៍ ដើម្បីចាប់ផ្តើម
              </span>
            )}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'login'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>ចូលប្រើប្រព័ន្ធ (Login)</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'register'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>ចុះឈ្មោះអ្នកសម្ភាសន៍ (Register)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <div className="space-y-5">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ឈ្មោះគណនី (Username)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="ឧទាហរណ៍៖ admin ឬ k001"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs sm:text-sm font-medium"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ពាក្យសម្ងាត់ (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ចូលប្រើប្រព័ន្ធ (Log In)</span>
                </button>
              </form>

              {/* Quick Switch Profiles (Test Accounts) */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ចូលប្រើរហ័សដោយចុចតែម្តង (Quick Switch Accounts):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allSavedUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        currentUser?.id === u.id
                          ? 'border-teal-500 bg-teal-50/70 text-teal-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {u.username} • {u.role === 'admin' ? '🛡️ Admin' : `[${u.interviewerCode}]`}
                        </div>
                      </div>
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Register New Interviewer Tab */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ឈ្មោះពេញរបស់អ្នកសម្ភាសន៍ *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ឧ. គឹម សុខា"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ឈ្មោះគណនី (Username) *
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ឧ. sokha_k003"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    លេខកូដអ្នកសម្ភាសន៍ (Interviewer Code) *
                  </label>
                  <input
                    type="text"
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value.toUpperCase())}
                    placeholder="ឧ. K003, INT-02"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-teal-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    តួនាទី (Role)
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                  >
                    <option value="interviewer">📝 អ្នកជួយសម្ភាសន៍ (Interviewer)</option>
                    <option value="admin">🛡️ អ្នកគ្រប់គ្រង (Admin / Lead)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    លេខទូរស័ព្ទ (Phone)
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ពាក្យសម្ងាត់ (Password) *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ស្ថាប័ន / ក្រុមការងារ (Organization)
                </label>
                <input
                  type="text"
                  value={regOrg}
                  onChange={(e) => setRegOrg(e.target.value)}
                  placeholder="វិទ្យាស្ថានជាតិសុខភាពសាធារណៈ (NIPH)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>ចុះឈ្មោះ និងចាប់ផ្តើមសម្ភាសន៍ (Register & Start)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
