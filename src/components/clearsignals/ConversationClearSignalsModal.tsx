import React, { useState } from 'react';
import { clearSignalsService } from '../../services/clearSignalsService';
import {
  ConversationMessageAnalysis,
  ReplyDraftResult,
  ReplyTone,
} from '../../types/clearsignals';
import { User, Connection, ChatMessage } from '../../types';
import {
  Sparkles,
  Lock,
  Eye,
  HelpCircle,
  Copy,
  Send,
  RotateCcw,
  X,
  Check,
  ShieldAlert,
  Info,
  Compass,
} from 'lucide-react';

interface ConversationClearSignalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'understand' | 'reply';
  currentConnection: Connection;
  otherUser: User;
  currentUser: User;
  recentMessages: ChatMessage[];
  onSendMessage: (connectionId: string, text: string) => void;
}

const TONE_OPTIONS: { id: ReplyTone; label: string; desc: string; icon: string }[] = [
  {
    id: 'casual',
    label: 'Casual & friendly',
    desc: 'Relaxed, playful, zero pressure.',
    icon: '💬',
  },
  {
    id: 'gentle',
    label: 'Gentle & reassuring',
    desc: 'Warm, empathetic, validates space.',
    icon: '🌿',
  },
  {
    id: 'direct',
    label: 'Clear & direct',
    desc: 'Honest and collaborative check-in.',
    icon: '🎯',
  },
  {
    id: 'boundary',
    label: 'Respectful & boundary-setting',
    desc: 'Self-respecting, calm detachment.',
    icon: '🛡️',
  },
];

