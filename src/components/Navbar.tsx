import React from 'react';
import { AppView, Language, UserAccount } from '../types';
import { useTranslation } from '../i18n/translations';
import { 
  FileText, 
  BarChart3, 
  Settings2, 
  ListFilter, 
  Download, 
  Languages, 
  GraduationCap,
  Calculator,
  User,
  ShieldCheck,
  Tablet
} from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  responseCount: number;
  onOpenExport: () => void;
  currentUser: UserAccount;
  onOpenAuth: () => void;
  onOpenSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  language,
  setLanguage,
  responseCount,
  onOpenExport,
  currentUser,
  onOpenAuth,
  onOpenSync,
}) => {
  const t = useTranslation(language);

  // If interviewer, hide or show builder differently
  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'survey', label: t.navSurvey, icon: <FileText className="w-4 h-4" /> },
    { id: 'wisn_calculator', label: (t as any).navWisn || 'គណនា WISN', icon: <Calculator className="w-4 h-4" /> },
    { id: 'analytics', label: t.navAnalytics, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'responses', label: t.navResponses, icon: <ListFilter className="w-4 h-4" />, badge: responseCount },
    ...(currentUser.role === 'admin'
      ? [{ id: 'builder' as AppView, label: t.navBuilder, icon: <Settings2 className="w-4 h-4" /> }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('survey')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  {language === 'km' ? 'ប្រព័ន្ធកម្រងសំណួរស្រាវជ្រាវ' : 'Research Questionnaire'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-100 text-teal-800 rounded-full uppercase tracking-wider">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Academic & Scientific Survey Suite
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? 'bg-white text-teal-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[11px] rounded-full font-bold ${
                      active ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Tablet Data Sync Button */}
            <button
              onClick={onOpenSync}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 transition shadow-2xs"
              title="បម្រុងទុក និងច្របាច់ទិន្នន័យពី Tablet (Data Sync & Merge)"
            >
              <Tablet className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden lg:inline">Sync Tablet</span>
            </button>

            {/* User Account / Login Pill */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition shadow-2xs ${
                currentUser.role === 'admin'
                  ? 'bg-slate-900 border-slate-900 text-teal-400 hover:bg-slate-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
              }`}
              title="គ្រប់គ្រងគណនី / ចូលប្រើប្រព័ន្ធ"
            >
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-emerald-700" />
              )}
              <span className="max-w-[120px] truncate">
                {currentUser.role === 'admin' ? 'Admin' : currentUser.interviewerCode}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-sm"
              title="Change Language / ប្តូរភាសា"
            >
              <Languages className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">{language === 'km' ? 'KM' : 'EN'}</span>
            </button>

            {/* Quick Export Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition shadow-sm shadow-teal-600/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t.exportBtn}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto">
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
                  active ? 'text-teal-600 font-bold' : 'text-slate-500'
                }`}
              >
                {item.icon}
                <span className="mt-1 text-[11px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
