import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  clearSignalsService,
} from '../../services/clearSignalsService';
import {
  ClearSignalsReflection,
  NextStepOption,
  ScenarioShortcut,
} from '../../types/clearsignals';
import {
  Sparkles,
  Shield,
  HelpCircle,
  Eye,
  AlertCircle,
  Clock,
  Compass,
  CheckCircle2,
  Bookmark,
  Trash2,
  RotateCcw,
  Edit3,
  Copy,
  ChevronRight,
  ArrowLeft,
  Lock,
  MessageSquare,
  Info,
} from 'lucide-react';

const SCENARIO_SHORTCUTS: {
  id: ScenarioShortcut;
  label: string;
  exampleText: string;
  icon: string;
}[] = [
  {
    id: 'delayed_reply',
    label: 'They replied late or left my message unanswered',
    exampleText:
      "They saw my message hours ago but haven't replied. Maybe they don't like me or are ignoring me.",
    icon: '⏳',
  },
  {
    id: 'short_reply',
    label: 'Their reply was short or difficult to interpret',
    exampleText:
      "I sent a thoughtful paragraph about my day, and they just replied 'cool'. I'm worried they're annoyed with me.",
    icon: '💬',
  },
  {
    id: 'interest_uncertainty',
    label: 'I am unsure whether they are interested in me',
    exampleText:
      "Sometimes our conversations feel great, but other times they don't initiate. I can't tell if they want to stay connected.",
    icon: '❓',
  },
  {
    id: 'worried_said_wrong',
    label: 'I worry that I said something wrong',
    exampleText:
      "I made an awkward joke in my last message, and now the energy feels different. I'm afraid I ruined things.",
    icon: '😟',
  },
  {
    id: 'plans_changed',
    label: 'Their plans or behavior changed unexpectedly',
    exampleText:
      "We had talked about grabbing coffee this weekend, but they just said they have to postpone. I'm wondering if it's an excuse.",
    icon: '📅',
  },
  {
    id: 'other',
    label: 'Something else (Describe in your own words)',
    exampleText: '',
    icon: '✨',
  },
];

