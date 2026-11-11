import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Language, ResearchSurvey, SurveyResponse, UserAccount } from './types';
import {
  getSavedSurvey,
  saveSurvey,
  resetSurveyToDefault,
  getSavedResponses,
  queueResponse,
  updateResponse,
  deleteResponse,
  clearAllResponses,
  getCurrentUser,
  logoutUser,
  syncNow,
  SyncResult,
  loadConfig,
  saveSurveyRemote,
  getPendingCount,
  getUploadProblems,
  clearUploadProblems,
  getOldLocalResponses,
  queueOldLocalResponses,
  getOfflineProfile,
  setOfflineProfile,
} from './utils/storage';
import { OFFLINE_MODE } from './config';
import { OfflineBar } from './components/OfflineBar';
import { OfflineProfileModal } from './components/OfflineProfileModal';
import { isApiConfigured, errorText, ApiError } from './utils/api';
import { Navbar } from './components/Navbar';
import { RespondentView } from './components/RespondentView';
import { FormBuilder } from './components/FormBuilder';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ResponseListView } from './components/ResponseListView';
import { ExportModal } from './components/ExportModal';
import { WisnCalculator } from './components/WisnCalculator';
import { AuthModal } from './components/AuthModal';
import { DataSyncModal } from './components/DataSyncModal';
import { SyncBar } from './components/SyncBar';

