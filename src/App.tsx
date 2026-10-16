import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { LandingPage } from './components/LandingPage';
import { OnboardingView } from './components/OnboardingView';
import { DiscoveryView } from './components/DiscoveryView';
import { IntroductionsView } from './components/IntroductionsView';
import { ConnectionsChatView } from './components/ConnectionsChatView';
import { SafetyCenterView } from './components/SafetyCenterView';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { IntroductionModal } from './components/IntroductionModal';
import { WhyMatchModal } from './components/WhyMatchModal';
import { ReportModal } from './components/ReportModal';
import { AcademicPresentationModal } from './components/AcademicPresentationModal';
import { Sparkles, Shield, HeartHandshake, GraduationCap } from 'lucide-react';


const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setShowPresentationModal } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5] text-stone-800">
      {/* Navigation */}
      <Navbar />

      {/* Screen Views */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'onboarding' && <OnboardingView />}
        {activeTab === 'discovery' && <DiscoveryView />}
        {activeTab === 'requests' && <IntroductionsView />}
        {activeTab === 'chat' && <ConnectionsChatView />}
        {activeTab === 'safety' && <SafetyCenterView />}
      </main>

      {/* Modals & Overlays */}
      <ProfileDetailModal />
      <IntroductionModal />
      <WhyMatchModal />
      <ReportModal />
      <AcademicPresentationModal />
      <Toast />

      {/* Persistent Academic & Ethical Footer */}
      <footer className="bg-stone-900 text-stone-300 py-10 border-t border-stone-800 text-left text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-white">
                  CommonGround
                </span>
                <span className="text-[10px] bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded-full border border-teal-700/60 font-semibold">
                  Consent-First Social Discovery
                </span>
              </div>
              <p className="text-stone-400 text-xs max-w-lg">
                Better connections begin with common ground. A platform prioritizing shared interests, transparent compatibility, and psychological safety over swiping games.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowPresentationModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Project Presentation Guide</span>
              </button>

              <button
                onClick={() => setActiveTab('safety')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
              >
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Privacy & Safety Center</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-stone-500 text-[11px]">
            <p>
              Academic Prototype Demonstration • Developed for Human-Centered Design & Ethical Computing Showcase.
            </p>
            <p>
              Deterministic 40/30/20/10 compatibility model • Fictional identities for demonstration purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
