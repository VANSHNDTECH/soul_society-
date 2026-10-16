import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Eye,
  Sliders,
  ShieldCheck,
  Sparkles,
  Lock,
  Compass,
  Scale,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  UserX,
  FileText,
  Info,
  ExternalLink,
  MessageSquare,
  Shield,
  Layers,
} from 'lucide-react';

export const OpenSignalsView: React.FC = () => {
  const {
    currentUser,
    influenceSettings,
    updateInfluenceSettings,
    updatePrivacySettings,
    dismissedUserIds,
    resetDismissedUsers,
    setActiveTab,
    setReportTargetUser,
  } = useApp();

  const isPaused = currentUser.privacySettings.discoveryPaused;

  const toggleFactor = (key: keyof typeof influenceSettings) => {
    updateInfluenceSettings({ [key]: !influenceSettings[key] });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Eye className="w-3.5 h-3.5" />
              <span>OpenSignals • Transparent Connections</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Understand What Influences Your Connections
            </h1>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              CommonGround helps you discover people and communicate more clearly. You deserve to
              understand why connections are suggested, when AI helps with communication, and how
              your information is used.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs text-stone-200">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Riddle 3: The Third Voice</p>
              <p className="text-[11px] text-stone-400">Neutral, user-controlled mediation</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">Explainable Recommendations</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every suggested person displays an audited factor breakdown. No black-box algorithms or
            surprise recommendations.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">AI Disclosure & Control</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            AI assistance is completely optional. Whenever an AI or heuristic draft is prepared, its
            involvement is visibly disclosed.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-stone-900">User-Governed Influence</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            You decide which factors count. Turn off interest matching, value matching, or pause
            discovery whenever you wish.
          </p>
        </div>
      </div>

      {/* Section C: Your Control and Transparency Settings */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-md">
            Interactive Controls
          </span>
          <h2 className="text-xl font-heading font-extrabold text-stone-900 mt-2">
            Your Control and Transparency Settings
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Toggle real behavioral switches that govern recommendations and assistive tools.
          </p>
        </div>

        {/* 1. AI Assistance Master Toggle */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <h4 className="font-bold text-sm text-stone-900">
                Optional AI & Heuristic Drafting Assistance
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  influenceSettings.aiAssistanceEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {influenceSettings.aiAssistanceEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
              When enabled, ClearSignals offers non-accusatory message drafts and tone adjustments
              inside conversations. When disabled, drafting tools are completely switched off.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleFactor('aiAssistanceEnabled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              influenceSettings.aiAssistanceEnabled
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            {influenceSettings.aiAssistanceEnabled ? 'Disable AI Assistance' : 'Enable AI Assistance'}
          </button>
        </div>

        {/* 2. Recommendation Influence Weights Switchboard */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-stone-900">
                Categories Used for Recommendations
              </h4>
              <p className="text-xs text-stone-500">
                Choose which personal factors influence who appears in your Discovery feed:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Factor 1: Shared Interests */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                influenceSettings.useInterestsInMatching
                  ? 'border-teal-300 bg-teal-50/40'
                  : 'border-stone-200 bg-stone-50/60 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-xs text-stone-900">
                    1. Shared Passions & Interests (40% Weight)
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Matches you with members who share tags like{' '}
                  {currentUser.interests.slice(0, 2).join(', ')}.
                </p>
              </div>
              <input
                type="checkbox"
                checked={influenceSettings.useInterestsInMatching}
                onChange={() => toggleFactor('useInterestsInMatching')}
                className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500 mt-1 cursor-pointer"
              />
            </div>

            {/* Factor 2: Stated Intentions */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                influenceSettings.useIntentionsInMatching
                  ? 'border-teal-300 bg-teal-50/40'
                  : 'border-stone-200 bg-stone-50/60 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span className="font-bold text-xs text-stone-900">
                    2. Stated Intentions (30% Weight)
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Requires aligned relationship goals (e.g., platonic friendship vs dating).
                </p>
              </div>
              <input
                type="checkbox"
                checked={influenceSettings.useIntentionsInMatching}
                onChange={() => toggleFactor('useIntentionsInMatching')}
                className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500 mt-1 cursor-pointer"
              />
            </div>

            {/* Factor 3: Core Values */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                influenceSettings.useValuesInMatching
                  ? 'border-teal-300 bg-teal-50/40'
                  : 'border-stone-200 bg-stone-50/60 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="font-bold text-xs text-stone-900">
                    3. Shared Core Values (20% Weight)
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Aligns on philosophical values like Authenticity and Curiosity.
                </p>
              </div>
              <input
                type="checkbox"
                checked={influenceSettings.useValuesInMatching}
                onChange={() => toggleFactor('useValuesInMatching')}
                className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500 mt-1 cursor-pointer"
              />
            </div>

            {/* Factor 4: Communication Pacing & Energy */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                influenceSettings.useCommunicationPaceInMatching
                  ? 'border-teal-300 bg-teal-50/40'
                  : 'border-stone-200 bg-stone-50/60 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-xs text-stone-900">
                    4. Pacing & Social Energy (10% Weight)
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Matches your preferred rhythm: "{currentUser.communicationPreferences.pace}".
                </p>
              </div>
              <input
                type="checkbox"
                checked={influenceSettings.useCommunicationPaceInMatching}
                onChange={() => toggleFactor('useCommunicationPaceInMatching')}
                className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500 mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Dismissed Recommendations Reset */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-stone-900 flex items-center gap-2">
              <UserX className="w-4 h-4 text-stone-500" />
              <span>Dismissed Recommendations ({dismissedUserIds.length})</span>
            </h4>
            <p className="text-[11px] text-stone-500">
              Profiles you have hidden during this session will not be shown in Discovery.
            </p>
          </div>

          <button
            type="button"
            disabled={dismissedUserIds.length === 0}
            onClick={resetDismissedUsers}
            className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 disabled:opacity-40 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore All Dismissed</span>
          </button>
        </div>

        {/* 4. Data Lifecycle & Privacy Audit Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-700" />
            <span>Data Lifecycle & Storage Guarantees</span>
          </h4>

          <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-200 text-xs">
            <div className="p-4 bg-stone-50/70 grid grid-cols-1 md:grid-cols-3 gap-2">
              <strong className="text-stone-900">Data Category</strong>
              <strong className="text-stone-900">Storage Policy</strong>
              <strong className="text-stone-900">Third-Party & Access Boundaries</strong>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-white">
              <span className="font-semibold text-teal-900">Private Reflections (ClearSignals)</span>
              <span className="text-stone-600">
                Only saved if you explicitly bookmark them. Stored under Row Level Security.
              </span>
              <span className="text-emerald-800 font-medium">
                100% private to you. Never shared with conversation partners or third parties.
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-white">
              <span className="font-semibold text-teal-900">Direct Chat Messages</span>
              <span className="text-stone-600">
                Persisted in PostgreSQL `messages` table for active connections.
              </span>
              <span className="text-stone-700">
                Readable only by the 2 mutual connection participants. TLS in transit.
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2 bg-white">
              <span className="font-semibold text-teal-900">Discovery Matching Telemetry</span>
              <span className="text-stone-600">
                Computed deterministically in-memory during page render.
              </span>
              <span className="text-stone-700">
                Zero third-party trackers, cookies, or data brokers. Never sold to advertisers.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature D: How CommonGround Makes Recommendations */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 text-stone-900 shadow-sm">
        <div className="border-b border-stone-200/80 pb-3 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
              Algorithmic Transparency
            </span>
            <h3 className="text-lg font-heading font-extrabold text-stone-900 mt-1">
              How CommonGround Makes Recommendations
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('discovery')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>Go to Discovery →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-700" />
              <span>Multi-Attribute Matching (Not Machine Learning)</span>
            </h4>
            <p>
              Unlike swipe apps that train black-box models on facial attractiveness, response speed,
              or app engagement time, CommonGround uses <strong>purely deterministic multi-attribute matching</strong>.
            </p>
            <p>
              Your score is a mathematical sum of transparent overlaps:{' '}
              <strong>40% Shared Interests + 30% Intentions + 20% Values + 10% Social Pacing</strong>.
              Nothing is hidden. If you see an 85% match, it means 85 points of stated overlap were found.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-700" />
              <span>No Mind-Reading or Romantic Predictions</span>
            </h4>
            <p>
              CommonGround explicitly refrains from claiming that any algorithm can predict
              chemistry, mutual attraction, or personal affection.
            </p>
            <p>
              Recommendations exist solely to provide <strong>organic common ground</strong> for
              thoughtful, low-pressure mutual introductions. Real connection requires authentic
              human conversation.
            </p>
          </div>
        </div>

        {/* Community Data Source Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Honest Data Notice:</strong> In this development prototype, initial recommendations
            include illustrative community archetypes (e.g. Maya, Marcus, Elena, Aisha, Julian) alongside
            live database accounts. Profiles clearly label whether they originate from the live PostgreSQL database
            or the bundled research sandbox.
          </p>
        </div>
      </div>

      {/* Trust & Safety Navigation Strip */}
      <div className="p-5 bg-white rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-stone-900">Need Immediate Safety Controls?</h4>
            <p className="text-[11px] text-stone-500">
              Block harassing users, view active blocks, or file confidential moderation reports.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('safety')}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          Open Safety Center →
        </button>
      </div>
    </div>
  );
};
