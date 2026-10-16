import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  Sparkles,
  Compass,
  Inbox,
  MessageCircle,
  ShieldCheck,
  Eye,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  HeartHandshake,
  Sliders,
  Scale,
  GraduationCap,
} from 'lucide-react';

interface Module3OverviewProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const Module3Overview: React.FC<Module3OverviewProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    discoverableUsers,
    connections,
    introductions,
    setShowPresentationModal,
    openAuthModal,
    authSession,
  } = useApp();

  // Interactive Mini-Calculator Demo
  const [selectedDemoInterests, setSelectedDemoInterests] = useState<string[]>([
    'Specialty Coffee',
    'Analog Photography',
    'Hiking & Trails',
  ]);

  const sampleProfileInterests = [
    'Specialty Coffee',
    'Hiking & Trails',
    'Ceramics & Pottery',
    'Sci-Fi & Speculative Fiction',
  ];

  const sharedCount = selectedDemoInterests.filter(i => sampleProfileInterests.includes(i)).length;
  const demoScore = Math.min(96, Math.max(35, 42 + sharedCount * 18));

  const toggleInterest = (tag: string) => {
    setSelectedDemoInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const capabilities = [
    {
      id: 'discovery' as ActiveTab,
      title: 'Interest-Based Discovery',
      badge: `${discoverableUsers.length} Profiles Available`,
      description: 'Discover peers based on shared passions, life intentions, and communication pace. No swiping, zero ranking algorithms.',
      icon: <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      color: 'border-teal-200/80 dark:border-teal-800/80 bg-teal-50/50 dark:bg-teal-950/20',
    },
    {
      id: 'requests' as ActiveTab,
      title: 'Mutual Introduction Gate',
      badge: `${introductions.filter(i => i.status === 'pending').length} Pending`,
      description: 'Conversations require mutual opt-in with a context-rich icebreaker note. No cold unsolicited direct messages.',
      icon: <Inbox className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'border-blue-200/80 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/20',
    },
    {
      id: 'chat' as ActiveTab,
      title: 'Active Connections & Chat',
      badge: `${connections.filter(c => c.status === 'active').length} Active`,
      description: 'Direct communication unlocked only after mutual agreement, with boundary reminders and full blocking/reporting tools.',
      icon: <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20',
    },
    {
      id: 'clearsignals' as ActiveTab,
      title: 'ClearSignals Assistant',
      badge: 'Private & Psychological',
      description: 'Private cognitive reflection tool to distinguish observable facts from anxiety-driven assumptions in text communication.',
      icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'border-purple-200/80 dark:border-purple-800/80 bg-purple-50/50 dark:bg-purple-950/20',
    },
    {
      id: 'opensignals' as ActiveTab,
      title: 'OpenSignals Transparency',
      badge: 'Riddle 3 Solved',
      description: 'Inspect exact recommendation factors, toggle matching weights, dismiss profiles, and manage optional AI assistance.',
      icon: <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'border-amber-200/80 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20',
    },
    {
      id: 'safety' as ActiveTab,
      title: 'Privacy & Safety Center',
      badge: 'User Controlled',
      description: 'Manage incognito discovery, pause visibility anytime, view the security audit log, and access reporting controls.',
      icon: <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      color: 'border-rose-200/80 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/20',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      {/* Central Solution Architecture Hero Banner */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border border-stone-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 3: The Solution Architect</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            "How can we engineer a social discovery space where{' '}
            <span className="text-teal-300 underline decoration-teal-400/50 decoration-wavy decoration-2">
              genuine compatibility
            </span>{' '}
            comes first?"
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Module 3 translates the empirical diagnostics of Module 1 and the unmet human needs of Module 2 into an interactive, consent-first platform. Built without manipulative swiping, popularity algorithms, or surveillance ad brokers.
          </p>

          {/* Metric Strip */}
          <div className="pt-4 flex flex-wrap gap-4 text-xs">
            <div className="bg-white/10 dark:bg-stone-800/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-teal-300 font-bold block text-sm">40-30-20-10</span>
              <span className="text-stone-300 text-[11px]">Deterministic Multi-Factor Weights</span>
            </div>
            <div className="bg-white/10 dark:bg-stone-800/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-teal-300 font-bold block text-sm">100% Mutual</span>
              <span className="text-stone-300 text-[11px]">Consent-First Introductions Gate</span>
            </div>
            <div className="bg-white/10 dark:bg-stone-800/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-teal-300 font-bold block text-sm">OpenSignals</span>
              <span className="text-stone-300 text-[11px]">Full Algorithmic Transparency</span>
            </div>
            <div className="bg-white/10 dark:bg-stone-800/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-teal-300 font-bold block text-sm">ClearSignals</span>
              <span className="text-stone-300 text-[11px]">Cognitive Misunderstanding Assistant</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('discovery')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Discoverable Profiles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('opensignals')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-colors border border-white/20"
            >
              <Eye className="w-4 h-4 text-teal-300" />
              <span>OpenSignals Dashboard</span>
            </button>
            <button
              onClick={() => setShowPresentationModal(true)}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs flex items-center gap-1.5 transition-colors border border-stone-700"
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Project Defense</span>
            </button>
          </div>
        </div>
      </section>

      {/* Authenticated Status Banner */}
      {!authSession.isAuthenticated && (
        <section className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
                You are viewing CommonGround in Visitor Mode
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
                You can freely browse discovery profiles, inspect research criteria, and view the OpenSignals transparency panel. To send introductions, chat, or customize your profile, sign in or create an account.
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal('Please sign in or create an account to start connecting.')}
            className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-xs font-bold rounded-xl hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors shrink-0 shadow-xs"
          >
            Sign In or Register
          </button>
        </section>
      )}

      {/* Section: Solution Capabilities Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
            Interactive Solution Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Six cohesive platform features addressing the five empirical barriers diagnosed in Module 1.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap) => (
            <button
              key={cap.id}
              onClick={() => onNavigateTab(cap.id)}
              className={`p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-200 hover:shadow-md group bg-white dark:bg-stone-900 ${cap.color}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-stone-800 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {cap.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-teal-800 dark:text-teal-300">
                <span>Launch Feature</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Section: Interactive Multi-Attribute Compatibility Engine Demonstration */}
      <section className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Interactive Model Demo</span>
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
              The 4-Tier Multi-Attribute Compatibility Engine
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Click interest tags to see how CommonGround deterministically calculates compatibility.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800 px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-700">
            <span className="text-xs text-stone-500 dark:text-stone-400">Calculated Score:</span>
            <span className="font-mono text-xl font-black text-teal-700 dark:text-teal-300">
              {demoScore}%
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Select Your Interests:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Specialty Coffee',
                'Analog Photography',
                'Hiking & Trails',
                'Ceramics & Pottery',
                'Sci-Fi & Speculative Fiction',
                'Board Games',
                'Philosophy',
              ].map(tag => {
                const isSelected = selectedDemoInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {tag}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
              Candidate profile shares: {sampleProfileInterests.join(', ')}.
            </p>
          </div>

          <div className="space-y-3 bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-700">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Algorithm Weight Allocation:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-600 dark:text-stone-400">1. Shared Activity Interests</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">40% Weight</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full w-[40%]" />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-stone-600 dark:text-stone-400">2. Stated Intentions (Friendship, Co-work)</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">30% Weight</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[30%]" />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-stone-600 dark:text-stone-400">3. Human Core Values</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">20% Weight</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[20%]" />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-stone-600 dark:text-stone-400">4. Communication Pace & Style</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">10% Weight</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full w-[10%]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
