import React, { useState } from 'react';
import { CURRENT_METHODS_ANALYSIS } from '../../data/module2Data';
import {
  Layers,
  CheckCircle2,
  XCircle,
  Users,
  Lightbulb,
  ThumbsUp,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const CurrentSolutionsSection: React.FC = () => {
  const [activeMethodId, setActiveMethodId] = useState<string>(
    CURRENT_METHODS_ANALYSIS[0].id
  );

  const activeMethod =
    CURRENT_METHODS_ANALYSIS.find(m => m.id === activeMethodId) ||
    CURRENT_METHODS_ANALYSIS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
          Ecosystem Landscape
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
          Current Solutions & Their Limitations
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Evaluating the 6 primary ways people currently attempt to connect: what works, what breaks, and who is excluded.
        </p>
      </div>

      {/* Balanced Nuance Notice */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs text-stone-700">
        <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-900 block font-bold">
            Balanced Human-Centered Evaluation:
          </strong>
          <p className="mt-0.5">
            No single method fails everyone. Traditional introductions, college classes, and clubs provide tremendous value for outgoing individuals in dense communities. Our analysis focuses on identifying the specific structural gaps where these existing systems fail certain groups.
          </p>
        </div>
      </div>

      {/* Method Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {CURRENT_METHODS_ANALYSIS.map(m => {
          const isSelected = m.id === activeMethod.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMethodId(m.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-purple-600 bg-stone-900 text-white shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <h4 className="font-bold text-xs line-clamp-2 leading-tight">
                {m.name}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Method Deep-Dive Panel */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-stone-200 pb-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
            Method Evaluation
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 font-heading">
            {activeMethod.name}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 italic">
            "{activeMethod.tagline}"
          </p>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Who May Benefit */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-teal-700" />
              <span>Who May Benefit</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {activeMethod.whoMayBenefit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-teal-700 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Works Well */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>What Works Well</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {activeMethod.whatWorksWell.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Can Go Wrong */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>What Can Go Wrong</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {activeMethod.whatCanGoWrong.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Who May Be Left Out */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Who May Be Left Out</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {activeMethod.whoMayBeLeftOut.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Opportunity for Improvement */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 to-white border border-amber-200 space-y-1.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>Opportunity for Improvement</span>
          </h4>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
            {activeMethod.opportunityForImprovement}
          </p>
        </div>
      </div>
    </div>
  );
};
