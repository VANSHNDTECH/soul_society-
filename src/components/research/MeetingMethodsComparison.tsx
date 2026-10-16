import React, { useState } from 'react';
import { MEETING_METHODS, EVIDENCE_SOURCES } from '../../data/researchData';
import {
  Compass,
  CheckCircle2,
  XCircle,
  Users,
  Lightbulb,
  FileText,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const MeetingMethodsComparison: React.FC = () => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(MEETING_METHODS[0].id);
  const [viewMode, setViewMode] = useState<'matrix' | 'deep_dive'>('matrix');

  const selectedMethod =
    MEETING_METHODS.find(m => m.id === selectedMethodId) || MEETING_METHODS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Comparative Analysis
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
            Comparing the 4 Ways People Meet Today
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Analyzing structural strengths, limitations, disadvantaged groups, and evidence across channels.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'matrix'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Comparative Matrix
          </button>
          <button
            onClick={() => setViewMode('deep_dive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'deep_dive'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Method Deep-Dive
          </button>
        </div>
      </div>

      {/* MATRIX VIEW */}
      {viewMode === 'matrix' ? (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900 text-white divide-x divide-stone-800">
                  <th className="p-4 font-bold text-xs w-1/5">Meeting Channel</th>
                  <th className="p-4 font-bold text-xs w-1/5">What Works (Advantages)</th>
                  <th className="p-4 font-bold text-xs w-1/5">What Can Go Wrong (Limitations)</th>
                  <th className="p-4 font-bold text-xs w-1/5">Who Is Left Out</th>
                  <th className="p-4 font-bold text-xs w-1/5">Design Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {MEETING_METHODS.map(m => (
                  <tr key={m.id} className="divide-x divide-stone-100 hover:bg-stone-50/60 transition-colors">
                    <td className="p-4 align-top space-y-1">
                      <strong className="text-sm font-bold text-stone-900 block font-heading">
                        {m.name}
                      </strong>
                      <p className="text-[11px] text-stone-500 leading-relaxed italic">
                        {m.tagline}
                      </p>
                    </td>

                    <td className="p-4 align-top space-y-1.5">
                      {m.advantages.map((adv, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </div>
                      ))}
                    </td>

                    <td className="p-4 align-top space-y-1.5">
                      {m.limitations.map((lim, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-stone-700">
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{lim}</span>
                        </div>
                      ))}
                    </td>

                    <td className="p-4 align-top space-y-1.5">
                      {m.whoIsLeftOut.map((grp, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-stone-700">
                          <span className="text-purple-600 font-bold shrink-0">•</span>
                          <span>{grp}</span>
                        </div>
                      ))}
                    </td>

                    <td className="p-4 align-top space-y-1.5 bg-teal-50/30">
                      {m.improvementOpportunities.map((opp, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-teal-950 font-medium">
                          <Lightbulb className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                          <span>{opp}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
            <strong>Methodological Note on Measurement:</strong> Per scientific research guidelines, we avoid assigning arbitrary numerical star ratings to meeting methods. Each method possesses distinct structural trade-offs grounded in empirical literature.
          </div>
        </div>
      ) : (
        /* DEEP-DIVE VIEW */
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {MEETING_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMethodId(m.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedMethod.id === m.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-2xl font-extrabold text-stone-900 font-heading">
                {selectedMethod.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 italic">
                "{selectedMethod.tagline}"
              </p>
              <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed">
                {selectedMethod.summary}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Advantages (What Works Well)</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedMethod.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Limitations to Investigate (What Can Go Wrong)</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedMethod.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">✕</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>Who May Be Disadvantaged or Left Out</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedMethod.whoIsLeftOut.map((grp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold shrink-0">•</span>
                      <span>{grp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-teal-700" />
                  <span>Design Opportunities for CommonGround</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedMethod.improvementOpportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold shrink-0">→</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
              <strong>Empirical Synthesis:</strong>
              <p>{selectedMethod.supportingEvidenceSummary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
