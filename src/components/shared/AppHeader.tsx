import React, { useState, useEffect } from 'react';
import { AppModuleId, ModuleNavigation } from './ModuleNavigation';
import { ResearchTab } from '../../types/research';
import { Module2Tab } from '../../types/module2';
import { ActiveTab } from '../../types';
import { useApp } from '../../context/AppContext';
import { AuthModal } from '../auth/AuthModal';
import { authService, AuthSession } from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Compass,
  Inbox,
  MessageCircle,
  Shield,
  GraduationCap,
  PauseCircle,
  RotateCcw,
  Sparkles,
  Users,
  Search,
  BookOpen,
  Scale,
  Layers,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileQuestion,
  Menu,
  X,
} from 'lucide-react';

interface AppHeaderProps {
  activeModule: AppModuleId;
  onSelectModule: (moduleId: AppModuleId) => void;
  // Module 1 sub-nav
  module1Tab?: ResearchTab;
  setModule1Tab?: (tab: ResearchTab) => void;
  // Module 2 sub-nav
  module2Tab?: Module2Tab;
  setModule2Tab?: (tab: Module2Tab) => void;
  // Global presentation
  onOpenPresentation?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeModule,
  onSelectModule,
  module1Tab = 'overview',
  setModule1Tab,
  module2Tab = 'overview',
  setModule2Tab,
  onOpenPresentation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authSession, setAuthSession] = useState<AuthSession>({
    user: null,
    profile: null,
    isAuthenticated: false,
    isBackendConnected: isSupabaseConfigured(),
  });

  useEffect(() => {
    authService.getSession().then((session) => {
      setAuthSession(session);
    });
    const unsubscribe = authService.onAuthStateChange((session) => {
      setAuthSession(session);
    });
    return () => unsubscribe();
  }, []);
  const {
    activeTab: module3Tab,
    setActiveTab: setModule3Tab,
    introductions,
    connections,
    currentUser,
    resetDemoData,
    setShowPresentationModal,
  } = useApp();

  const pendingIncomingCount = introductions.filter(
    (i) => i.toUserId === currentUser?.id && i.status === 'pending'
  ).length;

  const activeConnectionsCount = connections.filter(
    (c) => c.status === 'active' && c.userIds.includes(currentUser?.id || '')
  ).length;

  const isDiscoveryPaused = currentUser?.privacySettings?.discoveryPaused;

  // Module 1 tabs
  const module1Tabs: { id: ResearchTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'problems', label: 'Top 5 Problems', icon: <BookOpen className="w-3.5 h-3.5" />, badge: '5' },
    { id: 'methods', label: 'Meeting Methods', icon: <Compass className="w-3.5 h-3.5" />, badge: '4' },
    { id: 'prioritization', label: 'Prioritization', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'evidence', label: 'Evidence Library', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: '9' },
    { id: 'bridge', label: 'To Solutions', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'gaps', label: 'Research Gaps', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'references', label: 'References', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  // Module 2 tabs
  const module2Tabs: { id: Module2Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'personas', label: 'User Personas', icon: <Users className="w-3.5 h-3.5" />, badge: '3' },
    { id: 'barriers', label: 'Connection Barriers', icon: <AlertTriangle className="w-3.5 h-3.5" />, badge: '5' },
    { id: 'solutions', label: 'Current Solutions', icon: <Layers className="w-3.5 h-3.5" />, badge: '6' },
    { id: 'opportunities', label: 'Design Opportunities', icon: <Lightbulb className="w-3.5 h-3.5" />, badge: '7' },
    { id: 'methodology', label: 'Methodology & Guide', icon: <FileQuestion className="w-3.5 h-3.5" /> },
  ];

  // Module 3 tabs
  const module3Tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'discovery', label: 'Discover', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'requests', label: 'Introductions', icon: <Inbox className="w-3.5 h-3.5" />, badge: pendingIncomingCount },
    { id: 'chat', label: 'Connections', icon: <MessageCircle className="w-3.5 h-3.5" />, badge: activeConnectionsCount },
    { id: 'safety', label: 'Safety Center', icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  const handlePresentationClick = () => {
    if (onOpenPresentation) {
      onOpenPresentation();
    } else {
      setShowPresentationModal(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
      {/* Tier 1: Unified Brand + Global Module Navigation + Primary Utilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectModule('module-1')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              title="CommonGround Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-900 via-stone-900 to-purple-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-heading font-black text-sm tracking-tighter text-teal-300">CG</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-stone-900">
                    CommonGround
                  </span>
                  <span className="hidden lg:inline text-[9px] uppercase font-bold tracking-widest bg-stone-200/80 text-stone-700 px-1.5 py-0.5 rounded">
                    University Suite
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 hidden sm:block font-medium">
                  Human-Centered Connection Project
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Global Module Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-3xl">
            <ModuleNavigation
              activeModule={activeModule}
              onSelectModule={onSelectModule}
            />
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Academic Project Defense Modal Button */}
            <button
              onClick={handlePresentationClick}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
              title="Open Academic Project Defense & Research Rationale"
            >
              <GraduationCap className="w-4 h-4 text-purple-700" />
              <span className="hidden xl:inline">Project Defense</span>
            </button>

            {/* Database status pill */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isSupabaseConfigured()
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              }`}
              title={isSupabaseConfigured() ? 'Supabase Database Connected' : 'Running in Local Demonstration Mode - Click for details'}
            >
              <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden md:inline">{isSupabaseConfigured() ? 'Live Database' : 'Demo Mode'}</span>
            </button>

            {/* User Account / Profile Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border border-stone-200/90 bg-white hover:border-stone-300 shadow-2xs transition-all"
              title="User Account & Role Controls"
            >
              <img
                src={authSession.profile?.avatar_url || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt="User"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-teal-500/30"
              />
              <span className="text-xs font-medium text-stone-800 hidden sm:inline max-w-[80px] truncate">
                {authSession.profile?.display_name || currentUser?.name?.split(' ')[0] || 'Sign In'}
              </span>
            </button>

            {/* When on Module 3: Reset Demo Data */}
            {activeModule === 'module-3' && (
              <button
                onClick={resetDemoData}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                title="Reset Prototype Demo Data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu for Global Modules */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-2">
              Select Module:
            </span>
            <div className="flex flex-col gap-1.5">
              <ModuleNavigation
                activeModule={activeModule}
                onSelectModule={(id) => {
                  onSelectModule(id);
                  setMobileMenuOpen(false);
                }}
                className="flex-col items-stretch w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tier 2: Scoped Sub-Navigation Strip (Visual Continuity Across Modules) */}
      <div className="border-t border-stone-200/80 bg-stone-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 overflow-x-auto scrollbar-none gap-2">
            {/* Module 1 Sub-Tabs */}
            {activeModule === 'module-1' && setModule1Tab && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 px-2 py-0.5 bg-teal-50 rounded border border-teal-200/80 mr-1 hidden sm:inline">
                  Module 1 Sections:
                </span>
                {module1Tabs.map((tab) => {
                  const isActive = module1Tab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setModule1Tab(tab.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                        isActive
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                            isActive ? 'bg-teal-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Module 2 Sub-Tabs */}
            {activeModule === 'module-2' && setModule2Tab && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 px-2 py-0.5 bg-purple-50 rounded border border-purple-200/80 mr-1 hidden sm:inline">
                  Module 2 Sections:
                </span>
                {module2Tabs.map((tab) => {
                  const isActive = module2Tab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setModule2Tab(tab.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                        isActive
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                            isActive ? 'bg-purple-300 text-purple-950' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Module 3 Sub-Tabs */}
            {activeModule === 'module-3' && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 px-2 py-0.5 bg-blue-50 rounded border border-blue-200/80 mr-1 hidden sm:inline">
                    Prototype Views:
                  </span>
                  {module3Tabs.map((tab) => {
                    const isActive = module3Tab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setModule3Tab(tab.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                          isActive
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {typeof tab.badge === 'number' && tab.badge > 0 && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                              isActive ? 'bg-blue-400 text-stone-950' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Discovery Paused Warning Pill */}
                {isDiscoveryPaused && (
                  <button
                    onClick={() => setModule3Tab('safety')}
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[11px] font-semibold hover:bg-amber-200 transition-colors shrink-0"
                    title="Discovery paused. Click to adjust in Safety Center."
                  >
                    <PauseCircle className="w-3 h-3 text-amber-700 animate-pulse" />
                    <span>Discovery Paused</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        session={authSession}
        onSessionUpdated={(newSession) => {
          setAuthSession(newSession);
        }}
      />
    </header>
  );
};
