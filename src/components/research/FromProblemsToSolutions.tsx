import React from 'react';
import { SOLUTION_BRIDGE_ITEMS } from '../../data/researchData';
import {
  Layers,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface FromProblemsToSolutionsProps {
  onSwitchToPrototype: () => void;
}

export const FromProblemsToSolutions: React.FC<FromProblemsToSolutionsProps> = ({
  onSwitchToPrototype,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Three-Module Research Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
            From Problems to Solutions: The Architectural Bridge
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Bridging Module 1 (The Problem Detective) to Module 2 (The People Left Out) and Module 3 (The Solution Architect).
          </p>
        </div>

        <button
          onClick={onSwitchToPrototype}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4 text-teal-300" />
          <span>Launch Module 3 Prototype</span>
        </button>
      </div>

      {/* 3-Module Pipeline Flowchart Visual */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
              Module 1: Complete
            </span>
            <span className="text-xs font-bold text-stone-400">Step 01</span>
          </div>
          <h3 className="font-bold text-sm text-stone-900">The Problem Detective</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Diagnose what is failing in existing meeting methods using peer-reviewed psychology and empirical demographic evidence.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
              Module 2: Connected
            </span>
            <span className="text-xs font-bold text-purple-400">Step 02</span>
          </div>
          <h3 className="font-bold text-sm text-stone-900">The People Left Out</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Identify specific demographic cohorts (introverts, newcomers, neurodivergent individuals, harassed users) and articulate their unmet needs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
              Module 3: Implemented
            </span>
            <span className="text-xs font-bold text-teal-600">Step 03</span>
          </div>
          <h3 className="font-bold text-sm text-stone-900">The Solution Architect</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Engineer the CommonGround consent-first, explainable prototype with quiet declines and interest discovery.
          </p>
        </div>
      </div>

      {/* 5 Problem-to-Solution Transformation Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900 font-heading">
          Evidence-to-Architecture Transformation Matrix
        </h2>

        <div className="space-y-6">
          {SOLUTION_BRIDGE_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                    Diagnostic Mapping 0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-heading">
                    {item.problemTitle}
                  </h3>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  {item.evidenceSummary}
                </span>
              </div>

              {/* 4 Step Horizontal Translation Flow */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* 1. Affected Group (Module 2) */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[11px] uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-purple-700" />
                    <span>Affected Group</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {item.affectedGroup}
                  </p>
                </div>

                {/* 2. User Need (Module 2) */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px] uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5 text-blue-700" />
                    <span>Unmet User Need</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {item.userNeedToInvestigate}
                  </p>
                </div>

                {/* 3. Design Opportunity */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                    <span>Design Opportunity</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {item.designOpportunity}
                  </p>
                </div>

                {/* 4. CommonGround Feature (Module 3) */}
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-900 font-bold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>CommonGround Prototype Feature</span>
                  </div>
                  <p className="text-stone-900 leading-relaxed font-bold">
                    {item.commonGroundFeature}
                  </p>
                </div>
              </div>

              {/* Testable Question for User Testing */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700">
                <HelpCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">Empirical Research Hypothesis to Test in User Lab:</strong>
                  <p className="italic text-stone-600 mt-0.5">"{item.testableQuestion}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Epistemic Distiction Box */}
      <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-700 space-y-1.5">
        <strong className="text-stone-900 block font-bold">
          Crucial Distinction: Proposed Design Response vs. Scientifically Proven Solution
        </strong>
        <p className="leading-relaxed">
          The features implemented in CommonGround represent <em>theoretically informed design responses</em> to empirical problems diagnosed in Module 1. They are working prototypes designed to test hypotheses, not self-proclaimed silver bullets. True validation requires primary usability testing and longitudinal user interviews (detailed in Research Gaps).
        </p>
      </div>
    </div>
  );
};
