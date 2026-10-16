import React from 'react';
import { ResearchTab } from '../../types/research';
import {
  Search,
  BookOpen,
  Scale,
  Compass,
  Layers,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle,
} from 'lucide-react';

interface ResearchNavbarProps {
  activeTab: ResearchTab;
  setActiveTab: (tab: ResearchTab) => void;
  onSwitchToPrototype: () => void;
}

export const ResearchNavbar: React.FC<ResearchNavbarProps> = ({
  activeTab,
  setActiveTab,
  onSwitchToPrototype,
}) => {
  const tabs: { id: ResearchTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Search className="w-4 h-4" /> },
    { id: 'problems', label: 'Top 5 Problems', icon: <BookOpen className="w-4 h-4" />, badge: '5' },
    { id: 'methods', label: 'Meeting Methods', icon: <Compass className="w-4 h-4" />, badge: '4' },
    { id: 'prioritization', label: 'Prioritization', icon: <Scale className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence Library', icon: <ShieldCheck className="w-4 h-4" />, badge: '9' },
    { id: 'bridge', label: 'To Solutions', icon: <Layers className="w-4 h-4" /> },
    { id: 'gaps', label: 'Research Gaps', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'references', label: 'References', icon: <BookOpen className="w-4 h-4" /> },
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-900 to-teal-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Search className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-stone-900 flex items-center gap-2">
                  CommonGround
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md border border-teal-200">
                    Module 1: The Problem Detective
                  </span>
                </span>
                <span className="text-[11px] text-stone-500 hidden sm:block">
                  Investigative UX Research & Empirical Problem Analysis
                </span>
              </div>
            </button>
          </div>

          {/* Right Action: Switch to Module 3 Solution Prototype */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToPrototype}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all group"
              title="Launch Module 3: CommonGround Interactive App Prototype"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Launch Module 3 Prototype</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
      </div>
    </header>
  );
};
