import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Sliders,
  Scale,
  Users,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Layers,
  Compass,
} from 'lucide-react';

export const AcademicPresentationModal: React.FC = () => {
  const { showPresentationModal, setShowPresentationModal } = useApp();

  const [activeSlide, setActiveSlide] = useState<number>(0);

  if (!showPresentationModal) return null;

  const slides = [
    {
      title: '1. Problem Statement & Social Diagnosis',
      tag: 'Research Foundation',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl">
            <h4 className="font-bold text-rose-950 text-sm mb-1">
              "What is going wrong in how people come to meet, and for whom?"
            </h4>
            <p className="text-rose-900 text-xs">
              Existing social and dating mechanisms fail modern humans across multiple structural dimensions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-xs uppercase tracking-wide">
                1. Lookism & Gamified Swiping
              </strong>
              <p className="text-xs text-stone-600">
                Traditional apps treat human beings like playing cards, forcing split-second judgments based on edited photos and superficial popularity rather than character or hobbies.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-xs uppercase tracking-wide">
                2. Intention Mismatch & Ambiguity
              </strong>
              <p className="text-xs text-stone-600">
                People enter platforms with conflicting goals (platonic friends vs hookups vs activity partners) without upfront clarity, leading to awkward clashes.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-xs uppercase tracking-wide">
                3. Exclusion of Introverts & Neurodivergent People
              </strong>
              <p className="text-xs text-stone-600">
                Those with social anxiety, lower social batteries, or niche passions feel overwhelmed by relentless notifications, unsolicited messages, and high rejection exposure.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <strong className="text-stone-900 block text-xs uppercase tracking-wide">
                4. Safety Concerns & Harassment
              </strong>
              <p className="text-xs text-stone-600">
                Unsolicited direct messaging creates privacy risks and boundary violations, driving thoughtful participants away from digital discovery.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2. The CommonGround Solution Architecture',
      tag: 'System Design',
      icon: <Lightbulb className="w-5 h-5 text-teal-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            CommonGround reimagines social discovery from the ground up by replacing superficial swipe-loops with an <strong>intentional, consent-first community</strong>.
          </p>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
              <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                A
              </span>
              <h5 className="font-bold text-stone-900 text-xs">Shared Interests First</h5>
              <p className="text-stone-600 text-[11px]">
                Users connect over specific activities (pottery, bouldering, sci-fi, photography) rather than curated selfies.
              </p>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
              <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                B
              </span>
              <h5 className="font-bold text-stone-900 text-xs">Mutual Consent Gate</h5>
              <p className="text-stone-600 text-[11px]">
                No unsolicited DMs. An invitation contains a contextual icebreaker, and the recipient accepts or quietly declines with zero public rejection count.
              </p>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
              <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                C
              </span>
              <h5 className="font-bold text-stone-900 text-xs">Anti-Gamification</h5>
              <p className="text-stone-600 text-[11px]">
                No likes, no follower tallies, no attractiveness ELO scores, and no artificial urgency or paywalled features.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '3. Transparent Explainable Compatibility Model',
      tag: 'Mathematical Rigor',
      icon: <Scale className="w-5 h-5 text-purple-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            Instead of opaque neural networks or engagement-maximizing algorithms that prioritize addiction, CommonGround implements a <strong>transparent, explainable formula</strong>:
          </p>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 p-2 rounded-lg">
              <span>Shared Interests (Activities & Passions)</span>
              <strong>40% Weight</strong>
            </div>
            <div className="flex items-center justify-between text-teal-800 bg-teal-50 p-2 rounded-lg">
              <span>Compatible Intentions (Friendship / Activity / Dating)</span>
              <strong>30% Weight</strong>
            </div>
            <div className="flex items-center justify-between text-purple-800 bg-purple-50 p-2 rounded-lg">
              <span>Shared Core Values (Empathy, Calm, Learning)</span>
              <strong>20% Weight</strong>
            </div>
            <div className="flex items-center justify-between text-amber-800 bg-amber-50 p-2 rounded-lg">
              <span>Communication Preferences (Pace, Style, Energy)</span>
              <strong>10% Weight</strong>
            </div>
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 text-xs space-y-1">
            <strong>Ethical & Academic Guarantee:</strong>
            <p>
              The platform never uses sensitive personal characteristics (such as race, religion, sexual orientation, or physical appearance) to rank users. The score is framed strictly as an estimated conversation starter, never a deterministic claim of romantic destiny.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '4. Inclusivity, Boundaries & Psychological Safety',
      tag: 'Human Factors',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            How CommonGround protects vulnerable, introverted, and neurodivergent participants:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">Quiet Declines with Zero Public Penalty</strong>
                <p className="text-xs text-stone-600">
                  When someone declines an introduction, the sender receives no notification of rejection. There is no public rejection ledger or penalty to discovery ranking.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">Pacing Honesty & Low Social Battery Controls</strong>
                <p className="text-xs text-stone-600">
                  Members explicitly set their pace ("Gradual & thoughtful" vs "Quick"). Furthermore, a 1-tap "Pause Discovery" allows users to step back without deleting their profile.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">Graceful Disconnection with Mutual Dignity</strong>
                <p className="text-xs text-stone-600">
                  Either party in a chat can pause or end a connection at any time without confrontation or hostile backlash.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '5. Prototype Limitations & Future Research',
      tag: 'Academic Honesty',
      icon: <Layers className="w-5 h-5 text-stone-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            As a university demonstration prototype, CommonGround acknowledges key socio-technical trade-offs:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block text-xs">1. Stated vs. Revealed Preferences</strong>
              <p className="text-xs text-stone-600 mt-0.5">
                Users may describe their values aspirational rather than actual. Future research should evaluate how real behavior mirrors stated onboarding profiles.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block text-xs">2. Cold-Start Network Effects</strong>
              <p className="text-xs text-stone-600 mt-0.5">
                Interest-first discovery requires density within a geographic radius. Niche hobby matchmaking functions best when seeded within existing interest-based clubs and universities.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block text-xs">3. Transition to Offline In-Person Safety</strong>
              <p className="text-xs text-stone-600 mt-0.5">
                While digital chat is consent-gated, future releases should integrate physical meet-up verification (e.g. verified public third-place partners such as community kilns, libraries, or climbing gyms).
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                University Presentation & Defense Guide
              </span>
              <h2 className="text-xl font-bold">How CommonGround Works</h2>
            </div>
          </div>

          <button
            onClick={() => setShowPresentationModal(false)}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide navigation pills */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                activeSlide === idx
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              {idx + 1}. {s.tag}
            </button>
          ))}
        </div>

        {/* Active Slide Body */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            {slides[activeSlide].icon}
            <h3 className="font-bold text-base text-stone-900">{slides[activeSlide].title}</h3>
          </div>

          {slides[activeSlide].content}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 font-medium">
            Slide {activeSlide + 1} of {slides.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
              className="px-4 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-30 transition-colors"
            >
              Previous
            </button>

            {activeSlide < slides.length - 1 ? (
              <button
                onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
                className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Next Section
              </button>
            ) : (
              <button
                onClick={() => setShowPresentationModal(false)}
                className="px-5 py-1.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-colors"
              >
                Close Presentation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
