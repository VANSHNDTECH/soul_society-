import React from 'react';
import { useApp } from '../context/AppContext';
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
  Sliders,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  onSwitchToResearch?: () => void;
  onSwitchToModule1?: () => void;
  onSwitchToModule2?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSwitchToResearch,
  onSwitchToModule1,
  onSwitchToModule2,
}) => {
  const {
    activeTab,
    setActiveTab,
    introductions,
    connections,
    currentUser,
    setShowPresentationModal,
    resetDemoData,
  } = useApp();


  // Pending incoming introductions for current user
  const pendingIncomingCount = introductions.filter(
    i => i.toUserId === currentUser.id && i.status === 'pending'
  ).length;

  const activeConnectionsCount = connections.filter(
    c => c.status === 'active' && c.userIds.includes(currentUser.id)
  ).length;

  const isDiscoveryPaused = currentUser.privacySettings.discoveryPaused;

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'discovery',
      label: 'Discover',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'requests',
      label: 'Introductions',
      icon: <Inbox className="w-4 h-4" />,
      badge: pendingIncomingCount,
    },
    {
      id: 'chat',
      label: 'Connections',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: activeConnectionsCount,
    },
    {
      id: 'clearsignals',
      label: 'ClearSignals',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'opensignals',
      label: 'OpenSignals',
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: 'safety',
      label: 'Safety & Privacy',
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              title="CommonGround Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 via-teal-700 to-stone-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl tracking-tight text-stone-900 flex items-center gap-1.5">
                  CommonGround
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-md">
                    Consent-First
                  </span>
                </span>
                <span className="text-xs text-stone-500 hidden sm:block">
                  Better connections through shared purpose
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {Boolean(link.badge && link.badge > 0) && (
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none rounded-full ${
                        isActive
                          ? 'bg-teal-400 text-stone-950'
                          : 'bg-teal-600 text-white'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Module Switchers, Presentation, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {(onSwitchToModule1 || onSwitchToResearch) && (
              <button
                onClick={onSwitchToModule1 || onSwitchToResearch}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-teal-300 border border-stone-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
                title="Switch to Module 1: The Problem Detective Research Dashboard"
              >
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Module 1</span>
              </button>
            )}

            {onSwitchToModule2 && (
              <button
                onClick={onSwitchToModule2}
                className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
                title="Switch to Module 2: The People Left Out (Personas & Barriers)"
              >
                <Users className="w-3.5 h-3.5 text-purple-700" />
                <span className="hidden sm:inline">Module 2 Personas</span>
              </button>
            )}

            {/* Discovery Paused Pill */}
            {isDiscoveryPaused && (

              <button
                onClick={() => setActiveTab('safety')}
                className="hidden lg:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                title="Your discovery is paused. Click to adjust."
              >
                <PauseCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="font-medium">Discovery Paused</span>
              </button>
            )}

            {/* Academic Presentation Mode Button */}
            <button
              onClick={() => setShowPresentationModal(true)}
              className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              title="View Academic Project Rationale & Design Decisions"
            >
              <GraduationCap className="w-4 h-4 text-purple-700" />
              <span className="hidden sm:inline">Project Defense</span>
            </button>

            {/* Profile Avatar / Trigger Onboarding */}
            <button
              onClick={() => setActiveTab('onboarding')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-stone-200 hover:border-stone-300 bg-white shadow-2xs transition-all"
              title="Edit Profile & Preferences"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500/30"
              />
              <span className="text-xs font-medium text-stone-800 hidden sm:inline max-w-[80px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {/* Reset Demo Data button */}
            <button
              onClick={resetDemoData}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              title="Reset Demo Data to Initial Seed"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium rounded-md ${
                  isActive ? 'text-teal-800 font-semibold' : 'text-stone-500'
                }`}
              >
                <div className="relative">
                  {link.icon}
                  {Boolean(link.badge && link.badge > 0) && (
                    <span className="absolute -top-1 -right-2 bg-teal-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                      {link.badge}
                    </span>
                  )}
                </div>
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
