import React, { useState } from 'react';
import { ResearchTab } from '../../types/research';
import { ResearchNavbar } from './ResearchNavbar';
import { ResearchOverview } from './ResearchOverview';
import { ProblemExplorer } from './ProblemExplorer';
import { MeetingMethodsComparison } from './MeetingMethodsComparison';
import { PrioritizationMatrix } from './PrioritizationMatrix';
import { EvidenceExplorer } from './EvidenceExplorer';
import { FromProblemsToSolutions } from './FromProblemsToSolutions';
import { ResearchGapsAndInterviews } from './ResearchGapsAndInterviews';
import { ReferencesList } from './ReferencesList';
import { TOP_PROBLEMS } from '../../data/researchData';
import { Sparkles, BookOpen } from 'lucide-react';

interface ResearchDashboardProps {
  activeTab?: ResearchTab;
  setActiveTab?: (tab: ResearchTab) => void;
  onSwitchToPrototype?: () => void;
  onSwitchToModule2?: () => void;
  standalone?: boolean;
}

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({
  activeTab: externalTab,
  setActiveTab: externalSetTab,
  onSwitchToPrototype,
  onSwitchToModule2,
  standalone = false,
}) => {
  const [internalTab, setInternalTab] = useState<ResearchTab>('overview');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(TOP_PROBLEMS[0].id);

  const activeTab = externalTab ?? internalTab;
  const setActiveTab = externalSetTab ?? setInternalTab;

  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
    setActiveTab('problems');
  };

  const content = (
    <div className="w-full">
      {activeTab === 'overview' && (
        <ResearchOverview
          onNavigateTab={setActiveTab}
          onSelectProblem={handleSelectProblem}
        />
      )}

      {activeTab === 'problems' && (
        <ProblemExplorer
          selectedProblemId={selectedProblemId}
          onSelectProblem={setSelectedProblemId}
        />
      )}

      {activeTab === 'methods' && <MeetingMethodsComparison />}

      {activeTab === 'prioritization' && <PrioritizationMatrix />}

      {activeTab === 'evidence' && <EvidenceExplorer />}

      {activeTab === 'bridge' && (
        <FromProblemsToSolutions onSwitchToPrototype={onSwitchToPrototype || (() => {})} />
      )}

      {activeTab === 'gaps' && <ResearchGapsAndInterviews />}

      {activeTab === 'references' && <ReferencesList />}
    </div>
  );

  if (!standalone) {
    return content;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5] text-stone-800">
      {/* Research Navigation */}
      <ResearchNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSwitchToPrototype={onSwitchToPrototype || (() => {})}
        onSwitchToModule2={onSwitchToModule2}
      />

      {/* Main Research Content View */}
      <main className="flex-1 pb-16">
        {content}
      </main>

      {/* Research Intelligence Footer */}
      <footer className="bg-stone-900 text-stone-300 py-10 border-t border-stone-800 text-left text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-white">
                  CommonGround Research Initiative
                </span>
                <span className="text-[10px] bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded-full border border-teal-700/60 font-semibold">
                  Module 1: The Problem Detective
                </span>
              </div>
              <p className="text-stone-400 text-xs max-w-xl">
                An evidence-based investigation into why modern ways of meeting fail to produce meaningful connections. Grounded in peer-reviewed social psychology, demographic polling, and public health science.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onSwitchToPrototype && (
                <button
                  onClick={onSwitchToPrototype}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-stone-950 text-xs font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Module 3 Solution Prototype</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('references')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Scholarly Bibliography</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-stone-500 text-[11px]">
            <p>
              Academic Research Dashboard • University Project Submission for Human-Centered Computing & Social Systems.
            </p>
            <p>
              100% Traceable Citations • Zero Fabricated Demographics • Epistemic Integrity Framework.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
