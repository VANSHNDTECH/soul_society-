import React from 'react';
import {
  PERSONAS,
  BARRIERS,
  MODULE2_OVERVIEW_META,
  FEATURE_MAPPINGS,
} from '../../data/module2Data';
import { Module2Tab } from '../../types/module2';
import {
  Users,
  Compass,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Heart,
  Eye,
  Sliders,
} from 'lucide-react';

interface Module2OverviewProps {
  onNavigateTab: (tab: Module2Tab) => void;
  onSelectPersona: (personaId: string) => void;
}

export const Module2Overview: React.FC<Module2OverviewProps> = ({
  onNavigateTab,
  onSelectPersona,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      {/* Central Research Question Hero Banner */}
      <section className="bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold tracking-wide border border-purple-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Module 2: The People Left Out</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            "Who struggles to make meaningful connections,{' '}
            <span className="text-purple-300 underline decoration-purple-400/50 decoration-wavy decoration-2">
              and what prevents them?
            </span>
            "
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Existing social paradigms do not fail randomly; they systematically exclude quiet introverts, geographic newcomers, people with niche creative crafts, and individuals with sensory or physical accessibility needs. Module 2 investigates the lived barriers, emotional friction, and unmet needs of these overlooked populations.
          </p>

          {/* Core Metrics Strip */}
          <div className="pt-4 flex flex-wrap gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-purple-300 font-bold block text-sm">3 Personas</span>
              <span className="text-stone-300 text-[11px]">Evidence-Informed Archetypes</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-purple-300 font-bold block text-sm">5 Categories</span>
              <span className="text-stone-300 text-[11px]">Cross-Cutting Human Barriers</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-purple-300 font-bold block text-sm">7 Feature Mappings</span>
              <span className="text-stone-300 text-[11px]">Traceable to Module 3 Prototype</span>
            </div>
          </div>
        </div>
      </section>

      {/* Human-Centered Research Disclaimer */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>Epistemic Standard for Personas</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          The personas presented in this module represent <strong>structured research hypotheses</strong> derived from sociological and demographic literature. They illustrate distinct configurations of social barriers without stereotyping. Before production deployment, these personas should be validated through primary qualitative fieldwork (interview protocol provided in Section 7).
        </p>
      </section>

      {/* The 3 Core Personas At A Glance */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-heading">
              Three Personas: The People Overlooked
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Select any persona to inspect their empathy map, daily workarounds, and unmet needs.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('personas')}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-800 hover:text-purple-950 self-start sm:self-center"
          >
            <span>Open Interactive Persona Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PERSONAS.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100"
                  />
                  <div>
                    <h3 className="font-bold text-base text-stone-900 font-heading">
                      {p.name}, {p.age}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 px-2 py-0.5 rounded-md border border-purple-100">
                      {p.archetype}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                  "{p.illustrativeQuote}"
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-stone-900 block text-[11px] uppercase tracking-wider">
                      Primary Goal:
                    </strong>
                    <p className="text-stone-600 line-clamp-2">{p.primaryGoal}</p>
                  </div>

                  <div>
                    <strong className="text-rose-900 block text-[11px] uppercase tracking-wider">
                      Main Frustration:
                    </strong>
                    <p className="text-stone-600 line-clamp-2">{p.painPoints[0]}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex gap-1">
                  {p.primaryBarriers.map(b => (
                    <span
                      key={b}
                      className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onSelectPersona(p.id);
                    onNavigateTab('personas');
                  }}
                  className="text-xs font-bold text-purple-800 hover:text-purple-950 flex items-center gap-1 group"
                >
                  <span>Explore Persona</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 5 Barrier Categories Summary */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-heading">
              The 5 Invisible Barrier Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Examining the emotional, structural, discovery, accessibility, and safety walls preventing connection.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('barriers')}
            className="flex items-center gap-1.5 text-xs font-bold text-purple-800 hover:text-purple-950"
          >
            <span>Inspect All Barriers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              cat: 'Emotional',
              desc: 'Rejection fear, vulnerability anxiety, and small-talk exhaustion.',
              color: 'text-rose-700 bg-rose-50 border-rose-200',
            },
            {
              cat: 'Structural',
              desc: 'Time poverty, venue costs, and relocation network deficits.',
              color: 'text-amber-700 bg-amber-50 border-amber-200',
            },
            {
              cat: 'Discovery',
              desc: 'Photo-first lookism, hidden niche passions, and insular circles.',
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              cat: 'Accessibility & Inclusion',
              desc: 'Sensory overload, forced health disclosure, and rigid pacing.',
              color: 'text-purple-700 bg-purple-50 border-purple-200',
            },
            {
              cat: 'Trust & Safety',
              desc: 'Unsolicited messages, difficulty exiting awkward chats, and privacy risks.',
              color: 'text-teal-700 bg-teal-50 border-teal-200',
            },
          ].map(item => (
            <button
              key={item.cat}
              onClick={() => onNavigateTab('barriers')}
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all hover:scale-102 ${item.color}`}
            >
              <h4 className="font-bold text-xs uppercase tracking-wider">{item.cat}</h4>
              <p className="text-[11px] leading-relaxed text-stone-700">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Human Needs to Product Features Banner */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-teal-50/50 rounded-3xl border border-purple-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-900">
            <Lightbulb className="w-4 h-4 text-purple-700" />
            <span>Connecting Needs to CommonGround Features</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            From Human Vulnerability to Consent-First Architecture
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every feature in the CommonGround prototype is a direct design hypothesis addressing the specific unmet needs of Aanya, Rohan, and Meera.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('opportunities')}
          className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-purple-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          View Feature Mapping Matrix
        </button>
      </section>
    </div>
  );
};
