import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/shared/AppLayout';
import { AppModuleId } from './components/shared/ModuleNavigation';
import { ResearchDashboard } from './components/research/ResearchDashboard';
import { Module2Dashboard } from './components/module2/Module2Dashboard';
import { Module3PrototypeView } from './components/Module3PrototypeView';
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
    if (path.includes('module-3') || hash.includes('module-3')) return 'module-3';
    if (path.includes('module-1') || hash.includes('module-1')) return 'module-1';
    return 'module-1';
  };

  const activeModule = getActiveModule();

  // Scoped sub-tab state for each module
  const [module1Tab, setModule1Tab] = useState<ResearchTab>('overview');
  const [module2Tab, setModule2Tab] = useState<Module2Tab>('overview');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('persona-aanya');

  // Update dynamic document title based on active module
  useEffect(() => {
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
  }, [activeModule]);

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
        <Route path="/module-3" element={<Module3PrototypeView />} />
        <Route path="*" element={<Navigate to="/module-1" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