export const ConversationClearSignalsModal: React.FC<ConversationClearSignalsModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  currentConnection,
  otherUser,
  currentUser,
  recentMessages,
  onSendMessage,
}) => {
  const [mode, setMode] = useState<'understand' | 'reply'>(initialMode);

  // Privacy Consent Gate
  const [hasConsented, setHasConsented] = useState<boolean>(false);

  // "Understand This" state
  const otherUserMessages = recentMessages.filter((m) => m.senderId !== currentUser.id);
  const lastReceivedMessage = otherUserMessages[otherUserMessages.length - 1]?.text || '';
  const [selectedMessageText, setSelectedMessageText] = useState<string>(lastReceivedMessage);
  const [analysisResult, setAnalysisResult] = useState<ConversationMessageAnalysis | null>(null);

  // "Help Me Reply" state
  const [selectedTone, setSelectedTone] = useState<ReplyTone>('gentle');
  const [draftResult, setDraftResult] = useState<ReplyDraftResult | null>(null);
  const [editableDraft, setEditableDraft] = useState<string>('');
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [sendConfirmationPending, setSendConfirmationPending] = useState<boolean>(false);

  if (!isOpen) return null;

  // Authorization and Connection Status Guards
  const isBlocked = currentConnection.status === 'blocked';
  const isDisconnected = currentConnection.status === 'disconnected';
  const canSend = !isBlocked && !isDisconnected && currentConnection.status === 'active';

  const handleConsent = () => {
    setHasConsented(true);
    if (mode === 'understand') {
      runAnalysis(selectedMessageText || 'Recent conversation exchange');
    } else {
      generateDraft(selectedTone);
    }
  };

  const runAnalysis = (textToAnalyze: string) => {
    const res = clearSignalsService.analyzeConversationMessage(textToAnalyze);
    setAnalysisResult(res);
  };

  const generateDraft = (tone: ReplyTone) => {
    const res = clearSignalsService.generateReplyDraft(
      selectedMessageText || 'Conversation check-in',
      tone,
      otherUser.name
    );
    setDraftResult(res);
    setEditableDraft(res.draft);
  };

  const handleToneChange = (tone: ReplyTone) => {
    setSelectedTone(tone);
    generateDraft(tone);
  };

  const handleCopy = () => {
    if (!editableDraft) return;
    navigator.clipboard.writeText(editableDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleSendAction = () => {
    if (!editableDraft.trim() || !canSend) return;
    onSendMessage(currentConnection.id, editableDraft.trim());
    onClose();
  };

  const handleSwitchToReplyWithQuestion = (question: string) => {
    setMode('reply');
    setEditableDraft(question);
    setSelectedTone('direct');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-stone-900">
                  ClearSignals Assistant
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                  Private & Optional
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Conversation with <strong className="text-stone-800">{otherUser.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-stone-200 px-5 pt-3 bg-white">
          <button
            onClick={() => {
              setMode('understand');
              if (hasConsented) runAnalysis(selectedMessageText || 'Recent exchange');
            }}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              mode === 'understand'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Help me understand this</span>
          </button>
          <button
            onClick={() => {
              setMode('reply');
              if (hasConsented) generateDraft(selectedTone);
            }}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              mode === 'reply'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Help me reply</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Privacy & Consent Notice Gate */}
          {!hasConsented ? (
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-6 space-y-4 text-stone-800">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900">
                    Your Privacy & Consent Are Protected
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Before processing this interaction, please note our strict privacy boundaries:
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 pl-4 list-disc">
                <li>
                  <strong>No background surveillance:</strong> ClearSignals only processes the specific message text you explicitly choose.
                </li>
                <li>
                  <strong>Not shared:</strong> The other person is never notified that you reflected on this message.
                </li>
                <li>
                  <strong>No mind-reading:</strong> ClearSignals does not claim to diagnose emotions or predict romantic interest as absolute facts.
                </li>
                <li>
                  <strong>You control message sending:</strong> Suggestions are never sent automatically.
                </li>
              </ul>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleConsent}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-800 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  I Understand, Proceed to Analysis →
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* MODE 1: Help Me Understand This */}
              {mode === 'understand' && (
                <div className="space-y-6">
                  {/* Message Selection / Custom Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
                      <span>Message to Reflect On:</span>
                      <span className="text-[10px] text-teal-700 lowercase font-normal">
                        (editable for precision)
                      </span>
                    </label>
                    <textarea
                      rows={2}
                      value={selectedMessageText}
                      onChange={(e) => {
                        setSelectedMessageText(e.target.value);
                        runAnalysis(e.target.value);
                      }}
                      placeholder="Paste or type the specific confusing message or interaction..."
                      className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 leading-relaxed"
                    />
                  </div>

                  {analysisResult && (
                    <div className="space-y-4">
                      {/* Literal Content */}
                      <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>What the message literally says</span>
                        </span>
                        <p className="text-xs text-stone-800 font-medium">
                          {analysisResult.literalContent}
                        </p>
                      </div>

                      {/* What it does NOT establish */}
                      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          <span>What this message does NOT establish</span>
                        </span>
                        <ul className="space-y-1 text-xs text-stone-700">
                          {analysisResult.whatItDoesNotEstablish.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Possible Interpretations */}
                      <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Possible Interpretations (Hypotheses, Not Facts)</span>
                        </span>
                        <ul className="space-y-1 text-xs text-stone-700">
                          {analysisResult.possibleInterpretations.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Respectful Clarification Bridge */}
                      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                            Respectful Clarification Suggestion
                          </span>
                          <p className="text-xs text-stone-800 italic">
                            "{analysisResult.respectfulClarificationQuestion}"
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleSwitchToReplyWithQuestion(
                              analysisResult.respectfulClarificationQuestion
                            )
                          }
                          className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
                        >
                          Use in 'Help me reply' →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: Help Me Reply */}
              {mode === 'reply' && (
                <div className="space-y-6">
                  {/* Tone Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      Choose Your Preferred Tone:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {TONE_OPTIONS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleToneChange(t.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            selectedTone === t.id
                              ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/10'
                              : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{t.icon}</span>
                            <span className="text-xs font-bold text-stone-900">{t.label}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-1 leading-snug">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Draft Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                        <span>Generated Draft (Full Editing Freedom):</span>
                      </label>
                      <button
                        onClick={() => generateDraft(selectedTone)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Regenerate Draft</span>
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={editableDraft}
                      onChange={(e) => setEditableDraft(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm text-stone-900 leading-relaxed"
                    />

                    {/* Guiding Principles Badge */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
                      <p className="font-semibold text-stone-700">Non-Accusatory Draft Rules Enforced:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-stone-500">
                        <li>Avoids guilt, manipulation, and assumptions of intention.</li>
                        <li>Respects the recipient's personal boundaries and schedule.</li>
                        <li>No message is ever sent without your explicit click.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Messaging Permissions Check */}
                  {!canSend && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        This conversation is currently {currentConnection.status}. Sending is disabled.
                      </span>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-600"
                      >
                        Cancel
                      </button>

                      {!sendConfirmationPending ? (
                        <button
                          type="button"
                          disabled={!editableDraft.trim() || !canSend}
                          onClick={() => setSendConfirmationPending(true)}
                          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message to {otherUser.name}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 animate-in fade-in">
                          <button
                            type="button"
                            onClick={() => setSendConfirmationPending(false)}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleSendAction}
                            className="px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm & Send Now</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
