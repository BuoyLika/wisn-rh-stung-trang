import React, { useState, useEffect } from 'react';
import { AppView, Language, ResearchSurvey, SurveyResponse, UserAccount } from './types';
import { 
  getSavedSurvey, 
  saveSurvey, 
  resetSurveyToDefault, 
  getSavedResponses, 
  saveResponse, 
  updateResponse,
  deleteResponse,
  clearAllResponses, 
  seedMockResponses,
  getCurrentUser
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { RespondentView } from './components/RespondentView';
import { FormBuilder } from './components/FormBuilder';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ResponseListView } from './components/ResponseListView';
import { ExportModal } from './components/ExportModal';
import { WisnCalculator } from './components/WisnCalculator';
import { AuthModal } from './components/AuthModal';
import { DataSyncModal } from './components/DataSyncModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('survey');
  const [language, setLanguage] = useState<Language>('km');
  const [survey, setSurvey] = useState<ResearchSurvey>(getSavedSurvey);
  const [responses, setResponses] = useState<SurveyResponse[]>(getSavedResponses);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Active Interviewer state (Default to K001, completely open access)
  const [currentUser, setCurrentUser] = useState<UserAccount>(getCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Force upgrade if browser has outdated survey schema cached
  useEffect(() => {
    const hasOpdObGyn = survey.sections?.some((s) => s.id === 'sec-g-opd-obgyn');
    const hasEye = survey.sections?.some((s) => s.id === 'sec-g-eye');
    if (!hasOpdObGyn || !hasEye || (survey.questions?.length || 0) < 210) {
      console.log('Force-refreshing survey to latest WISN version with OPD OB/GYN & Eye Clinic...');
      const fresh = resetSurveyToDefault();
      setSurvey(fresh);
    }
  }, []);

  // Sync state with storage
  useEffect(() => {
    saveSurvey(survey);
  }, [survey]);

  const handleSubmitResponse = (newResponse: SurveyResponse) => {
    const updated = saveResponse(newResponse);
    setResponses(updated);
  };

  const handleUpdateResponse = (responseId: string, updatedData: Partial<SurveyResponse>) => {
    const updated = updateResponse(responseId, updatedData);
    setResponses(updated);
  };

  const handleDeleteResponse = (responseId: string) => {
    const updated = deleteResponse(responseId);
    setResponses(updated);
  };

  const handleSaveSurvey = (updatedSurvey: ResearchSurvey) => {
    setSurvey(updatedSurvey);
    saveSurvey(updatedSurvey);
  };

  const handleResetSurvey = () => {
    const defaultSurvey = resetSurveyToDefault();
    setSurvey(defaultSurvey);
  };

  const handleLoadMockData = () => {
    const seeded = seedMockResponses();
    setResponses(seeded);
  };

  const handleClearResponses = () => {
    clearAllResponses();
    setResponses([]);
  };

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
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'survey' && (
          <RespondentView
            survey={survey}
            language={language}
            onSubmit={handleSubmitResponse}
            onViewAnalytics={() => setCurrentView('wisn_calculator')}
            onResetSurvey={handleResetSurvey}
            currentUser={currentUser}
          />
        )}

        {currentView === 'wisn_calculator' && (
          <WisnCalculator
            survey={survey}
            responses={responses}
          />
        )}

        {currentView === 'builder' && (
          <FormBuilder
            survey={survey}
            language={language}
            onSaveSurvey={handleSaveSurvey}
            onResetDefault={handleResetSurvey}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard
            survey={survey}
            responses={responses}
            language={language}
            onLoadMockData={handleLoadMockData}
            onClearResponses={handleClearResponses}
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
            currentUser={currentUser}
            onOpenSync={() => setIsSyncModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-700">Research Questionnaire Platform</span> — Scientific Survey Engine
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

      {/* Interviewer Code Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Multi-Device Data Sync Modal */}
      <DataSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        survey={survey}
        responses={responses}
        onMergeSuccess={(merged) => setResponses(merged)}
      />
    </div>
  );
};

export default App;
