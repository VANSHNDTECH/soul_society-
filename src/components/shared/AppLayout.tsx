import React from 'react';
import { AppModuleId } from './ModuleNavigation';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { ResearchTab } from '../../types/research';
import { Module2Tab } from '../../types/module2';
import { useApp } from '../../context/AppContext';
import { Toast } from '../Toast';
import { AcademicPresentationModal } from '../AcademicPresentationModal';
import { ProfileDetailModal } from '../ProfileDetailModal';
import { IntroductionModal } from '../IntroductionModal';
import { WhyMatchModal } from '../WhyMatchModal';
import { ReportModal } from '../ReportModal';

export interface AppLayoutProps {
  activeModule: AppModuleId;
  onSelectModule: (moduleId: AppModuleId) => void;
  module1Tab: ResearchTab;
  setModule1Tab: (tab: ResearchTab) => void;
  module2Tab: Module2Tab;
  setModule2Tab: (tab: Module2Tab) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeModule,
  onSelectModule,
  module1Tab,
  setModule1Tab,
  module2Tab,
  setModule2Tab,
  children,
}) => {
  const { setActiveTab: setModule3Tab, setShowPresentationModal } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5] text-stone-900 font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* Persistent Unified Global Header */}
      <AppHeader
        activeModule={activeModule}
        onSelectModule={onSelectModule}
        module1Tab={module1Tab}
        setModule1Tab={setModule1Tab}
        module2Tab={module2Tab}
        setModule2Tab={setModule2Tab}
        onOpenPresentation={() => setShowPresentationModal(true)}
      />

      {/* Main Unified Content Area */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Persistent Unified Global Footer */}
      <AppFooter
        activeModule={activeModule}
        onSelectModule={onSelectModule}
        onSelectModule1Tab={setModule1Tab}
        onSelectModule2Tab={setModule2Tab}
        onSelectModule3Tab={setModule3Tab}
        onOpenPresentation={() => setShowPresentationModal(true)}
      />

      {/* Global Modals & Notifications */}
      <ProfileDetailModal />
      <IntroductionModal />
      <WhyMatchModal />
      <ReportModal />
      <AcademicPresentationModal />
      <Toast />
    </div>
  );
};
