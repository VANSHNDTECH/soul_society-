import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Compass,
  Sliders,
  CheckCircle,
  XCircle,
  HelpCircle,
  EyeOff,
  Smile,
  BookOpen,
  Coffee,
  Camera,
  Layers,
} from 'lucide-react';
import { ALL_INTEREST_TAGS } from '../data/mockUsers';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setShowPresentationModal } = useApp();

  // Interactive mini-calculator on landing page
  const [selectedDemoInterests, setSelectedDemoInterests] = useState<string[]>([
    'Specialty Coffee',
    'Analog Photography',
    'Hiking & Trails',
  ]);

  const sampleProfileInterests = ['Specialty Coffee', 'Hiking & Trails', 'Ceramics & Pottery', 'Sci-Fi & Speculative Fiction'];

  const sharedCount = selectedDemoInterests.filter(i => sampleProfileInterests.includes(i)).length;
  const demoScore = Math.min(96, Math.max(35, 45 + sharedCount * 17));

  const toggleInterest = (tag: string) => {
    setSelectedDemoInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Consent-First Social Discovery</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
                Better connections begin with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 underline decoration-teal-300 decoration-wavy decoration-2">
                  common ground
                </span>
                .
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 max-w-2xl font-normal leading-relaxed">
                Discover compatible people through shared interests, intentions, and values — without superficial swiping, popularity contests, or unwanted direct messages.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all group"
                >
                  <span>Find Your People</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('discovery')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm sm:text-base border border-stone-300 shadow-2xs transition-all"
                >
                  <Compass className="w-4 h-4 text-teal-700" />
                  <span>Browse Demo Directory</span>
                </button>

                <button
                  onClick={() => setShowPresentationModal(true)}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-stone-600 hover:text-stone-900 font-medium text-sm transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-stone-400" />
                  <span>How It Works & Design Rationale</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-stone-200/80 flex flex-wrap gap-y-2 gap-x-6 text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> No swiping or hotness scores
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> Mutual consent before any chat
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> Transparent 40/30/20/10 compatibility
                </span>
              </div>
            </div>

            {/* Right Visual: Hero Artwork */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 bg-stone-100 ring-1 ring-stone-900/5 group">
                <img
                  src="/hero.jpg"
                  alt="People connecting meaningfully over books, art, and coffee"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Floating Micro-Card 1: Mutual match notification */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-stone-200/80 text-left max-w-[220px]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 text-xs font-bold">
                      ER
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Elena accepted intro!</p>
                      <p className="text-[10px] text-stone-500">Shared: Ceramics & Coffee</p>
                    </div>
                  </div>
                </div>

                {/* Floating Micro-Card 2: Compatibility Pill */}
                <div className="absolute bottom-4 right-4 bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-stone-700 text-white text-left">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <div>
                      <p className="text-xs font-semibold">88% Compatibility</p>
                      <p className="text-[10px] text-stone-300">Explainable matching</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & The Solution: Side-by-Side Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Why traditional ways of meeting fail us
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600">
            Dating and friend apps were designed around engagement algorithms that commodify attention. CommonGround is built around human comfort, dignity, and shared interests.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Swiping Apps Dilemma */}
          <div className="bg-stone-100/70 border border-stone-200 rounded-2xl p-7 text-left space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
                Traditional Swiping & Social Apps
              </span>
              <XCircle className="w-5 h-5 text-rose-500" />
            </div>

            <ul className="space-y-4 text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <div>
                  <strong className="text-stone-900 block">Appearance-first swiping:</strong>
                  Snap judgments based on curated photos and superficial popularity instead of who someone is.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <div>
                  <strong className="text-stone-900 block">Intention ambiguity:</strong>
                  Users don't know whether another person wants casual dating, a tennis partner, or friendship.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <div>
                  <strong className="text-stone-900 block">Unsolicited direct messages:</strong>
                  Overwhelming inboxes, creepy messages, and privacy concerns that drive people away.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <div>
                  <strong className="text-stone-900 block">Rejection anxiety & ghosting:</strong>
                  Zero-feedback loops make introverts and shy individuals feel invisible or rejected.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <div>
                  <strong className="text-stone-900 block">Black-box algorithms:</strong>
                  Users are ranked by hidden "attractiveness ELO" and manipulated for subscription upsells.
                </div>
              </li>
            </ul>
          </div>

          {/* The CommonGround Way */}
          <div className="bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/50 border-2 border-teal-600/30 rounded-2xl p-7 text-left space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-teal-800 bg-teal-100 px-2.5 py-1 rounded-md">
                The CommonGround Approach
              </span>
              <CheckCircle className="w-5 h-5 text-teal-600" />
            </div>

            <ul className="space-y-4 text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-stone-900 block">Interest & value-first discovery:</strong>
                  Connect over books, photography, gardening, coding, and what actually lights you up.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-stone-900 block">Transparent compatibility:</strong>
                  Clear 40/30/20/10 math explains exactly why you might get along. No mystery AI.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-stone-900 block">Mutual introduction system:</strong>
                  Send low-pressure contextual icebreakers. The other person accepts or quietly declines without penalty.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-stone-900 block">Consent-locked conversations:</strong>
                  No unsolicited direct messages. A private chat unlocks only after mutual agreement.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-600 font-bold shrink-0">✓</span>
                <div>
                  <strong className="text-stone-900 block">Comfort, pace & boundary controls:</strong>
                  Pause discovery anytime, choose your interaction pace, or disconnect with mutual respect.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Compatibility Sandbox */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Interactive Preview</span>
              <h3 className="text-2xl font-bold text-stone-900">How CommonGround Calculates Compatibility</h3>
              <p className="text-sm text-stone-500 mt-1">
                Toggle your interests below to see how compatibility dynamically updates against Elena Rostova's profile.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-3 text-center shrink-0">
              <span className="text-xs font-semibold text-teal-800 uppercase block">Estimated Match</span>
              <span className="text-3xl font-extrabold text-teal-900 font-heading">{demoScore}%</span>
            </div>
          </div>

          <div className="pt-6 space-y-6">
            <div>
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide block mb-3">
                Tap interests to add or remove:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_INTEREST_TAGS.slice(0, 10).map(tag => {
                  const isSelected = selectedDemoInterests.includes(tag);
                  const isShared = sampleProfileInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? isShared
                            ? 'bg-teal-700 text-white shadow-2xs'
                            : 'bg-stone-800 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                      {isShared && isSelected && ' (Mutual!)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation box */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-sm text-stone-700 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-900 text-xs uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Explainable Breakdown for this Demo match</span>
              </div>
              <p className="text-stone-600">
                {sharedCount > 0
                  ? `You and Elena both share: ${selectedDemoInterests.filter(i => sampleProfileInterests.includes(i)).join(', ')}. Shared interests contribute 40% toward discovery alignment.`
                  : 'No direct interest overlaps selected yet. CommonGround will explore compatible intentions (30%) and shared values (20%).'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Engineered for genuine human comfort
          </h2>
          <p className="mt-3 text-stone-600">
            Every feature on CommonGround was intentionally designed to reduce social pressure and protect personal safety.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-stone-900">Interest-First</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Profiles highlight your books, crafts, outdoor passions, and conversational styles rather than photo rankings.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-stone-900">Mutual Introductions</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Send thoughtful invitations with context. Recipients can accept or decline quietly with zero public embarrassment.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-stone-900">Explainable Scores</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every compatibility number is transparent: Interests 40%, Intentions 30%, Values 20%, Communication 10%.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-stone-900">Privacy & Safety</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Pause discovery whenever your social battery is low. Block or report in one tap with dignity.
            </p>
          </div>
        </div>
      </section>

      {/* University Presentation CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 text-left relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Prototype & Design Defense</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              Ready to see CommonGround in action?
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Test onboarding, filter compatible profiles, send an introduction with custom icebreakers, and simulate receiving and accepting requests.
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              <button
                onClick={() => setActiveTab('onboarding')}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-sm shadow-md transition-colors"
              >
                Start Onboarding
              </button>
              <button
                onClick={() => setShowPresentationModal(true)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-colors"
              >
                View Academic Presentation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
