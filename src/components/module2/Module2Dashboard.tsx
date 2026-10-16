import React, { useState } from 'react';
import { Module2Tab } from '../../types/module2';
import { Module2Navbar } from './Module2Navbar';
import { Module2Overview } from './Module2Overview';
import { PersonaExplorer } from './PersonaExplorer';
import { BarriersSection } from './BarriersSection';
import { CurrentSolutionsSection } from './CurrentSolutionsSection';
import { DesignOpportunitiesSection } from './DesignOpportunitiesSection';
import { MethodologySection } from './MethodologySection';
import {
  Users,
  Search,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';

interface Module2DashboardProps {
  activeTab?: Module2Tab;
  setActiveTab?: (tab: Module2Tab) => void;
  selectedPersonaId?: string;
  setSelectedPersonaId?: (id: string) => void;
  onSwitchToModule1?: () => void;
  onSwitchToModule3?: () => void;
  standalone?: boolean;
}

export const Module2Dashboard: React.FC<Module2DashboardProps> = ({
  activeTab: externalTab,
  setActiveTab: externalSetTab,
  selectedPersonaId: externalPersonaId,
  setSelectedPersonaId: externalSetPersonaId,
  onSwitchToModule1,
  onSwitchToModule3,
  standalone = false,
}) => {
  const [internalTab, setInternalTab] = useState<Module2Tab>('overview');
  const [internalPersonaId, setInternalPersonaId] = useState<string>('persona-aanya');

  const activeTab = externalTab ?? internalTab;
  const setActiveTab = externalSetTab ?? setInternalTab;
  const selectedPersonaId = externalPersonaId ?? internalPersonaId;
  const setSelectedPersonaId = externalSetPersonaId ?? setInternalPersonaId;

  const content = (
    <div className="w-full">
      {activeTab === 'overview' && (
        <Module2Overview
          onNavigateTab={setActiveTab}
          onSelectPersona={(id) => {
            setSelectedPersonaId(id);
            setActiveTab('personas');
          }}
        />
      )}

      {activeTab === 'personas' && (
        <PersonaExplorer
          selectedPersonaId={selectedPersonaId}
          onSelectPersona={setSelectedPersonaId}
        />
      )}

      {activeTab === 'barriers' && <BarriersSection />}

      {activeTab === 'solutions' && <CurrentSolutionsSection />}

      {activeTab === 'opportunities' && (
        <DesignOpportunitiesSection
          onSwitchToModule3={onSwitchToModule3 || (() => {})}
        />
      )}

      {activeTab === 'methodology' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
          <MethodologySection />
        </div>
      )}
    </div>
  );

  if (!standalone) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Module 2 Navigation Header */}
      <Module2Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSwitchToModule1={onSwitchToModule1 || (() => {})}
        onSwitchToModule3={onSwitchToModule3 || (() => {})}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {content}
      </main>

      {/* Module 2 Research Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
            {/* Col 1: Project Identity */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-heading font-bold text-lg text-white">CommonGround</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Module 2: "The People Left Out" — Investigating the human barriers to meaningful connection
                and crafting evidence-informed personas to guide product architecture.
              </p>
              <div className="text-[11px] font-mono text-purple-400">
                Academic HCD Research & Presentation Suite
              </div>
            </div>

            {/* Col 2: Persona Archetypes */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Personas (Hypotheses)
              </h5>
              <ul className="space-y-1.5 text-xs text-stone-300">
                <li>
                  <button
                    onClick={() => {
                      setSelectedPersonaId('persona-aanya');
                      setActiveTab('personas');
                    }}
                    className="hover:text-purple-300 transition-colors text-left"
                  >
                    • Aanya Sharma (19, Socially Anxious Student)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedPersonaId('persona-rohan');
                      setActiveTab('personas');
                    }}
                    className="hover:text-purple-300 transition-colors text-left"
                  >
                    • Rohan Mehta (23, Relocated Newcomer)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedPersonaId('persona-meera');
                      setActiveTab('personas');
                    }}
                    className="hover:text-purple-300 transition-colors text-left"
                  >
                    • Meera Iyer (25, Niche Interests & Accessibility)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Research Sections */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Module 2 Sections
              </h5>
              <ul className="space-y-1.5 text-xs text-stone-300">
                <li>
                  <button
                    onClick={() => setActiveTab('barriers')}
                    className="hover:text-purple-300 transition-colors"
                  >
                    5 Barrier Categories (15 Obstacles)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('solutions')}
                    className="hover:text-purple-300 transition-colors"
                  >
                    6 Meeting Methods Compared
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="hover:text-purple-300 transition-colors"
                  >
                    From Human Needs to Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('methodology')}
                    className="hover:text-purple-300 transition-colors"
                  >
                    Research Methodology & Validation Guide
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Cross-Module Switcher */}
            <div className="space-y-3 bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                Cross-Module Workflow
              </h5>
              <p className="text-[11px] text-stone-400">
                Explore the complete research and prototyping sequence:
              </p>
              <div className="space-y-2">
                {onSwitchToModule1 && (
                  <button
                    onClick={onSwitchToModule1}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-700/70 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-teal-400" />
                      Module 1: The Problem Detective
                    </span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </button>
                )}
                {onSwitchToModule3 && (
                  <button
                    onClick={onSwitchToModule3}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white text-xs font-medium transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      Module 3: CommonGround Prototype
                    </span>
                    <ArrowRight className="w-3 h-3 text-teal-300" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Epistemic Academic Disclaimer Notice */}
          <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-stone-500">
            <div className="flex items-start gap-2 max-w-3xl">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Academic Epistemic Disclaimer:</strong> The personas (Aanya Sharma, Rohan Mehta, Meera Iyer)
                presented in Module 2 are provisional research hypotheses and illustrative archetypes synthesized
                from secondary literature and pilot qualitative inquiry. They are designed to guide user-centered
                ideation and must be validated through formal fieldwork before being treated as empirical certainties.
              </span>
            </div>
            <div className="text-right shrink-0">
              <span>CommonGround Initiative • Module 2</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
