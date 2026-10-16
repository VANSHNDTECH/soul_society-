import React from 'react';
import {
  TOP_PROBLEMS,
  RESEARCH_OVERVIEW_META,
  MEETING_METHODS,
  EVIDENCE_SOURCES,
} from '../../data/researchData';
import { ResearchTab } from '../../types/research';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  FileText,
  Scale,
  Compass,
} from 'lucide-react';

interface ResearchOverviewProps {
  onNavigateTab: (tab: ResearchTab) => void;
  onSelectProblem: (problemId: string) => void;
}

export const ResearchOverview: React.FC<ResearchOverviewProps> = ({
  onNavigateTab,
  onSelectProblem,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      {/* Central Research Question Hero Banner */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide border border-teal-500/30">
            <Search className="w-3.5 h-3.5" />
            <span>Module 1: The Problem Detective</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            "What is actually going wrong in how people come to meet,{' '}
            <span className="text-teal-300 underline decoration-teal-400/50 decoration-wavy decoration-2">
              and for whom?
            </span>
            "
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Existing social discovery mechanisms systematically fail to produce lasting, compatible bonds. Rather than assuming all existing methods are broken, this investigative dashboard synthesizes peer-reviewed psychology, sociological network modeling, and federal public health evidence across four major meeting channels.
          </p>

          {/* Research Coverage Metric Strip */}
          <div className="pt-4 flex flex-wrap gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-teal-300 font-bold block text-sm">100%</span>
              <span className="text-stone-300 text-[11px]">Empirically Sourced Problems</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-teal-300 font-bold block text-sm">4 Methods</span>
              <span className="text-stone-300 text-[11px]">Compared Systematically</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-teal-300 font-bold block text-sm">9 Sources</span>
              <span className="text-stone-300 text-[11px]">Peer-Reviewed & Federal Citations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Epistemological Standard: Evidence vs. Hypotheses */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <span>Research Methodology & Epistemic Standards</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          In accordance with scientific and investigative rigor, this project enforces strict distinctions between <strong>statistically verified evidence</strong> (e.g. Pew Research probability samples, peer-reviewed longitudinal models) and <strong>preliminary hypotheses</strong>. We do not invent statistics, generalize U.S. data to all global contexts, or assume that dating app dynamics apply identically to platonic communities.
        </p>
      </section>

      {/* Top 5 Problems Summary Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-heading">
              The Top 5 Evidence-Backed Problems
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Select any candidate problem to inspect exact empirical citations, limitations, and design implications.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('problems')}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 self-start sm:self-center"
          >
            <span>View Full Problem Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOP_PROBLEMS.map(prob => (
            <div
              key={prob.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                    Problem 0{prob.number}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prob.confidenceLevel === 'Strong'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
                    }`}
                  >
                    {prob.confidenceLevel} Evidence
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900 leading-snug">
                  {prob.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {prob.shortExplanation}
                </p>

                {/* Key Stat Callout */}
                {prob.keyStatistic && (
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-[11px] text-teal-950 font-medium space-y-1">
                    <span className="font-bold text-teal-800 block text-[10px] uppercase tracking-wider">
                      Empirical Data Highlight
                    </span>
                    <p className="leading-tight">{prob.keyStatistic}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {prob.sourceIds.length} verified studies
                </span>
                <button
                  onClick={() => {
                    onSelectProblem(prob.id);
                    onNavigateTab('problems');
                  }}
                  className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 group"
                >
                  <span>Investigate Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 4 Meeting Methods at a Glance */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-heading">
              Comparing the 4 Ways People Meet Today
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Examining advantages, failure modes, and who is systematically disadvantaged.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('methods')}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900"
          >
            <span>Open Comparative Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEETING_METHODS.map(method => (
            <button
              key={method.id}
              onClick={() => onNavigateTab('methods')}
              className="p-5 rounded-2xl bg-white border border-stone-200 text-left space-y-3 hover:border-teal-400 hover:shadow-xs transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs">
                <Compass className="w-4 h-4 text-teal-700" />
              </div>
              <h4 className="font-bold text-sm text-stone-900">{method.name}</h4>
              <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                {method.summary}
              </p>
              <span className="text-[11px] font-semibold text-teal-700 block">
                Explore Advantages & Limits →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* From Problems to Solutions Bridge Callout */}
      <section className="bg-gradient-to-br from-stone-50 via-teal-50/50 to-white rounded-3xl border border-teal-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Bridge to Module 2 (Users) & Module 3 (Solution)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Translating Investigative Findings into Ethical Product Design
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every problem diagnosed in Module 1 maps directly to an unmet user need in Module 2 and a concrete, consent-first feature implemented in the CommonGround prototype.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('bridge')}
          className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          View Problem-to-Solution Map
        </button>
      </section>
    </div>
  );
};
