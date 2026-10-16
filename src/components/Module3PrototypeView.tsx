import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { OnboardingView } from './OnboardingView';
import { DiscoveryView } from './DiscoveryView';
import { IntroductionsView } from './IntroductionsView';
import { ConnectionsChatView } from './ConnectionsChatView';
import { SafetyCenterView } from './SafetyCenterView';
import { ClearSignalsView } from './clearsignals/ClearSignalsView';
import { OpenSignalsView } from './opensignals/OpenSignalsView';
import { Module3Overview } from './module3/Module3Overview';
import { ProtectedRoute } from './auth/ProtectedRoute';

interface Module3PrototypeViewProps {
  directTab?: ActiveTab;
}

export const Module3PrototypeView: React.FC<Module3PrototypeViewProps> = ({ directTab }) => {
  const { activeTab, setActiveTab } = useApp();

  useEffect(() => {
    if (directTab && directTab !== activeTab) {
      setActiveTab(directTab);
    }
  }, [directTab, activeTab, setActiveTab]);

  return (
    <div className="w-full">
      {/* Public Architectural Overview */}
      {(activeTab === 'overview' || activeTab === 'landing') && (
        <Module3Overview onNavigateTab={setActiveTab} />
      )}

      {/* Protected Features: Require Authenticated Session + Complete Profile */}
      {activeTab === 'discovery' && (
        <ProtectedRoute requireCompleteProfile={true}>
          <DiscoveryView />
        </ProtectedRoute>
      )}

      {activeTab === 'requests' && (
        <ProtectedRoute requireCompleteProfile={true}>
          <IntroductionsView />
        </ProtectedRoute>
      )}

      {activeTab === 'chat' && (
        <ProtectedRoute requireCompleteProfile={true}>
          <ConnectionsChatView />
        </ProtectedRoute>
      )}

      {activeTab === 'clearsignals' && (
        <ProtectedRoute requireCompleteProfile={true}>
          <ClearSignalsView />
        </ProtectedRoute>
      )}

      {activeTab === 'opensignals' && (
        <ProtectedRoute requireCompleteProfile={true}>
          <OpenSignalsView />
        </ProtectedRoute>
      )}

      {/* Profile Onboarding View */}
      {activeTab === 'onboarding' && (
        <ProtectedRoute requireCompleteProfile={false}>
          <OnboardingView />
        </ProtectedRoute>
      )}

      {/* Safety Center View */}
      {activeTab === 'safety' && (
        <ProtectedRoute requireCompleteProfile={false}>
          <SafetyCenterView />
        </ProtectedRoute>
      )}
    </div>
  );
};
