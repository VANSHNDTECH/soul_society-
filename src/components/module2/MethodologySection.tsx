import React, { useState } from 'react';
import {
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  METHODOLOGY_STAGES,
  EPISTEMIC_CATEGORIES,
  VALIDATION_QUESTIONS,
  ACADEMIC_REFERENCES,
} from '../../data/module2Data';

export const MethodologySection: React.FC = () => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string>('val-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatedNotes, setSimulatedNotes] = useState<Record<string, string>>({
    'val-1': 'Participant notes relying on large lecture classes, but says sitting next to someone rarely leads to conversation unless forced by group work.',
    'val-2': 'Reported freezing up because they don’t know if the other person is already part of a tight social circle and wants to be left alone.',
  });

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNoteChange = (id: string, text: string) => {
    setSimulatedNotes((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-slate-800 to-stone-900 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Human-Centered Design (HCD) & Epistemic Rigor
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Research Methodology & Validation Framework
          </h2>
          <p className="text-stone-300 text-base md:text-lg leading-relaxed">
            Module 2 follows an evidence-informed Human-Centered Design process to uncover the invisible
            barriers of social exclusion. To maintain academic and scientific integrity, we explicitly distinguish
            peer-reviewed population evidence from qualitative field notes, provisional persona hypotheses, and
            proposed product solutions.
          </p>
        </div>
      </div>

      {/* 4-Tier Epistemic Distinction Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              1. Epistemic Transparency Framework
            </h3>
            <p className="text-stone-600 text-sm">
              Clear classification distinguishing verified population facts from research hypotheses and proposed designs.
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full border border-stone-200 self-start md:self-auto">
            Academic Integrity Mandate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EPISTEMIC_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.badgeColor}`}>
                    Tier {idx + 1}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">Status: Documented</span>
                </div>
                <h4 className="text-lg font-bold text-stone-900 font-serif">{cat.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{cat.definition}</p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Examples in this Dashboard:
                </p>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {cat.examplesInDashboard.map((ex, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-600 mt-0.5">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Stage HCD Process */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-2xl font-serif font-bold text-stone-900">
            2. The 6-Stage Research & Persona Process
          </h3>
          <p className="text-stone-600 text-sm">
            Step-by-step methodology used to synthesize secondary research into actionable personas and product features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METHODOLOGY_STAGES.map((stage) => (
            <div
              key={stage.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-teal-500/50 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold font-mono text-sm flex items-center justify-center border border-teal-200">
                    0{stage.stageNumber}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400">
                    Phase {stage.stageNumber} of 6
                  </span>
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">{stage.title}</h4>
                <p className="text-stone-600 text-xs leading-relaxed">{stage.description}</p>

                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Core Activities:
                  </p>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {stage.activities.map((act, actIdx) => (
                      <li key={actIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                    Output Deliverable
                  </span>
                  <span className="text-xs font-medium text-stone-800">{stage.outputArtifact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 italic">
                  <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span>{stage.rigorNote}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Interview Protocol & Field Notes Simulator */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              3. Qualitative Interview Protocol for Persona Validation
            </h3>
            <p className="text-stone-600 text-sm">
              Standardized 6-question qualitative interview guide designed to test and validate our provisional personas.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Field Testing Protocol Ready
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-sm text-stone-700 leading-relaxed flex items-start gap-3">
          <ClipboardCheck className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-900">How to use this protocol: </span>
            In a university study setting, researchers conduct 30–45 minute semi-structured interviews with 12–15
            participants matching our demographic categories. Below is the standardized question bank with follow-up
            probes, validation goals, and an interactive field note scratchpad for trial sessions.
          </div>
        </div>

        <div className="space-y-4">
          {VALIDATION_QUESTIONS.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded ? 'border-teal-500 shadow-md ring-1 ring-teal-500/20' : 'border-stone-200 hover:border-stone-300 shadow-sm'
                }`}
              >
                <div
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  onClick={() => setExpandedQuestionId(isExpanded ? '' : q.id)}
                >
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-900 font-bold font-mono text-sm flex items-center justify-center flex-shrink-0">
                      Q{q.number}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md border border-stone-200">
                          {q.targetFocus}
                        </span>
                      </div>
                      <h4 className="text-base md:text-lg font-serif font-bold text-stone-900">
                        "{q.question}"
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyQuestion(q.id, q.question);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Copy question text"
                    >
                      {copiedId === q.id ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <div className="p-1.5 text-stone-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* What to validate */}
                      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                          Research Objective & Validation Target
                        </span>
                        <p className="text-stone-700 text-xs leading-relaxed">{q.whatToValidate}</p>
                      </div>

                      {/* Follow up probes */}
                      <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
                          Suggested Probing Follow-Ups
                        </span>
                        <ul className="space-y-1.5 text-xs text-stone-700">
                          {q.probeFollowUps?.map((probe, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold mt-0.5">›</span>
                              <span>{probe}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Interactive Field Note Simulator */}
                    <div className="bg-white rounded-xl p-4 border border-stone-200">
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor={`note-${q.id}`}
                          className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                          Field Notes & Participant Observations (Live University Scratchpad)
                        </label>
                        <span className="text-[11px] text-stone-400 italic">Stored locally in session</span>
                      </div>
                      <textarea
                        id={`note-${q.id}`}
                        rows={2}
                        value={simulatedNotes[q.id] || ''}
                        onChange={(e) => handleNoteChange(q.id, e.target.value)}
                        placeholder="Type observation notes or participant quotes observed during validation testing..."
                        className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Credible Academic References */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              4. Credible Academic References & Empirical Citations
            </h3>
            <p className="text-stone-600 text-sm">
              Primary peer-reviewed publications and institutional reports substantiating Module 2's problem formulation.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-stone-100 text-stone-700 rounded-full border border-stone-200">
            6 Peer-Reviewed Sources
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACADEMIC_REFERENCES.map((ref) => (
            <div
              key={ref.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                    {ref.year}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">Academic Source</span>
                </div>
                <h4 className="text-base font-serif font-bold text-stone-900 leading-snug">
                  {ref.title}
                </h4>
                <p className="text-xs text-stone-600 italic">
                  {ref.authors} ({ref.year}) — <span className="font-semibold text-stone-700">{ref.publication}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Relevance to Persona Modeling & Requirements:
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">{ref.relevanceToPersonas}</p>
                </div>

                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline transition-colors"
                >
                  <span>Access official report or DOI citation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
