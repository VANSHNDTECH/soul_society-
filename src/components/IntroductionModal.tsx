import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  HeartHandshake,
  Sparkles,
  Send,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { calculateCompatibility, generateSuggestedIcebreakers } from '../utils/compatibility';

export const IntroductionModal: React.FC = () => {
  const { introTargetUser, setIntroTargetUser, currentUser, sendIntroduction } = useApp();

  if (!introTargetUser) return null;

  const comp = calculateCompatibility(currentUser, introTargetUser);
  const suggestedPrompts = generateSuggestedIcebreakers(currentUser, introTargetUser);

  const [selectedPrompt, setSelectedPrompt] = useState<string>(suggestedPrompts[0] || '');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [selectedSharedInterest, setSelectedSharedInterest] = useState<string>(
    comp.sharedInterests[0] || introTargetUser.interests[0] || 'Common Ground'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMessage = customMessage.trim() || selectedPrompt;
    sendIntroduction(
      introTargetUser.id,
      selectedPrompt,
      finalMessage,
      selectedSharedInterest
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 to-teal-950 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Invite {introTargetUser.name} to Connect</h2>
              <p className="text-xs text-stone-300">
                Low-pressure introduction based on shared interests
              </p>
            </div>
          </div>

          <button
            onClick={() => setIntroTargetUser(null)}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Recipient summary */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <img
              src={introTargetUser.avatar}
              alt={introTargetUser.name}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-stone-200"
            />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-stone-900">{introTargetUser.name}</h3>
              <p className="text-xs text-stone-500 line-clamp-1">{introTargetUser.headline}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  {comp.totalScore}% Compatibility
                </span>
                {comp.sharedInterests.length > 0 && (
                  <span className="text-[10px] text-stone-500">
                    Mutual: {comp.sharedInterests.slice(0, 2).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Suggested Icebreakers */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              1. Choose a suggested icebreaker
            </label>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, idx) => {
                const isSelected = selectedPrompt === prompt;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      if (!customMessage) setCustomMessage(prompt);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-medium shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 text-[10px] ${
                          isSelected ? 'bg-teal-600 text-white' : 'border border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="leading-relaxed">"{prompt}"</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personalized Message Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Friendly Note (Optional or edit above)
              </label>
              <span className="text-[10px] text-stone-400">
                {customMessage.length}/300
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              placeholder="Add a warm sentence about why you'd love to connect..."
              className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs text-stone-800"
            />
          </div>

          {/* Consent Reminders */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Consent-First Guarantee</span>
            </div>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              {introTargetUser.name} can accept, decline, or ignore this invitation with zero public notification or penalty. Direct messaging will only unlock if both of you agree.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIntroTargetUser(null)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Introduction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
