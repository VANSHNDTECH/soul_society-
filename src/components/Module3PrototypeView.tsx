import React from 'react';
import { useApp } from '../context/AppContext';
import { LandingPage } from './LandingPage';
import { OnboardingView } from './OnboardingView';
import { DiscoveryView } from './DiscoveryView';
import { IntroductionsView } from './IntroductionsView';
import { ConnectionsChatView } from './ConnectionsChatView';
import { SafetyCenterView } from './SafetyCenterView';

export const Module3PrototypeView: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="w-full">
      {activeTab === 'landing' && <LandingPage />}
      {activeTab === 'onboarding' && <OnboardingView />}
      {activeTab === 'discovery' && <DiscoveryView />}
      {activeTab === 'requests' && <IntroductionsView />}
      {activeTab === 'chat' && <ConnectionsChatView />}
      {activeTab === 'safety' && <SafetyCenterView />}
    </div>
  );
};
