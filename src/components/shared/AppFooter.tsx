import React from 'react';
import { AppModuleId } from './ModuleNavigation';
import { ResearchTab } from '../../types/research';
import { Module2Tab } from '../../types/module2';
import { ActiveTab } from '../../types';
import {
  Compass,
  Search,
  Users,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AppFooterProps {
  activeModule: AppModuleId;
  onSelectModule: (moduleId: AppModuleId) => void;
  onSelectModule1Tab?: (tab: ResearchTab) => void;
  onSelectModule2Tab?: (tab: Module2Tab) => void;
  onSelectModule3Tab?: (tab: ActiveTab) => void;
  onOpenPresentation?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  activeModule,
  onSelectModule,
  onSelectModule1Tab,
  onSelectModule2Tab,
  onSelectModule3Tab,
  onOpenPresentation,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800 text-left text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Grid: Brand & Module Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
          {/* Column 1: Brand & Project Vision */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                CG
              </div>
              <span className="font-heading font-extrabold text-base text-white tracking-tight">
                CommonGround
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              An integrated, three-phase university project investigating modern interpersonal disconnection
              and designing an evidence-backed, consent-first connection platform.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenPresentation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors border border-stone-700"
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>Open Project Defense Modal</span>
              </button>
            </div>
          </div>

          {/* Column 2: Module 1 Links */}
          <div className="space-y-2">
            <button
              onClick={() => onSelectModule('module-1')}
              className={`font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-left hover:text-teal-300 transition-colors ${
                activeModule === 'module-1' ? 'text-teal-400' : 'text-stone-300'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span>Module 1: The Problem Detective</span>
            </button>
            <p className="text-[11px] text-stone-500">Empirical Research & Evidence</p>
            <ul className="space-y-1.5 text-xs text-stone-400 pt-1">
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-1');
                    onSelectModule1Tab?.('problems');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Top 5 Problems Diagnosed
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-1');
                    onSelectModule1Tab?.('methods');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Meeting Methods Compared
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-1');
                    onSelectModule1Tab?.('evidence');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • 9 Peer-Reviewed Evidence Sources
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-1');
                    onSelectModule1Tab?.('gaps');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Research Gaps & Field Protocols
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Module 2 Links */}
          <div className="space-y-2">
            <button
              onClick={() => onSelectModule('module-2')}
              className={`font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-left hover:text-purple-300 transition-colors ${
                activeModule === 'module-2' ? 'text-purple-400' : 'text-stone-300'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Module 2: The People Left Out</span>
            </button>
            <p className="text-[11px] text-stone-500">Personas & Invisible Barriers</p>
            <ul className="space-y-1.5 text-xs text-stone-400 pt-1">
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-2');
                    onSelectModule2Tab?.('personas');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • 3 Personas (Aanya, Rohan, Meera)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-2');
                    onSelectModule2Tab?.('barriers');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • 5 Barrier Categories (15 Obstacles)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-2');
                    onSelectModule2Tab?.('opportunities');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • From Human Needs to Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-2');
                    onSelectModule2Tab?.('methodology');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Validation Protocol (6 Questions)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Module 3 Links */}
          <div className="space-y-2">
            <button
              onClick={() => onSelectModule('module-3')}
              className={`font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-left hover:text-blue-300 transition-colors ${
                activeModule === 'module-3' ? 'text-blue-400' : 'text-stone-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Module 3: The Solution Architect</span>
            </button>
            <p className="text-[11px] text-stone-500">Interactive Application Prototype</p>
            <ul className="space-y-1.5 text-xs text-stone-400 pt-1">
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-3');
                    onSelectModule3Tab?.('discovery');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Interest-Based Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-3');
                    onSelectModule3Tab?.('requests');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Mutual Introductions Gate
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-3');
                    onSelectModule3Tab?.('chat');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Active Connections & Chat
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectModule('module-3');
                    onSelectModule3Tab?.('safety');
                  }}
                  className="hover:text-stone-200 transition-colors"
                >
                  • Privacy & Safety Center
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Epistemic Academic Disclaimer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-stone-500">
          <div className="flex items-start gap-2 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>University Human-Centered Design Showcase:</strong> Modules 1 and 2 present rigorous
              empirical literature and research hypotheses. Module 3 is an interactive functional prototype demonstrating
              consent-first interactions and deterministic compatibility modeling using fictional personas.
            </span>
          </div>
          <div className="shrink-0 text-stone-400 font-mono">
            CommonGround • Unified Suite
          </div>
        </div>
      </div>
    </footer>
  );
};
