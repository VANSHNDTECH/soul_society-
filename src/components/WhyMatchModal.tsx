import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Info,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Heart,
  Scale,
  Eye,
  Sliders,
  UserX,
  AlertTriangle,
} from 'lucide-react';
import { calculateCompatibility, COMPATIBILITY_WEIGHTS } from '../utils/compatibility';

export const WhyMatchModal: React.FC = () => {
  const {
    whyMatchUser,
    setWhyMatchUser,
    currentUser,
    influenceSettings,
    dismissUserFromDiscovery,
    setActiveTab,
  } = useApp();

  if (!whyMatchUser) return null;

  const comp = calculateCompatibility(currentUser, whyMatchUser, influenceSettings);

  const handleDismiss = () => {
    dismissUserFromDiscovery(whyMatchUser.id);
    setWhyMatchUser(null);
  };

  const handleGoToSettings = () => {
    setWhyMatchUser(null);
    setActiveTab('opensignals');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-stone-900 to-teal-950 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-500/30 text-teal-200 border border-teal-400/20">
                  OpenSignals • Recommendation Audit
                </span>
              </div>
              <h2 className="text-lg font-bold mt-1">Why am I seeing {whyMatchUser.name}?</h2>
              <p className="text-xs text-stone-300">
                Transparent factors that placed this recommendation in your discovery feed
              </p>
            </div>
          </div>

          <button
            onClick={() => setWhyMatchUser(null)}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Data Classification Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <span className="font-semibold text-stone-700">Profile Source:</span>
            {comp.isDemoProfile ? (
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Illustrative Community Archetype (Demo)</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Registered Member (Live Database)</span>
              </span>
            )}
          </div>

          {/* Alignment Score Breakdown */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                Common Ground Index
              </span>
              <h3 className="text-2xl font-extrabold text-stone-900 mt-1 font-heading">
                {comp.totalScore}% Alignment
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Calculated deterministically from 4 configurable factors.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex flex-col items-center justify-center shadow-inner">
              <span className="text-xl font-black font-heading leading-none">{comp.totalScore}</span>
              <span className="text-[10px] text-teal-200 font-medium">/ 100</span>
            </div>
          </div>

          {/* Actual Factors Contributing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Factors That Influenced This Suggestion:
            </h4>
            <div className="space-y-2">
              {comp.activeFactors && comp.activeFactors.length > 0 ? (
                comp.activeFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs text-emerald-950 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{factor}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded">
                      Influencing
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 italic">No direct positive factors active.</p>
              )}

              {comp.inactiveFactors && comp.inactiveFactors.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Excluded by Your OpenSignals Preferences:
                  </span>
                  {comp.inactiveFactors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-[11px] text-stone-500 flex items-center justify-between"
                    >
                      <span>{factor}</span>
                      <span className="text-[10px] bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded">
                        Ignored
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detailed 4 Dimensions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Factor Weight Breakdown:
            </h4>

            {/* 1. Shared Interests */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">1. Shared Interests (40% Weight)</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {comp.interestScore} / 40 pts
                </span>
              </div>
              <p className="text-stone-600 text-[11px]">
                {comp.sharedInterests.length > 0
                  ? `Overlapping topics: ${comp.sharedInterests.join(', ')}.`
                  : 'No direct tag overlap.'}
              </p>
            </div>

            {/* 2. Compatible Intentions */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">2. Stated Intentions (30% Weight)</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {comp.intentionScore} / 30 pts
                </span>
              </div>
              <p className="text-stone-600 text-[11px]">
                {comp.sharedIntentions.length > 0
                  ? `Both seeking: ${comp.sharedIntentions.join(' & ')}.`
                  : 'Different stated goals.'}
              </p>
            </div>

            {/* 3. Shared Values */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">3. Shared Values (20% Weight)</span>
                <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  {comp.valueScore} / 20 pts
                </span>
              </div>
              <p className="text-stone-600 text-[11px]">
                {comp.sharedValues.length > 0
                  ? `Mutual values: ${comp.sharedValues.join(', ')}.`
                  : 'Different primary values.'}
              </p>
            </div>

            {/* 4. Communication Preferences */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">4. Pacing & Style (10% Weight)</span>
                <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {comp.communicationScore} / 10 pts
                </span>
              </div>
              <p className="text-stone-600 text-[11px]">
                Pace match: {comp.paceMatch ? `Both prefer "${currentUser.communicationPreferences.pace}"` : 'Different pacing'}
              </p>
            </div>
          </div>

          {/* Critical OpenSignals Reality Guarantees */}
          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs text-teal-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <Scale className="w-4 h-4 text-teal-700" />
              <span>OpenSignals Reality Disclosures:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-stone-700 text-[11px] leading-relaxed">
              <li>
                <strong>Interest overlap ≠ Chemistry:</strong> Shared interests establish common ground to start talking, but they do not guarantee emotional connection.
              </li>
              <li>
                <strong>No prediction of attraction:</strong> The system never claims to know whether someone likes you or is attracted to you.
              </li>
              <li>
                <strong>Zero secret tracking:</strong> This score is based entirely on user-disclosed profile fields—never on device telemetry or background web activity.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDismiss}
              className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-200 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
              title="Hide this recommendation from your current session"
            >
              <UserX className="w-3.5 h-3.5 text-stone-500" />
              <span>Dismiss Recommendation</span>
            </button>
            <button
              onClick={handleGoToSettings}
              className="px-3.5 py-2 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-xs font-semibold text-teal-900 flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-700" />
              <span>Adjust Influence Rules</span>
            </button>
          </div>

          <button
            onClick={() => setWhyMatchUser(null)}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors w-full sm:w-auto text-center"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
