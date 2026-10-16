import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/shared/AppLayout';
import { AppModuleId } from './components/shared/ModuleNavigation';
import { ResearchDashboard } from './components/research/ResearchDashboard';
import { Module2Dashboard } from './components/module2/Module2Dashboard';
import { Module3PrototypeView } from './components/Module3PrototypeView';
import { SignInPage } from './components/auth/SignInPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { ProfileSetupPage } from './components/auth/ProfileSetupPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ResearchTab } from './types/research';
import { Module2Tab } from './types/module2';

const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active module based on pathname or hash
  const getActiveModule = (): AppModuleId => {
    const path = location.pathname.toLowerCase();
    const hash = location.hash.toLowerCase();
    if (path.includes('module-2') || hash.includes('module-2')) return 'module-2';
    if (
      path.includes('module-3') ||
      hash.includes('module-3') ||
      path.includes('discovery') ||
      path.includes('chat') ||
      path.includes('connections') ||
      path.includes('requests') ||
      path.includes('clearsignals') ||
      path.includes('opensignals') ||
      path.includes('safety') ||
      path.includes('profile-setup')
    ) {
      return 'module-3';
    }
    if (path.includes('module-1') || hash.includes('module-1')) return 'module-1';
    return 'module-1';
  };

  const activeModule = getActiveModule();

  // Scoped sub-tab state for each module
  const [module1Tab, setModule1Tab] = useState<ResearchTab>('overview');
  const [module2Tab, setModule2Tab] = useState<Module2Tab>('overview');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('persona-aanya');

  // Update dynamic document title based on location
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('signin')) {
      document.title = 'CommonGround — Sign In';
    } else if (path.includes('signup')) {
      document.title = 'CommonGround — Create Account';
    } else if (path.includes('reset-password')) {
      document.title = 'CommonGround — Reset Password';
    } else if (path.includes('profile-setup')) {
      document.title = 'CommonGround — Profile Setup';
    } else if (path.includes('discovery')) {
      document.title = 'CommonGround — Discover Peers';
    } else if (path.includes('chat') || path.includes('connections')) {
      document.title = 'CommonGround — Active Connections';
    } else if (path.includes('clearsignals')) {
      document.title = 'CommonGround — ClearSignals Assistant';
    } else if (path.includes('opensignals')) {
      document.title = 'CommonGround — OpenSignals Transparency';
    } else {
      switch (activeModule) {
        case 'module-1':
          document.title = 'CommonGround — Module 1: The Problem Detective (Research & Evidence)';
          break;
        case 'module-2':
          document.title = 'CommonGround — Module 2: The People Left Out (Personas & Barriers)';
          break;
        case 'module-3':
          document.title = 'CommonGround — Module 3: The Solution Architect (Prototype & Solution)';
          break;
        default:
          document.title = 'CommonGround — University Research Suite & Prototype';
          break;
      }
    }
  }, [activeModule, location.pathname]);

  const handleSelectModule = (id: AppModuleId) => {
    navigate(`/${id}`);
  };

  return (
    <AppLayout
      activeModule={activeModule}
      onSelectModule={handleSelectModule}
      module1Tab={module1Tab}
      setModule1Tab={setModule1Tab}
      module2Tab={module2Tab}
      setModule2Tab={setModule2Tab}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/module-1" replace />} />

        {/* Public Module 1 & 2 Academic Research */}
        <Route
          path="/module-1"
          element={
            <ResearchDashboard
              activeTab={module1Tab}
              setActiveTab={setModule1Tab}
              onSwitchToPrototype={() => handleSelectModule('module-3')}
              onSwitchToModule2={() => handleSelectModule('module-2')}
              standalone={false}
            />
          }
        />
        <Route
          path="/module-2"
          element={
            <Module2Dashboard
              activeTab={module2Tab}
              setActiveTab={setModule2Tab}
              selectedPersonaId={selectedPersonaId}
              setSelectedPersonaId={setSelectedPersonaId}
              onSwitchToModule1={() => handleSelectModule('module-1')}
              onSwitchToModule3={() => handleSelectModule('module-3')}
              standalone={false}
            />
          }
        />

        {/* Dedicated Authentication Entry Points */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Required Profile Setup Flow */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute requireCompleteProfile={false}>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireCompleteProfile={false}>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />

        {/* Module 3 Hub */}
        <Route path="/module-3" element={<Module3PrototypeView />} />

        {/* Direct URL Protection for Protected Features */}
        <Route
          path="/discovery"
          element={
            <ProtectedRoute requireCompleteProfile={true}>
              <Module3PrototypeView directTab="discovery" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute requireCompleteProfile={true}>
              <Module3PrototypeView directTab="requests" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/introductions"
          element={
            <ProtectedRoute requireCompleteProfile={true}>
              <Module3PrototypeView directTab="requests" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute requireCompleteProfile={true}>
              <Module3PrototypeView directTab="chat" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connections"
          element={
            <ProtectedRoute requireCompleteProfile={true}>
              <Module3PrototypeView directTab="chat" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clearsignals"
          element={
            <ProtectedRoute requireCompleteProfile={true}>
              <Module3PrototypeView directTab="clearsignals" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opensignals"
          element={
            <ProtectedRoute requireCompleteProfile={true}>
              <Module3PrototypeView directTab="opensignals" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety"
          element={
            <ProtectedRoute requireCompleteProfile={false}>
              <Module3PrototypeView directTab="safety" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/module-1" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