const SYNC_EVERY_MS = 60_000;

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('survey');
  const [language, setLanguage] = useState<Language>('km');
  const [survey, setSurvey] = useState<ResearchSurvey>(getSavedSurvey);
  const [responses, setResponses] = useState<SurveyResponse[]>(getSavedResponses);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  // bumps when the shared settings arrive, so the calculator reloads them
  const [configVersion, setConfigVersion] = useState(0);

  const [currentUser, setCurrentUser] = useState<UserAccount>(getCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // upload state shown in the bar under the menu
  const [pending, setPending] = useState(getPendingCount);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<ApiError | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [problemCount, setProblemCount] = useState(() => getUploadProblems().length);
  const [duplicatesHeld, setDuplicatesHeld] = useState(0);
  const [oldLocalCount, setOldLocalCount] = useState(() => getOldLocalResponses().length);

  const isAdmin = currentUser?.role === 'admin';

  const applySync = useCallback((r: SyncResult) => {
    setResponses(r.responses);
    setPending(r.pending);
    setProblemCount(getUploadProblems().length);
    if (r.duplicatesHeld !== undefined) setDuplicatesHeld(r.duplicatesHeld);
    setSyncError(r.error || null);
    if (!r.error) setLastSync(new Date());
    if (r.error?.code === 'auth') {
      setCurrentUser(getCurrentUser());
      setIsAuthModalOpen(false);
    }
  }, []);

  const runSync = useCallback(async () => {
    if (!getCurrentUser()) return;
    setSyncing(true);
    try {
      applySync(await syncNow());
    } finally {
      setSyncing(false);
    }
  }, [applySync]);

  // After login (and on every start): get the shared form + HO2 numbers, then sync answers.
  useEffect(() => {
    if (!currentUser) return;
    setResponses(getSavedResponses());
    setPending(getPendingCount());
    if (OFFLINE_MODE || !isApiConfigured()) return;
    setProblemCount(getUploadProblems().length);
    let stop = false;
    loadConfig()
      .then((cfg) => {
        if (stop) return;
        if (cfg.survey) setSurvey(cfg.survey);
        setConfigVersion((v) => v + 1);
      })
      .catch((err) => console.warn('Shared settings not loaded (using this device copy):', err));
    runSync();
    const timer = setInterval(runSync, SYNC_EVERY_MS);
    window.addEventListener('online', runSync);
    return () => {
      stop = true;
      clearInterval(timer);
      window.removeEventListener('online', runSync);
    };
  }, [currentUser?.id, runSync]);

  // keep the device copy of the form up to date
  useEffect(() => {
    saveSurvey(survey);
  }, [survey]);

  const refreshLocal = () => {
    setResponses(getSavedResponses());
    setPending(getPendingCount());
  };

  const handleLogout = async () => {
    if (OFFLINE_MODE) {
      // offline: only changes who is interviewing; answers stay on the PC
      setIsAuthModalOpen(true);
      return;
    }
    if (getPendingCount() > 0) {
      const ok = confirm(
        language === 'km'
          ? `មានចម្លើយ ${getPendingCount()} មិនទាន់បានបញ្ជូន។ វានឹងនៅលើឧបករណ៍នេះ ហើយបញ្ជូននៅពេលអ្នកចូលម្តងទៀត។ ចាកចេញ?`
          : `${getPendingCount()} answers are not uploaded yet. They stay on this device and upload when you log in again. Log out?`
      );
      if (!ok) return;
    }
    await logoutUser();
    setCurrentUser(getCurrentUser());
    setResponses([]);
    setPending(0);
    setSyncError(null);
    setLastSync(null);
    setIsAuthModalOpen(false);
  };

  const handleSubmitResponse = (newResponse: SurveyResponse) => {
    try {
      setResponses(queueResponse(newResponse));
    } catch (err: any) {
      alert(String(err?.message || err));
      return;
    }
    setPending(getPendingCount());
    if (!OFFLINE_MODE) runSync();
  };

  const showError = (err: unknown) => alert(errorText(err));

  const handleUpdateResponse = async (responseId: string, updatedData: Partial<SurveyResponse>) => {
    try {
      setResponses(await updateResponse(responseId, updatedData));
    } catch (err) {
      showError(err);
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    try {
      setResponses(await deleteResponse(responseId));
      setPending(getPendingCount());
    } catch (err) {
      showError(err);
    }
  };

  const handleSaveSurvey = async (updatedSurvey: ResearchSurvey) => {
    setSurvey(updatedSurvey);
    if (!isAdmin) return;
    try {
      await saveSurveyRemote(updatedSurvey);
    } catch (err) {
      showError(err);
    }
  };

  /** Admin (Form Builder): back to the built-in form, for every device. */
  const handleResetSurveyForAll = async () => {
    const fresh = resetSurveyToDefault();
    setSurvey(fresh);
    if (!isAdmin) return;
    try {
      await saveSurveyRemote(fresh);
    } catch (err) {
      showError(err);
    }
  };

  /** Anyone (survey page): reload the latest form, from the Sheet if online. */
  const handleRefreshSurvey = async () => {
    setSurvey(resetSurveyToDefault());
    try {
      const cfg = await loadConfig();
      if (cfg.survey) setSurvey(cfg.survey);
    } catch {
      /* offline: built-in form */
    }
  };

  const handleClearResponses = async () => {
    try {
      setResponses(await clearAllResponses());
    } catch (err) {
      showError(err);
    }
  };

  const handleUploadOld = () => {
    const n = queueOldLocalResponses();
    setOldLocalCount(0);
    setResponses(getSavedResponses());
    setPending(getPendingCount());
    if (n) runSync();
  };

  const handleDownloadProblems = () => {
    const problems = getUploadProblems();
    const blob = new Blob([JSON.stringify({ problems }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WISN_upload_problems_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleClearProblems = () => {
    clearUploadProblems();
    setProblemCount(0);
  };

  if (!OFFLINE_MODE && !isApiConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md bg-white rounded-2xl border border-amber-300 p-6 text-sm text-slate-700 space-y-2">
          <h1 className="font-black text-lg text-slate-900">Not connected to the Google Sheet</h1>
          <p>
            Paste the Apps Script web app address into <code>src/config.ts</code> and build again.
            Steps: <code>docs/SETUP_GOOGLE_SHEETS.md</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
        responseCount={responses.length}
        onOpenExport={() => setIsExportModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onLogout={handleLogout}
      />

      {currentUser && OFFLINE_MODE && (
        <OfflineBar language={language} responses={responses} pending={pending} onChanged={refreshLocal} />
      )}

      {currentUser && !OFFLINE_MODE && (
        <SyncBar
          language={language}
          pending={pending}
          syncing={syncing}
          error={syncError}
          lastSync={lastSync}
          problemCount={problemCount}
          duplicatesHeld={isAdmin ? duplicatesHeld : 0}
          oldLocalCount={oldLocalCount}
          onSyncNow={runSync}
          onUploadOld={handleUploadOld}
          onDownloadProblems={handleDownloadProblems}
          onClearProblems={handleClearProblems}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'survey' && (
          <RespondentView
            survey={survey}
            language={language}
            onSubmit={handleSubmitResponse}
            onViewAnalytics={() => setCurrentView('wisn_calculator')}
            onResetSurvey={handleRefreshSurvey}
            currentUser={currentUser || undefined}
          />
        )}

        {currentView === 'wisn_calculator' && (
          <WisnCalculator
            key={configVersion}
            survey={survey}
            responses={responses}
          />
        )}

        {currentView === 'builder' && isAdmin && (
          <FormBuilder
            survey={survey}
            language={language}
            onSaveSurvey={handleSaveSurvey}
            onResetDefault={handleResetSurveyForAll}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard
            survey={survey}
            responses={responses}
            language={language}
            onClearResponses={isAdmin ? handleClearResponses : undefined}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {currentView === 'responses' && (
          <ResponseListView
            survey={survey}
            responses={responses}
            language={language}
            onUpdateResponse={handleUpdateResponse}
            onDeleteResponse={handleDeleteResponse}
            currentUser={currentUser || undefined}
            onOpenSync={() => setIsSyncModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-700">WISN Tools Project</span> — WHO WISN workload &amp; staffing survey
          </div>
          <div>
            Built with React, TypeScript & Tailwind CSS | Open Source Academic Software
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        survey={survey}
        responses={responses}
        language={language}
      />

      {/* Offline file: who is interviewing on this PC */}
      {OFFLINE_MODE && (
        <OfflineProfileModal
          key={currentUser?.interviewerCode || 'none'}
          isOpen={isAuthModalOpen}
          current={getOfflineProfile()}
          onClose={() => currentUser && setIsAuthModalOpen(false)}
          onSave={(p) => {
            setOfflineProfile(p);
            setCurrentUser(getCurrentUser());
            refreshLocal();
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Login / accounts */}
      {!OFFLINE_MODE && (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          if (currentUser) {
            setIsAuthModalOpen(false);
          }
        }}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setSyncError(null);
          setIsAuthModalOpen(false);
        }}
      />
      )}

      {/* Backup file / import */}
      <DataSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        survey={survey}
        responses={responses}
        isAdmin={isAdmin}
        onMergeSuccess={(merged) => setResponses(merged)}
      />
    </div>
  );
};

export default App;
