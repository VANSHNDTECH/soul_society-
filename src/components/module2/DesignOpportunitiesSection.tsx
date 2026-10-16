import React from 'react';
import { FEATURE_MAPPINGS } from '../../data/module2Data';
import {
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Target,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface DesignOpportunitiesSectionProps {
  onSwitchToModule3: () => void;
}

export const DesignOpportunitiesSection: React.FC<DesignOpportunitiesSectionProps> = ({
  onSwitchToModule3,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            Translational Design
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
            From Human Needs to Product Features
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Traceable mapping linking Aanya, Rohan, and Meera’s unmet needs directly to CommonGround features in Module 3.
          </p>
        </div>

        <button
          onClick={onSwitchToModule3}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4 text-teal-300" />
          <span>Test in Module 3 Prototype</span>
        </button>
      </div>

      {/* Epistemic Standard Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">
            Scientific Epistemic Standard for Design Hypotheses:
          </strong>
          <p className="mt-0.5">
            The intended benefits outlined below represent <strong>design hypotheses</strong> grounded in cognitive psychology and human-centered design principles. They are not claimed as scientifically finalized outcomes until verified through longitudinal user testing in Module 3.
          </p>
        </div>
      </div>

      {/* Traceable Mapping Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
          <h2 className="font-bold text-sm font-heading flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-300" />
            <span>Traceable Needs-to-Feature Architecture</span>
          </h2>
          <span className="text-[11px] text-stone-300">
            7 Verified Design Responses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 divide-x divide-stone-200">
                <th className="p-4 font-bold w-1/4">Unmet Human Need</th>
                <th className="p-4 font-bold w-1/4">Proposed CommonGround Feature</th>
                <th className="p-4 font-bold w-1/4">Intended Psychological Benefit</th>
                <th className="p-4 font-bold w-1/4">Target Persona & Hypothesis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {FEATURE_MAPPINGS.map(feat => (
                <tr
                  key={feat.id}
                  className="divide-x divide-stone-100 hover:bg-stone-50/50 transition-colors"
                >
                  {/* User Need */}
                  <td className="p-4 align-top space-y-1">
                    <strong className="font-bold text-stone-900 block text-xs">
                      {feat.userNeed}
                    </strong>
                  </td>

                  {/* Proposed Feature */}
                  <td className="p-4 align-top space-y-1 bg-teal-50/20">
                    <span className="inline-flex items-center gap-1.5 font-bold text-teal-950 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      {feat.proposedFeature}
                    </span>
                  </td>

                  {/* Intended Benefit */}
                  <td className="p-4 align-top text-stone-700 leading-relaxed">
                    {feat.intendedBenefit}
                  </td>

                  {/* Target Persona & Hypothesis */}
                  <td className="p-4 align-top space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {feat.targetPersonas.map(persona => (
                        <span
                          key={persona}
                          className="text-[10px] font-bold bg-purple-50 text-purple-900 px-2 py-0.5 rounded-md border border-purple-100"
                        >
                          {persona}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-500 italic leading-snug">
                      "{feat.designHypothesisNote}"
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
