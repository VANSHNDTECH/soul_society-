import React from 'react';
import { Module2Tab } from '../../types/module2';
import {
  Users,
  Compass,
  AlertTriangle,
  Lightbulb,
  FileQuestion,
  Sparkles,
  ArrowRight,
  Layers,
  Search,
  BookOpen,
} from 'lucide-react';

interface Module2NavbarProps {
  activeTab: Module2Tab;
  setActiveTab: (tab: Module2Tab) => void;
  onSwitchToModule1: () => void;
  onSwitchToModule3: () => void;
}

export const Module2Navbar: React.FC<Module2NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSwitchToModule1,
  onSwitchToModule3,
}) => {
  const tabs: { id: Module2Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'personas', label: 'User Personas', icon: <Users className="w-4 h-4" />, badge: '3' },
    { id: 'barriers', label: 'Connection Barriers', icon: <AlertTriangle className="w-4 h-4" />, badge: '5' },
    { id: 'solutions', label: 'Current Solutions', icon: <Layers className="w-4 h-4" />, badge: '6' },
    { id: 'opportunities', label: 'Design Opportunities', icon: <Lightbulb className="w-4 h-4" />, badge: '7' },
    { id: 'methodology', label: 'Methodology & Guide', icon: <FileQuestion className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Module Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-900 via-stone-900 to-teal-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-stone-900 flex items-center gap-2">
                  CommonGround
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md border border-purple-200">
                    Module 2: The People Left Out
                  </span>
                </span>
                <span className="text-[11px] text-stone-500 hidden sm:block">
                  Human-Centered Personas, Barriers & Unmet Needs
                </span>
              </div>
            </button>
          </div>

          {/* Suite Navigation Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToModule1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-2xs"
              title="Return to Module 1: The Problem Detective"
            >
              <Search className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Module 1 Research</span>
            </button>

            <button
              onClick={onSwitchToModule3}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-2xs group"
              title="Launch Module 3: Solution Prototype"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span className="hidden sm:inline">Module 3 Prototype</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-200 scrollbar-none">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                      isActive ? 'bg-purple-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
