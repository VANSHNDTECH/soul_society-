import React from 'react';
import { TOP_PROBLEMS, EVIDENCE_SOURCES } from '../../data/researchData';
import {
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Users,
  Lightbulb,
  Sparkles,
  Info,
} from 'lucide-react';

interface ProblemExplorerProps {
  selectedProblemId: string;
  onSelectProblem: (id: string) => void;
}

export const ProblemExplorer: React.FC<ProblemExplorerProps> = ({
  selectedProblemId,
  onSelectProblem,
}) => {
  const currentProblem =
    TOP_PROBLEMS.find(p => p.id === selectedProblemId) || TOP_PROBLEMS[0];

  const problemSources = EVIDENCE_SOURCES.filter(s =>
    currentProblem.sourceIds.includes(s.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          In-Depth Investigation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
          Problem Explorer: The 5 Candidate Problems
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Detailed evidentiary breakdown, analytical limits, affected groups, and design responses.
        </p>
      </div>

      {/* Problem Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-stone-200 pb-4 overflow-x-auto">
        {TOP_PROBLEMS.map(prob => {
          const isSelected = prob.id === currentProblem.id;
          return (
            <button
              key={prob.id}
              onClick={() => onSelectProblem(prob.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-teal-700 bg-stone-900 text-white shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-teal-500/30 text-teal-200' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  0{prob.number}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    isSelected ? 'text-teal-300' : 'text-emerald-700'
                  }`}
                >
                  {prob.confidenceLevel}
                </span>
              </div>
              <h4 className="font-bold text-xs line-clamp-2 leading-tight">
                {prob.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Main Problem Investigation Pane */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Title & Tagline */}
        <div className="space-y-2 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
              Problem #{currentProblem.number}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Confidence: {currentProblem.confidenceLevel} Evidence
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading">
            {currentProblem.title}
          </h2>
          <p className="text-sm font-medium text-stone-500 italic">
            "{currentProblem.tagline}"
          </p>
        </div>

        {/* What is going wrong */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>What is going wrong</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            {currentProblem.detailedExplanation}
          </p>
        </div>

        {/* Empirical Data Highlight */}
        {currentProblem.keyStatistic && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Key Verified Statistic
            </span>
            <p className="text-sm font-bold text-stone-900">
              {currentProblem.keyStatistic}
            </p>
            <p className="text-xs text-stone-600">
              {currentProblem.statisticContext}
            </p>
          </div>
        )}

        {/* Epistemic Boundaries: What Evidence Supports vs Does Not Establish */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {/* What Evidence Supports */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>What the Evidence Supports</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {currentProblem.whatEvidenceSupports.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Evidence Does NOT Establish */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700" />
              <span>What the Evidence Does NOT Establish</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {currentProblem.whatEvidenceDoesNotEstablish.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affected Groups & Design Implications */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {/* Groups Disadvantaged (Module 2 Bridge) */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Who is Disadvantaged / Left Out (Module 2 Focus)</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {currentProblem.affectedGroups.map((group, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{group}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Design Implications (Module 3 Bridge) */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-teal-700" />
              <span>Design Implications for CommonGround (Module 3)</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {currentProblem.designImplications.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">→</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Supporting Evidence Sources */}
        <div className="pt-4 border-t border-stone-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Supporting Empirical Sources ({problemSources.length})</span>
          </h3>

          <div className="space-y-3">
            {problemSources.map(source => (
              <div
                key={source.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs text-stone-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-stone-900 text-sm">
                    {source.sourceTitle}
                  </span>
                  <a
                    href={source.directUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-teal-800 hover:text-teal-950 font-semibold"
                  >
                    <span>View Primary Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-stone-500 text-[11px]">
                  <span><strong>Author/Org:</strong> {source.authorOrOrganization}</span>
                  <span><strong>Date:</strong> {source.publicationDate}</span>
                  <span><strong>Type:</strong> {source.sourceType}</span>
                </div>

                <p className="text-stone-700 pt-1">
                  <strong>Key Finding:</strong> {source.relevantFinding}
                </p>

                <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200 text-[11px] text-stone-600">
                  <strong>Population & Context:</strong> {source.populationAndGeography}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