export const ClearSignalsView: React.FC = () => {
  const { currentUser } = useApp();

  // Wizard state: 1 = Describe, 2 = Fact vs Assumption, 3 = Next Steps
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<'reflect' | 'saved'>('reflect');

  // Input state
  const [situationText, setSituationText] = useState('');
  const [selectedShortcut, setSelectedShortcut] = useState<ScenarioShortcut | null>(null);

  // Reflection result
  const [currentReflection, setCurrentReflection] = useState<ClearSignalsReflection | null>(null);
  const [selectedNextStep, setSelectedNextStep] = useState<NextStepOption | null>(null);
  const [customDraft, setCustomDraft] = useState('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Saved reflections list
  const [savedReflections, setSavedReflections] = useState<ClearSignalsReflection[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load saved reflections on mount
  useEffect(() => {
    loadSavedReflections();
  }, [currentUser.id]);

  const loadSavedReflections = async () => {
    try {
      const list = await clearSignalsService.getSavedReflections(currentUser.id);
      setSavedReflections(list);
    } catch (err) {
      console.warn('Failed to load saved reflections:', err);
    }
  };

  const handleSelectShortcut = (shortcut: ScenarioShortcut) => {
    setSelectedShortcut(shortcut);
    const item = SCENARIO_SHORTCUTS.find((s) => s.id === shortcut);
    if (item && item.exampleText && !situationText.trim()) {
      setSituationText(item.exampleText);
    }
  };

  const handleAnalyze = () => {
    if (!situationText.trim()) return;

    const result = clearSignalsService.analyzeSituation(
      situationText.trim(),
      selectedShortcut || undefined,
      currentUser.id
    );

    setCurrentReflection(result);
    setSelectedNextStep(result.suggestedNextSteps[0] || null);
    setCustomDraft(result.suggestedNextSteps[0]?.suggestedDraft || '');
    setStep(2);
    setSaveStatus('idle');
  };

  const handleSaveReflection = async () => {
    if (!currentReflection) return;
    setSaveStatus('saving');
    try {
      const res = await clearSignalsService.saveReflection(currentReflection);
      if (res.success && res.data) {
        setCurrentReflection(res.data);
        setSaveStatus('saved');
        await loadSavedReflections();
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  const handleDeleteSaved = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this private reflection?')) {
      await clearSignalsService.deleteReflection(id, currentUser.id);
      await loadSavedReflections();
      if (currentReflection?.id === id) {
        setCurrentReflection(null);
        setStep(1);
      }
    }
  };

  const handleLoadSavedToViewer = (item: ClearSignalsReflection) => {
    setCurrentReflection(item);
    setSituationText(item.situation);
    setSelectedShortcut(item.scenarioShortcut || null);
    setSelectedNextStep(item.suggestedNextSteps[0] || null);
    setCustomDraft(item.suggestedNextSteps[0]?.suggestedDraft || '');
    setStep(2);
    setActiveTab('reflect');
  };

  const handleReset = () => {
    setStep(1);
    setSituationText('');
    setSelectedShortcut(null);
    setCurrentReflection(null);
    setSelectedNextStep(null);
    setCustomDraft('');
    setSaveStatus('idle');
  };

  const handleCopyDraft = () => {
    if (!customDraft) return;
    navigator.clipboard.writeText(customDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ClearSignals • Private Reflection Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              De-Escalate Ambiguity & Clarify Intentions
            </h1>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              When communication gets ambiguous, our minds naturally invent worst-case stories.
              ClearSignals helps you separate what you actually know from unverified assumptions—without blame.
            </p>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs text-stone-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">100% Private to You</p>
              <p className="text-[11px] text-stone-400">Never shared with other users or feeds</p>
            </div>
          </div>
        </div>

        {/* View Switcher: Reflect vs Saved */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('reflect')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reflect'
                ? 'bg-white text-stone-900 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Reflect on a Situation
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-white text-stone-900 shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Reflections ({savedReflections.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'saved' ? (
        /* Saved Reflections Tab */
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Your Private Reflection Journal</h2>
              <p className="text-xs text-stone-500">
                Only you have access to these reflections. You can review, edit, or delete them anytime.
              </p>
            </div>
            <button
              onClick={() => {
                handleReset();
                setActiveTab('reflect');
              }}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              + New Reflection
            </button>
          </div>

          {savedReflections.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-stone-300 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-stone-700">No Saved Reflections Yet</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Reflections are never saved automatically. When you analyze a situation, you can choose to bookmark it privately for future reference.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedReflections.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-2xl p-5 space-y-3 transition-colors relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                        {item.scenarioShortcut?.replace('_', ' ') || 'Custom Situation'}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-stone-800 line-clamp-3 italic">
                      "{item.situation}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
                    <button
                      onClick={() => handleLoadSavedToViewer(item)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      <span>View Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSaved(item.id)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete reflection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Active Reflection Wizard */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
              <span
                className={`flex items-center gap-1.5 ${
                  step === 1 ? 'text-teal-800 font-bold' : 'text-stone-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Describe Situation</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span
                className={`flex items-center gap-1.5 ${
                  step === 2 ? 'text-teal-800 font-bold' : 'text-stone-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Facts vs Assumptions</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span
                className={`flex items-center gap-1.5 ${
                  step === 3 ? 'text-teal-800 font-bold' : 'text-stone-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Next Steps & Drafts</span>
              </span>
            </div>

            {step > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2) : 1))}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-600 flex items-center gap-1"
                  title="Start over"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Start New</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {/* STEP 1: Describe the Situation */}
            {step === 1 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div>
                  <h2 className="text-xl font-heading font-bold text-stone-900">
                    What's making you uncertain?
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Describe what happened in your own words, or select a common scenario below to get started.
                  </p>
                </div>

                {/* Optional Scenario Shortcuts */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Optional Scenario Shortcuts:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SCENARIO_SHORTCUTS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectShortcut(item.id)}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          selectedShortcut === item.id
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/10'
                            : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{item.label}</p>
                          {item.exampleText && (
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              "{item.exampleText}"
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Situation Text Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Your Situation Description:
                    </label>
                    <span className="text-[11px] text-stone-400">
                      {situationText.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={situationText}
                    onChange={(e) => setSituationText(e.target.value)}
                    placeholder="Example: My crush replied 'okay' instead of their usual longer messages. I'm worried they are upset with me..."
                    className="w-full p-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm text-stone-900 leading-relaxed placeholder:text-stone-400"
                  />
                </div>

                {/* Safety & Truth in Software Disclaimer */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3 text-xs text-stone-600">
                  <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Core Principle:</strong> Read receipts and timestamps only prove digital delivery—they never reveal emotional intent or meaning. ClearSignals separates observable evidence from speculation so you can respond calmly.
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={!situationText.trim()}
                    className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-teal-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Analyze & Separate Facts from Assumptions</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Separate Facts from Assumptions */}
            {step === 2 && currentReflection && (
              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Engine Badge & Context Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-900">
                      Cognitive Reframing Heuristic Engine (Rule-based)
                    </span>
                    <p className="text-xs text-teal-800">
                      Analyzing: <span className="font-medium italic">"{currentReflection.situation}"</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 hover:bg-teal-50 text-xs font-semibold text-teal-900 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Situation</span>
                    </button>
                  </div>
                </div>

                {/* 4 Quadrants / Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Quadrant 1: What We Know (Facts) */}
                  <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-3xl p-6 space-y-3">
                    <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </div>
                      <h3>What we know (Observable Events)</h3>
                    </div>
                    <p className="text-[11px] text-emerald-800/80">
                      Objective facts established by your description. Contains zero assumptions about emotional intent.
                    </p>
                    <ul className="space-y-2 pt-1">
                      {currentReflection.facts.map((fact, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quadrant 2: What You Might Be Assuming */}
                  <div className="bg-amber-50/40 border border-amber-200/80 rounded-3xl p-6 space-y-3">
                    <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
                      <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <h3>What you might be assuming</h3>
                    </div>
                    <p className="text-[11px] text-amber-800/80">
                      Subjective interpretations that are not confirmed by observable evidence.
                    </p>
                    <ul className="space-y-2 pt-1">
                      {currentReflection.assumptions.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quadrant 3: Other Possible Explanations */}
                  <div className="bg-purple-50/40 border border-purple-200/80 rounded-3xl p-6 space-y-3">
                    <div className="flex items-center gap-2.5 text-purple-900 font-bold text-sm">
                      <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3>Other possible explanations</h3>
                    </div>
                    <p className="text-[11px] text-purple-800/80">
                      Reasonable alternatives without claiming any single alternative is guaranteed to be true.
                    </p>
                    <ul className="space-y-2 pt-1">
                      {currentReflection.alternativeExplanations.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quadrant 4: What Remains Unknown */}
                  <div className="bg-stone-100/60 border border-stone-200 rounded-3xl p-6 space-y-3">
                    <div className="flex items-center gap-2.5 text-stone-900 font-bold text-sm">
                      <div className="w-7 h-7 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <h3>What remains unknown</h3>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Information required to understand the situation that cannot be known without direct dialog.
                    </p>
                    <ul className="space-y-2 pt-1">
                      {currentReflection.unknowns.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Step 2 Bottom Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveReflection}
                      disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                        saveStatus === 'saved'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-stone-300 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {saveStatus === 'saved' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Saved Privately</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Privately'}</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-stone-400">
                      (Optional: only saved if you choose)
                    </span>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <span>View Next Steps & Message Drafts</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Offer Next Steps */}
            {step === 3 && currentReflection && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                  <h2 className="text-xl font-heading font-bold text-stone-900">
                    What would you like to do next?
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Choose an approach that honors both your boundaries and the other person's autonomy.
                  </p>
                </div>

                {/* 3 Action Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentReflection.suggestedNextSteps.map((option) => {
                    const isSelected = selectedNextStep?.type === option.type;
                    return (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => {
                          setSelectedNextStep(option);
                          setCustomDraft(option.suggestedDraft || '');
                        }}
                        className={`p-5 rounded-3xl border text-left flex flex-col justify-between gap-3 transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/10 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              option.type === 'wait'
                                ? 'bg-amber-100 text-amber-800'
                                : option.type === 'clarify'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {option.type === 'wait'
                              ? 'Option 1: Pause'
                              : option.type === 'clarify'
                              ? 'Option 2: Clarify'
                              : 'Option 3: Express'}
                          </span>
                          <h4 className="font-bold text-sm text-stone-900">{option.label}</h4>
                          <p className="text-xs text-stone-500 leading-relaxed">{option.summary}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 text-[11px] text-teal-700 font-medium">
                          {isSelected ? '✓ Selected' : 'Select path →'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Guidance & Editable Draft */}
                {selectedNextStep && (
                  <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <Compass className="w-4 h-4 text-teal-700" />
                          <span>Guidance for: {selectedNextStep.label}</span>
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {selectedNextStep.guidance}
                        </p>
                      </div>
                    </div>

                    {selectedNextStep.type !== 'wait' && (
                      <div className="space-y-2 pt-2 border-t border-stone-200">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                            <span>Suggested Message Draft (Editable):</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleCopyDraft}
                            className="text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedDraft ? 'Copied!' : 'Copy to Clipboard'}</span>
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={customDraft}
                          onChange={(e) => setCustomDraft(e.target.value)}
                          className="w-full p-3.5 bg-white rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm text-stone-900 leading-relaxed"
                        />
                        <p className="text-[11px] text-stone-400">
                          <strong>Safety Guarantee:</strong> CommonGround will never automatically send this message. You retain full control to edit, copy, or discard it.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3 Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveReflection}
                      disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                        saveStatus === 'saved'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-stone-300 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {saveStatus === 'saved' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Saved Privately</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Privately'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                    >
                      Review Breakdown
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
                    >
                      Start New Reflection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
