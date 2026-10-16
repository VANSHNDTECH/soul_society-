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
} from 'lucide-react';
import { calculateCompatibility, COMPATIBILITY_WEIGHTS } from '../utils/compatibility';

export const WhyMatchModal: React.FC = () => {
  const { whyMatchUser, setWhyMatchUser, currentUser } = useApp();

  if (!whyMatchUser) return null;

  const comp = calculateCompatibility(currentUser, whyMatchUser);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-stone-900 to-teal-950 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Why This Match?</h2>
              <p className="text-xs text-teal-200">
                Transparent compatibility calculation with {whyMatchUser.name}
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

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Big Score Summary Banner */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                Estimated Compatibility
              </span>
              <h3 className="text-2xl font-extrabold text-stone-900 mt-1 font-heading">
                {comp.totalScore}% Alignment
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Calculated deterministically from 4 human-auditable dimensions.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex flex-col items-center justify-center shadow-inner">
              <span className="text-xl font-black font-heading leading-none">{comp.totalScore}</span>
              <span className="text-[10px] text-teal-200 font-medium">/ 100</span>
            </div>
          </div>

          {/* 4 Dimension Breakdowns */}
          <div className="space-y-4">
            {/* 1. Shared Interests */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  1. Shared Interests (40% Weight)
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {comp.interestScore} / 40 pts
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${(comp.interestScore / 40) * 100}%` }}
                />
              </div>
              <p className="text-xs text-stone-600">
                {comp.sharedInterests.length > 0 ? (
                  <>
                    Mutual passions:{' '}
                    <strong className="text-stone-900">
                      {comp.sharedInterests.join(', ')}
                    </strong>
                    .
                  </>
                ) : (
                  'No direct overlapping tags, but opportunities to share different passions.'
                )}
              </p>
            </div>

            {/* 2. Compatible Intentions */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  2. Compatible Intentions (30% Weight)
                </span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {comp.intentionScore} / 30 pts
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div
                  className="bg-teal-600 h-1.5 rounded-full"
                  style={{ width: `${(comp.intentionScore / 30) * 100}%` }}
                />
              </div>
              <p className="text-xs text-stone-600">
                {comp.sharedIntentions.length > 0 ? (
                  <>
                    Both looking for:{' '}
                    <strong className="text-stone-900">
                      {comp.sharedIntentions.join(' & ')}
                    </strong>
                    . Guarantees aligned expectations.
                  </>
                ) : (
                  'Different stated reasons for joining.'
                )}
              </p>
            </div>

            {/* 3. Shared Values */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  3. Shared Core Values (20% Weight)
                </span>
                <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                  {comp.valueScore} / 20 pts
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{ width: `${(comp.valueScore / 20) * 100}%` }}
                />
              </div>
              <p className="text-xs text-stone-600">
                {comp.sharedValues.length > 0 ? (
                  <>
                    Mutual values:{' '}
                    <strong className="text-stone-900">
                      {comp.sharedValues.join(', ')}
                    </strong>
                    .
                  </>
                ) : (
                  'Different primary value selections.'
                )}
              </p>
            </div>

            {/* 4. Communication Preferences */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  4. Communication Pacing & Energy (10% Weight)
                </span>
                <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  {comp.communicationScore} / 10 pts
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div
                  className="bg-amber-600 h-1.5 rounded-full"
                  style={{ width: `${(comp.communicationScore / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-stone-600">
                Pace match: {comp.paceMatch ? 'Identical ("' + currentUser.communicationPreferences.pace + '")' : 'Different pacing'}
              </p>
            </div>
          </div>

          {/* Academic Ethical Disclosure */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <Scale className="w-4 h-4 text-teal-700" />
              <span>Ethical Matching Design Guarantee</span>
            </div>
            <p className="leading-relaxed">
              CommonGround never uses sensitive personal attributes (such as race, religion, sexual orientation, or physical appearance) to rank users. This deterministic score exists solely to highlight conversation starters, not to pass algorithmic judgment on human worth.
            </p>
          </div>
        </div>

        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right">
          <button
            onClick={() => setWhyMatchUser(null)}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
