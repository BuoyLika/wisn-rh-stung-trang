import React, { useEffect, useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { loginUser, listUsers, createUser, updateUser, changePassword } from '../utils/storage';
import { errorText } from '../utils/api';
import {
  User,
  Lock,
  ShieldCheck,
  UserPlus,
  LogIn,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Users,
  RefreshCw,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
}

type Tab = 'login' | 'users' | 'password';

const inputCls =
  'w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/50 focus:outline-none';

const Msg: React.FC<{ kind: 'error' | 'ok'; text: string | null }> = ({ kind, text }) =>
  text ? (
    <div
      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
        kind === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      }`}
    >
      {kind === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
      <span>{text}</span>
    </div>
  ) : null;

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const isAdmin = currentUser?.role === 'admin';

  // login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // users (admin)
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersOk, setUsersOk] = useState<string | null>(null);
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('interviewer');
  const [regCode, setRegCode] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOrg, setRegOrg] = useState('RH Stung Trang Field Team');
  const [regPassword, setRegPassword] = useState('');

  // own password
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwOk, setPwOk] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'users' && isAdmin) refreshUsers();
    if (!isAdmin && activeTab === 'users') setActiveTab('login');
  }, [isOpen, activeTab, isAdmin]);

  if (!isOpen) return null;

  async function refreshUsers() {
    try {
      setUsers(await listUsers());
      setUsersError(null);
    } catch (err) {
      setUsersError(errorText(err));
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginUsername.trim()) {
      setLoginError('សូមវាយបញ្ចូលឈ្មោះគណនី (Enter username)');
      return;
    }
    setBusy(true);
    const res = await loginUser(loginUsername, loginPassword);
    setBusy(false);
    if (res.success && res.user) {
      setLoginPassword('');
      onLoginSuccess(res.user);
      onClose();
    } else {
      setLoginError(errorText(res.error));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsersError(null);
    setUsersOk(null);
    if (!regName.trim() || !regUsername.trim() || !regCode.trim() || !regPassword.trim()) {
      setUsersError('សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់ (Fill all required fields)');
      return;
    }
    setBusy(true);
    try {
      const u = await createUser({
        name: regName.trim(),
        username: regUsername.trim(),
        role: regRole,
        interviewerCode: regCode.trim(),
        phone: regPhone.trim(),
        organization: regOrg.trim(),
        password: regPassword,
      });
      setUsersOk(`បានបង្កើតគណនី ${u.username} [${u.interviewerCode}] (Account created). Give them the username and password.`);
      setRegName('');
      setRegUsername('');
      setRegCode('');
      setRegPhone('');
      setRegPassword('');
      refreshUsers();
    } catch (err) {
      setUsersError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const handleToggleActive = async (u: UserAccount) => {
    setUsersError(null);
    setUsersOk(null);
    try {
      await updateUser(u.id, { active: !u.active });
      refreshUsers();
    } catch (err) {
      setUsersError(errorText(err));
    }
  };

  const handleSetPassword = async (u: UserAccount) => {
    const pw = prompt(`ពាក្យសម្ងាត់ថ្មីសម្រាប់ ${u.username} (New password, at least 6 characters):`);
    if (!pw) return;
    setUsersError(null);
    setUsersOk(null);
    try {
      await updateUser(u.id, { newPassword: pw });
      setUsersOk(`បានប្តូរពាក្យសម្ងាត់ ${u.username} (Password changed)`);
    } catch (err) {
      setUsersError(errorText(err));
    }
  };

  const handleChangeOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwOk(null);
    setBusy(true);
    try {
      await changePassword(oldPw, newPw);
      setPwOk('បានប្តូរពាក្យសម្ងាត់ (Password changed)');
      setOldPw('');
      setNewPw('');
    } catch (err) {
      setPwError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'login', label: 'ចូលប្រើ (Login)', icon: <LogIn className="w-4 h-4" /> },
    ...(isAdmin ? [{ id: 'users' as Tab, label: 'គណនី (Users)', icon: <Users className="w-4 h-4" /> }] : []),
    ...(currentUser ? [{ id: 'password' as Tab, label: 'ពាក្យសម្ងាត់ (Password)', icon: <KeyRound className="w-4 h-4" /> }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`bg-white w-full ${activeTab === 'users' ? 'max-w-2xl' : 'max-w-lg'} rounded-3xl shadow-2xl overflow-hidden border border-slate-200`}>
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
            {activeTab === 'login' ? 'ចូលប្រើប្រព័ន្ធ (Login)' : activeTab === 'users' ? 'គណនីអ្នកប្រើ (User accounts)' : 'ប្តូរពាក្យសម្ងាត់ (Change password)'}
          </h2>
          <p className="text-xs text-teal-200/90 mt-1">
            {currentUser ? (
              <>
                គណនីបច្ចុប្បន្ន៖ <strong className="text-white">{currentUser.name}</strong> (
                {isAdmin ? '🛡️ Admin' : `📝 អ្នកសម្ភាសន៍ [${currentUser.interviewerCode}]`})
              </>
            ) : (
              <span className="text-amber-300 font-medium">
                ⚠️ សូមចូលប្រើប្រព័ន្ធ ដើម្បីចាប់ផ្តើម (Please log in to start)
              </span>
            )}
          </p>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeTab === tab.id ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="p-6">
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Msg kind="error" text={loginError} />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះគណនី (Username)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    autoComplete="username"
                    autoCapitalize="none"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs sm:text-sm font-medium"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ពាក្យសម្ងាត់ (Password)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>ចូលប្រើប្រព័ន្ធ (Log In)</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                គ្មានគណនី? សូមសុំពីប្រធានក្រុមស្រាវជ្រាវ (No account? Ask the research lead.)
              </p>
            </form>
          )}

          {activeTab === 'users' && isAdmin && (
            <div className="space-y-5">
              <Msg kind="error" text={usersError} />
              <Msg kind="ok" text={usersOk} />

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">គណនីទាំងអស់ (All accounts): {users.length}</span>
                  <button onClick={refreshUsers} className="p-1 rounded-lg hover:bg-slate-200" title="Refresh">
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {users.map((u) => (
                    <div key={u.id} className={`flex items-center gap-2 px-3 py-2 text-xs ${u.active ? '' : 'opacity-50'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {u.username} • {u.role === 'admin' ? '🛡️ Admin' : `[${u.interviewerCode}]`}
                          {!u.active && ' • OFF'}
                        </div>
                      </div>
                      <button onClick={() => handleSetPassword(u)} className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold">
                        <KeyRound className="w-3 h-3 inline mr-1" />
                        Password
                      </button>
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`px-2 py-1 rounded-lg border text-[11px] font-semibold ${
                            u.active ? 'border-rose-200 text-rose-700 hover:bg-rose-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.active ? 'Turn off' : 'Turn on'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                  <UserPlus className="w-4 h-4 text-teal-600" /> បន្ថែមគណនី (Add account)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះពេញ (Full name) *</label>
                    <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះគណនី (Username) *</label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase())}
                      placeholder="k003"
                      autoCapitalize="none"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">លេខកូដអ្នកសម្ភាសន៍ (Interviewer code) *</label>
                    <input
                      type="text"
                      value={regCode}
                      onChange={(e) => setRegCode(e.target.value.toUpperCase())}
                      placeholder="K003"
                      className={inputCls + ' font-black text-teal-800'}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">តួនាទី (Role)</label>
                    <select value={regRole} onChange={(e) => setRegRole(e.target.value as UserRole)} className={inputCls}>
                      <option value="interviewer">📝 អ្នកសម្ភាសន៍ (Interviewer)</option>
                      <option value="admin">🛡️ អ្នកគ្រប់គ្រង (Admin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ពាក្យសម្ងាត់ (Password, 6+) *</label>
                    <input type="text" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">លេខទូរស័ព្ទ (Phone)</label>
                    <input type="text" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ស្ថាប័ន / ក្រុមការងារ (Organization)</label>
                  <input type="text" value={regOrg} onChange={(e) => setRegOrg(e.target.value)} className={inputCls} />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>បង្កើតគណនី (Create account)</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && currentUser && (
            <form onSubmit={handleChangeOwnPassword} className="space-y-4">
              <Msg kind="error" text={pwError} />
              <Msg kind="ok" text={pwOk} />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ពាក្យសម្ងាត់បច្ចុប្បន្ន (Current password)</label>
                <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} autoComplete="current-password" className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ពាក្យសម្ងាត់ថ្មី (New password, 6+)</label>
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="new-password" minLength={6} className={inputCls} required />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>ប្តូរពាក្យសម្ងាត់ (Change password)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
