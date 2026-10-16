import React, { useState } from 'react';
import { RESEARCH_GAPS, INTERVIEW_QUESTIONS } from '../../data/researchData';
import {
  HelpCircle,
  FileQuestion,
  Users,
  Compass,
  CheckCircle2,
  AlertCircle,
  PenTool,
  RotateCcw,
} from 'lucide-react';

export const ResearchGapsAndInterviews: React.FC = () => {
  // Qualitative Field Notes scratchpad for primary research teams
  const [fieldNotes, setFieldNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('commonground_field_notes_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeQuestionId, setActiveQuestionId] = useState<string>(INTERVIEW_QUESTIONS[0].id);

  const handleNoteChange = (questionId: string, text: string) => {
    const updated = { ...fieldNotes, [questionId]: text };
    setFieldNotes(updated);
    localStorage.setItem('commonground_field_notes_v1', JSON.stringify(updated));
  };

  const clearNotes = () => {
    if (window.confirm('Clear all local interview observation notes?')) {
      setFieldNotes({});
      localStorage.removeItem('commonground_field_notes_v1');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          Unanswered Inquiries & Primary Protocol
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
          Research Gaps & Qualitative Interview Guide
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Identifying deficits in existing literature and providing an interview protocol for upcoming user studies.
        </p>
      </div>

      {/* SECTION 1: The 5 Major Unanswered Research Gaps */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-heading flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-teal-700" />
            <span>Critical Gaps in Current Social Computing Literature</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Where existing published research stops, and what primary empirical studies must investigate next.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_GAPS.map(gap => (
            <div
              key={gap.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  {gap.targetDemographic}
                </span>

                <h3 className="font-bold text-sm text-stone-900 leading-snug font-heading">
                  {gap.title}
                </h3>

                <p className="text-xs font-semibold text-stone-800 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
                  "{gap.question}"
                </p>

                <div className="space-y-1 text-xs text-stone-600">
                  <strong className="text-stone-800 block text-[11px] uppercase tracking-wider">
                    Current Evidence Deficit:
                  </strong>
                  <p className="leading-relaxed">{gap.currentEvidenceDeficit}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 text-[11px] text-teal-950 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                <strong className="text-teal-900 block font-bold text-[10px] uppercase">
                  Recommended Primary Methodology:
                </strong>
                <p className="mt-0.5">{gap.recommendedMethodology}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Standardized Qualitative Interview Protocol */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-heading flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-teal-700" />
              <span>Standardized 7-Question Qualitative Interview Guide</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Approved questions for semi-structured student field interviews. Answers are never fabricated; use the scratchpad below to log real user findings.
            </p>
          </div>

          {Object.keys(fieldNotes).length > 0 && (
            <button
              onClick={clearNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Field Notes</span>
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column: Questions List */}
          <div className="lg:col-span-6 space-y-3">
            {INTERVIEW_QUESTIONS.map(q => {
              const isSelected = q.id === activeQuestionId;
              const hasNotes = Boolean(fieldNotes[q.id]?.trim());

              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Question 0{q.number}
                    </span>
                    {hasNotes && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        Notes Recorded
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                    "{q.question}"
                  </h4>

                  <div className="text-[11px] text-stone-500 space-y-1 pt-1 border-t border-stone-100">
                    <p><strong>Rationale:</strong> {q.researchRationale}</p>
                    <p className="text-teal-800"><strong>What to Listen For:</strong> {q.whatToObserve}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Question Field Notes Scratchpad */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            {(() => {
              const activeQ = INTERVIEW_QUESTIONS.find(q => q.id === activeQuestionId) || INTERVIEW_QUESTIONS[0];
              const noteText = fieldNotes[activeQ.id] || '';

              return (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                        Interview Scratchpad: Question #{activeQ.number}
                      </span>
                      <span className="text-xs text-stone-400">Persisted locally in browser</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">
                      "{activeQ.question}"
                    </h3>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                      <strong className="text-stone-900 block text-[11px] uppercase tracking-wider">
                        Investigator Guidance:
                      </strong>
                      <p>{activeQ.whatToObserve}</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Primary Observation Notes (Participant Quotes & Behavioral Cues)
                      </label>
                      <textarea
                        rows={9}
                        value={noteText}
                        onChange={e => handleNoteChange(activeQ.id, e.target.value)}
                        placeholder="Record participant responses, specific frustrations, quotes, or recurring patterns here during user interview sessions..."
                        className="w-full p-4 rounded-2xl border border-stone-200 text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                    <strong>Integrity Rule:</strong> Answers are left blank until real qualitative fieldwork is conducted with participants. Do not fabricate quotes or pretend user tests have occurred prior to lab sessions.
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>
    </div>
  );
};
