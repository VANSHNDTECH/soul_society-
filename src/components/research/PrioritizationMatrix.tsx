import React, { useState } from 'react';
import { TOP_PROBLEMS } from '../../data/researchData';
import { researchService } from '../../services/researchService';
import { useApp } from '../../context/AppContext';
import {
  Scale,
  RotateCcw,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  Save,
  ShieldCheck,
} from 'lucide-react';

interface ProblemScoreState {
  severity: number;
  reach: number;
  evidenceStrength: number;
  opportunity: number;
}

export const PrioritizationMatrix: React.FC = () => {
  const { userRole, isBackendConnected, showToast } = useApp();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state with baseline empirical scores
  const [scores, setScores] = useState<Record<string, ProblemScoreState>>(() => {
    const initial: Record<string, ProblemScoreState> = {};
    TOP_PROBLEMS.forEach(p => {
      initial[p.id] = { ...p.baselineScores };
    });
    return initial;
  });

  // Track if any score has been user-modified
  const isModified = TOP_PROBLEMS.some(p => {
    const current = scores[p.id];
    const base = p.baselineScores;
    return (
      current.severity !== base.severity ||
      current.reach !== base.reach ||
      current.evidenceStrength !== base.evidenceStrength ||
      current.opportunity !== base.opportunity
    );
  });

  const handleSliderChange = (
    problemId: string,
    dimension: keyof ProblemScoreState,
    value: number
  ) => {
    setScores(prev => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        [dimension]: value,
      },
    }));
  };

  const handleReset = () => {
    const resetState: Record<string, ProblemScoreState> = {};
    TOP_PROBLEMS.forEach(p => {
      resetState[p.id] = { ...p.baselineScores };
    });
    setScores(resetState);
    showToast('Reset to default empirical baseline scores.', 'info');
  };

  const handleSaveToDatabase = async () => {
    const isEditor = userRole === 'editor' || userRole === 'admin';
    if (!isEditor) {
      showToast('Read-only mode. Sign in as Editor or Admin (via header) to persist scores to database.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      for (const p of TOP_PROBLEMS) {
        const s = scores[p.id];
        const composite = (s.severity * 0.3) + (s.reach * 0.25) + (s.evidenceStrength * 0.25) + (s.opportunity * 0.2);
        await researchService.updateProblemScore(p.id, {
          severityScore: s.severity,
          reachScore: s.reach,
          evidenceStrengthScore: s.evidenceStrength,
          designOpportunityScore: s.opportunity,
          compositeScore: Number(composite.toFixed(2)),
        });
      }
      showToast('Problem prioritization scores saved successfully to PostgreSQL database.', 'success');
    } catch (e: any) {
      showToast('Error saving scores to database: ' + e.message, 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate composite scores and sort ranking
  const rankedProblems = [...TOP_PROBLEMS].map(p => {
    const s = scores[p.id];
    const totalScore = s.severity + s.reach + s.evidenceStrength + s.opportunity;
    return {
      problem: p,
      scores: s,
      totalScore,
    };
  });

  rankedProblems.sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Multi-Criteria Decision Framework
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
            Problem Prioritization & Ranking Matrix
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Transparent scoring across Severity, Reach, Evidence Strength, and Design Opportunity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isModified && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
          )}

          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 ${
              userRole === 'editor' || userRole === 'admin'
                ? 'bg-teal-800 hover:bg-teal-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
            title={
              userRole === 'editor' || userRole === 'admin'
                ? 'Persist changes to PostgreSQL research_problems table'
                : 'Read-only: Sign in as Editor/Admin to save'
            }
          >
            {isSaving ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : userRole === 'editor' || userRole === 'admin' ? (
              <Save className="w-3.5 h-3.5 text-teal-300" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span>
              {userRole === 'editor' || userRole === 'admin'
                ? isSaving ? 'Saving...' : 'Save Scores to DB'
                : 'Editor Save (Sign In)'}
            </span>
          </button>
        </div>
      </div>

      {/* Epistemic Transparency Notice */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs text-stone-700">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-900 block">Analytical Tool Notice:</strong>
          <p className="mt-0.5">
            This scoring framework is an analytical prioritization heuristic, not an objectively immutable physical law. You can adjust the provisional scores below to observe how different weighting judgments alter the strategic prioritization for Module 2 and Module 3.
          </p>
          {isModified && (
            <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
              ⚡ User-Selected Analytical Judgment: Active scores reflect user adjustments, not primary empirical data.
            </span>
          )}
        </div>
      </div>

      {/* Ranking Summary Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-300" />
            <span>Dynamic Problem Prioritization (Ranked #1 to #5)</span>
          </h2>
          <span className="text-[11px] text-stone-300">Scale: 1 (Lowest) to 5 (Highest) • Max: 20 pts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600">
                <th className="p-3.5 font-bold w-12 text-center">Rank</th>
                <th className="p-3.5 font-bold">Candidate Problem</th>
                <th className="p-3.5 font-bold text-center">Severity (1-5)</th>
                <th className="p-3.5 font-bold text-center">Reach (1-5)</th>
                <th className="p-3.5 font-bold text-center">Evidence (1-5)</th>
                <th className="p-3.5 font-bold text-center">Opportunity (1-5)</th>
                <th className="p-3.5 font-bold text-center">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rankedProblems.map(({ problem, scores: s, totalScore }, idx) => (
                <tr
                  key={problem.id}
                  className={`hover:bg-stone-50/70 transition-colors ${
                    idx === 0 ? 'bg-teal-50/20 font-medium' : ''
                  }`}
                >
                  <td className="p-3.5 text-center font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-heading ${
                        idx === 0
                          ? 'bg-teal-700 text-white'
                          : idx === 1
                          ? 'bg-stone-800 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <strong className="text-stone-900 block text-xs font-heading">
                      {problem.title}
                    </strong>
                    <span className="text-[11px] text-stone-500 line-clamp-1">
                      {problem.tagline}
                    </span>
                  </td>

                  <td className="p-3.5 text-center font-semibold text-stone-800">
                    {s.severity}/5
                  </td>
                  <td className="p-3.5 text-center font-semibold text-stone-800">
                    {s.reach}/5
                  </td>
                  <td className="p-3.5 text-center font-semibold text-stone-800">
                    {s.evidenceStrength}/5
                  </td>
                  <td className="p-3.5 text-center font-semibold text-stone-800">
                    {s.opportunity}/5
                  </td>

                  <td className="p-3.5 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-xl bg-teal-100 text-teal-900 font-bold text-xs font-heading">
                      {totalScore} / 20
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Sliders & Scoring Rationales */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-stone-900 font-heading">
          Adjust Analytical Weights & Inspect Dimension Rationales
        </h3>

        <div className="space-y-4">
          {TOP_PROBLEMS.map(p => {
            const current = scores[p.id];
            const total = current.severity + current.reach + current.evidenceStrength + current.opportunity;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                      Problem 0{p.number}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">
                      {p.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-medium">Composite Score:</span>
                    <span className="text-sm font-extrabold text-teal-900 bg-teal-100 px-3 py-1 rounded-xl font-heading">
                      {total} / 20 pts
                    </span>
                  </div>
                </div>

                {/* 4 Interactive Sliders */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Severity */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700">Severity</span>
                      <strong className="text-stone-900">{current.severity}/5</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={current.severity}
                      onChange={e => handleSliderChange(p.id, 'severity', Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-stone-500 leading-tight">
                      {p.scoreRationale.severity}
                    </p>
                  </div>

                  {/* Reach */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700">Reach</span>
                      <strong className="text-stone-900">{current.reach}/5</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={current.reach}
                      onChange={e => handleSliderChange(p.id, 'reach', Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-stone-500 leading-tight">
                      {p.scoreRationale.reach}
                    </p>
                  </div>

                  {/* Evidence Strength */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700">Evidence Strength</span>
                      <strong className="text-stone-900">{current.evidenceStrength}/5</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={current.evidenceStrength}
                      onChange={e => handleSliderChange(p.id, 'evidenceStrength', Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-stone-500 leading-tight">
                      {p.scoreRationale.evidenceStrength}
                    </p>
                  </div>

                  {/* Opportunity */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700">Design Opportunity</span>
                      <strong className="text-stone-900">{current.opportunity}/5</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={current.opportunity}
                      onChange={e => handleSliderChange(p.id, 'opportunity', Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                    <p className="text-[10px] text-stone-500 leading-tight">
                      {p.scoreRationale.opportunity}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
