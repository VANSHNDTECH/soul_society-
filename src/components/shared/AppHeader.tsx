import React, { useState } from 'react';
import { AppModuleId, ModuleNavigation } from './ModuleNavigation';
import { ResearchTab } from '../../types/research';
import { Module2Tab } from '../../types/module2';
import { ActiveTab } from '../../types';
import { useApp } from '../../context/AppContext';
import { AuthModal } from '../auth/AuthModal';
import { ThemeToggle } from './ThemeToggle';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Compass,
  Inbox,
  MessageCircle,
  Shield,
  GraduationCap,
  PauseCircle,
  RotateCcw,
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
  Sparkles,
  Sliders,
  LogIn,
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
  const {
    activeTab: module3Tab,
    setActiveTab: setModule3Tab,
    introductions,
    connections,
    currentUser,
    resetDemoData,
    setShowPresentationModal,
    authSession,
    authModalOpen,
    setAuthModalOpen,
    authModalPrompt,
    openAuthModal,
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

  // Module 3 tabs (Unified structure matching Module 1 & 2)
  const module3Tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'discovery', label: 'Discover', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'requests', label: 'Introductions', icon: <Inbox className="w-3.5 h-3.5" />, badge: pendingIncomingCount },
    { id: 'chat', label: 'Connections', icon: <MessageCircle className="w-3.5 h-3.5" />, badge: activeConnectionsCount },
    { id: 'clearsignals', label: 'ClearSignals', icon: <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> },
    { id: 'opensignals', label: 'OpenSignals', icon: <Sliders className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" /> },
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
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#12100e]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800 shadow-2xs transition-colors duration-200">
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
                  <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-stone-100">
                    CommonGround
                  </span>
                  <span className="hidden lg:inline text-[9px] uppercase font-bold tracking-widest bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded">
                    University Suite
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:block font-medium">
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
            {/* Global Light/Dark/System Theme Toggle */}
            <ThemeToggle showDropdown />

            {/* Global Academic Project Defense Modal Button */}
            <button
              onClick={handlePresentationClick}
              className="flex items-center gap-1.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200/90 dark:border-stone-700 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
              title="Open Academic Project Defense & Research Rationale"
            >
              <GraduationCap className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              <span className="hidden xl:inline">Project Defense</span>
            </button>

            {/* Database status pill */}
            <button
              onClick={() => openAuthModal()}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isSupabaseConfigured()
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
              title={isSupabaseConfigured() ? 'Supabase PostgreSQL Database Connected' : 'Running in Local Demonstration Mode - Click to Manage Session'}
            >
              <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden md:inline">{isSupabaseConfigured() ? 'Live Database' : 'Demo Mode'}</span>
            </button>

            {/* User Account / Profile Button */}
            <button
              onClick={() => openAuthModal()}
              className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border shadow-2xs transition-all ${
                authSession.isAuthenticated
                  ? 'border-stone-200/90 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-teal-400 dark:hover:border-teal-500'
                  : 'border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-300'
              }`}
              title={authSession.isAuthenticated ? `Signed in as ${authSession.profile?.display_name || currentUser.name}` : 'Visitor Mode — Click to Sign In'}
            >
              {authSession.isAuthenticated ? (
                <img
                  src={authSession.profile?.avatar_url || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt="User"
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-teal-500/30"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900/80 flex items-center justify-center text-amber-800 dark:text-amber-200">
                  <LogIn className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-xs font-medium text-stone-800 dark:text-stone-200 hidden sm:inline max-w-[85px] truncate">
                {authSession.isAuthenticated
                  ? (authSession.profile?.display_name || currentUser?.name?.split(' ')[0])
                  : 'Sign In'}
              </span>
              {!authSession.isAuthenticated && (
                <span className="hidden lg:inline text-[9px] uppercase font-bold tracking-wide bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-1 rounded">
                  Guest
                </span>
              )}
            </button>

            {/* When on Module 3: Reset Demo Data */}
            {activeModule === 'module-3' && (
              <button
                onClick={resetDemoData}
                className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Reset Prototype Demo Data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu for Global Modules */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200/80 dark:border-stone-800 space-y-2">
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
      <div className="border-t border-stone-200/80 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 overflow-x-auto scrollbar-none gap-2">
            {/* Module 1 Sub-Tabs */}
            {activeModule === 'module-1' && setModule1Tab && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 px-2 py-0.5 bg-teal-50 dark:bg-teal-950/50 rounded border border-teal-200/80 dark:border-teal-800 mr-1 hidden sm:inline">
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
                          ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/80 dark:hover:bg-stone-800/80'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                            isActive ? 'bg-teal-400 dark:bg-teal-500 text-stone-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 px-2 py-0.5 bg-purple-50 dark:bg-purple-950/50 rounded border border-purple-200/80 dark:border-purple-800 mr-1 hidden sm:inline">
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
                          ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/80 dark:hover:bg-stone-800/80'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                            isActive ? 'bg-purple-300 text-purple-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 rounded border border-blue-200/80 dark:border-blue-800 mr-1 hidden sm:inline">
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
                            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/80 dark:hover:bg-stone-800/80'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {typeof tab.badge === 'number' && tab.badge > 0 && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                              isActive ? 'bg-blue-400 text-stone-950' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
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
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-full text-[11px] font-semibold hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors shrink-0"
                    title="Discovery paused. Click to adjust in Safety Center."
                  >
                    <PauseCircle className="w-3 h-3 text-amber-700 dark:text-amber-400 animate-pulse" />
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
        promptMessage={authModalPrompt}
      />
    </header>
  );
};
