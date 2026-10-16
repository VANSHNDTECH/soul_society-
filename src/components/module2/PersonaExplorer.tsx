import React, { useState, useEffect } from 'react';
import { PERSONAS } from '../../data/module2Data';
import { personaService } from '../../services/personaService';
import { useApp } from '../../context/AppContext';
import { PersonaItem } from '../../types/module2';
import {
  Users,
  Target,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Edit3,
  Save,
  X,
} from 'lucide-react';

interface PersonaExplorerProps {
  selectedPersonaId: string;
  onSelectPersona: (id: string) => void;
}

export const PersonaExplorer: React.FC<PersonaExplorerProps> = ({
  selectedPersonaId,
  onSelectPersona,
}) => {
  const { userRole, showToast } = useApp();
  const [personasList, setPersonasList] = useState<PersonaItem[]>(PERSONAS);
  const [viewMode, setViewMode] = useState<'detail' | 'comparison'>('detail');
  const [activeEmpathyQuadrant, setActiveEmpathyQuadrant] = useState<'all' | 'says' | 'thinks' | 'does' | 'feels'>('all');
  
  // Editing state for authorized editors
  const [isEditing, setIsEditing] = useState(false);
  const [editQuote, setEditQuote] = useState('');
  const [editPrimaryGoal, setEditPrimaryGoal] = useState('');
  const [editContext, setEditContext] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load from database on mount
  useEffect(() => {
    personaService.getPersonas().then(data => {
      if (data && data.length > 0) {
        setPersonasList(data);
      }
    });
  }, []);

  const currentPersona =
    personasList.find(p => p.id === selectedPersonaId) || personasList[0];

  const handleStartEdit = () => {
    if (userRole !== 'editor' && userRole !== 'admin') {
      showToast('Read-only view. Sign in as Editor/Admin (via top header) to edit personas.', 'info');
      return;
    }
    setEditQuote(currentPersona.illustrativeQuote);
    setEditPrimaryGoal(currentPersona.primaryGoal);
    setEditContext(currentPersona.context);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const success = await personaService.updatePersona(currentPersona.id, {
        illustrativeQuote: editQuote,
        primaryGoal: editPrimaryGoal,
        context: editContext,
      });

      if (success) {
        setPersonasList(prev =>
          prev.map(p =>
            p.id === currentPersona.id
              ? {
                  ...p,
                  illustrativeQuote: editQuote,
                  primaryGoal: editPrimaryGoal,
                  context: editContext,
                }
              : p
          )
        );
        showToast('Persona details updated and persisted to database.', 'success');
        setIsEditing(false);
      } else {
        showToast('Could not save persona changes.', 'warning');
      }
    } catch (e: any) {
      showToast('Error saving persona: ' + e.message, 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
            Human-Centered Personas
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
            Persona Explorer: The People Left Out
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Investigating goals, pain points, daily workarounds, and empathy maps across 3 distinct archetypes.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
          <button
            onClick={() => setViewMode('detail')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'detail'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Detailed Profile
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'comparison'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Side-by-Side Comparison
          </button>
        </div>
      </div>

      {/* Persona Selection Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {personasList.map(p => {
          const isSelected = p.id === currentPersona.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                isSelected
                  ? 'border-purple-600 bg-stone-900 text-white shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <img
                src={p.avatar}
                alt={p.name}
                className={`w-12 h-12 rounded-xl object-cover ring-2 ${
                  isSelected ? 'ring-purple-400' : 'ring-stone-200'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm truncate font-heading">
                    {p.name}, {p.age}
                  </h3>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      isSelected
                        ? 'bg-purple-500/30 text-purple-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {p.archetype.split(' ')[1] || 'Archetype'}
                  </span>
                </div>
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isSelected ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  {p.archetype}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* DETAIL VIEW */}
      {viewMode === 'detail' ? (
        <div className="space-y-8">
          {/* Persona Header Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-stone-200">
              <div className="flex items-start gap-4">
                <img
                  src={currentPersona.avatar}
                  alt={currentPersona.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-100 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-stone-900 font-heading">
                      {currentPersona.name}
                    </h2>
                    <span className="text-sm font-semibold text-stone-500">
                      Age {currentPersona.age}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {currentPersona.archetype}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
                    {currentPersona.context}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Research Status
                </span>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block">
                  Illustrative Research Persona
                </span>
                <div>
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition"
                    title={userRole === 'editor' || userRole === 'admin' ? 'Edit persona research profile' : 'Sign in as Editor to edit'}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                    <span>{userRole === 'editor' || userRole === 'admin' ? 'Edit Persona' : 'Editor View'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Editing Form Modal / Inline Box */}
            {isEditing && (
              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <h4 className="font-bold text-purple-950 font-heading">
                      Authorized Editor: Updating Persona #{currentPersona.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">
                      Illustrative Representative Quote:
                    </label>
                    <textarea
                      value={editQuote}
                      onChange={e => setEditQuote(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">
                      Primary Core Goal:
                    </label>
                    <input
                      type="text"
                      value={editPrimaryGoal}
                      onChange={e => setEditPrimaryGoal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">
                      Context & Life Stage:
                    </label>
                    <textarea
                      value={editContext}
                      onChange={e => setEditContext(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-lg bg-purple-900 text-white hover:bg-purple-950 font-semibold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving to DB...' : 'Save to PostgreSQL'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Illustrative Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 via-white to-stone-50 border border-purple-200 text-stone-800 italic text-xs sm:text-sm leading-relaxed flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-900 not-italic block text-[10px] uppercase tracking-wider mb-0.5">
                  Representative Voice (Illustrative Hypothesis)
                </span>
                <p>"{currentPersona.illustrativeQuote}"</p>
              </div>
            </div>

            {/* Visual Indicators: Goals, Pain Points, Needs, Workarounds, Opportunity */}
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              {/* Goals */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4 text-emerald-700" />
                  <span>Goals & Aspirations</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {currentPersona.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pain Points */}
              <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-rose-700" />
                  <span>Pain Points & Friction</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {currentPersona.painPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">✕</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unmet Needs */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-blue-700" />
                  <span>Unmet Human Needs</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {currentPersona.unmetNeeds.map((need, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-700 font-bold shrink-0">•</span>
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Current Workarounds */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  <span>Current Coping Workarounds</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {currentPersona.currentWorkarounds.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold shrink-0">→</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Design Opportunity for CommonGround */}
            <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-2">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-teal-700" />
                <span>Primary Design Opportunity</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-teal-950 leading-relaxed">
                {currentPersona.designOpportunity}
              </p>
              <p className="text-xs text-stone-600 pt-1 border-t border-teal-200/60">
                <strong>What {currentPersona.name.split(' ')[0]} Needs from CommonGround:</strong>{' '}
                {currentPersona.commonGroundFitSummary}
              </p>
            </div>
          </div>

          {/* Empathy Map Section */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-heading">
                  Empathy Map: {currentPersona.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Visualizing what {currentPersona.name.split(' ')[0]} says, thinks, does, and feels during social connection attempts.
                </p>
              </div>

              {/* Quadrant filter */}
              <div className="flex items-center gap-1 text-xs">
                {(['all', 'says', 'thinks', 'does', 'feels'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => setActiveEmpathyQuadrant(q)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                      activeEmpathyQuadrant === q
                        ? 'bg-purple-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Quadrants */}
            <div className="grid sm:grid-cols-2 gap-4">
              {(activeEmpathyQuadrant === 'all' || activeEmpathyQuadrant === 'says') && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                    Says (External Statements)
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700 italic">
                    {currentPersona.empathyMap.says.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(activeEmpathyQuadrant === 'all' || activeEmpathyQuadrant === 'thinks') && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                    Thinks (Internal Monologue)
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700 italic">
                    {currentPersona.empathyMap.thinks.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(activeEmpathyQuadrant === 'all' || activeEmpathyQuadrant === 'does') && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                    Does (Observable Behaviors)
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {currentPersona.empathyMap.does.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(activeEmpathyQuadrant === 'all' || activeEmpathyQuadrant === 'feels') && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md">
                    Feels (Underlying Emotions)
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {currentPersona.empathyMap.feels.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* COMPARISON MATRIX VIEW */
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
            <h2 className="font-bold text-sm font-heading flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-300" />
              <span>Side-by-Side Comparison: Aanya, Rohan, and Meera</span>
            </h2>
            <span className="text-[11px] text-stone-300">Evaluating Diverse Connection Needs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 divide-x divide-stone-200">
                  <th className="p-4 font-bold w-1/4">Evaluation Dimension</th>
                  {personasList.map(p => (
                    <th key={p.id} className="p-4 font-bold w-1/4">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <span className="block font-bold text-stone-900">{p.name} ({p.age})</span>
                          <span className="text-[10px] text-stone-500 font-normal">{p.archetype}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr className="divide-x divide-stone-100 hover:bg-stone-50/50">
                  <td className="p-4 font-bold text-stone-800 bg-stone-50/60 align-top">
                    Context & Life Stage
                  </td>
                  {personasList.map(p => (
                    <td key={p.id} className="p-4 align-top text-stone-700 leading-relaxed">
                      {p.context}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-100 hover:bg-stone-50/50">
                  <td className="p-4 font-bold text-stone-800 bg-stone-50/60 align-top">
                    Primary Goal
                  </td>
                  {personasList.map(p => (
                    <td key={p.id} className="p-4 align-top text-emerald-950 font-medium leading-relaxed">
                      {p.primaryGoal}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-100 hover:bg-stone-50/50">
                  <td className="p-4 font-bold text-stone-800 bg-stone-50/60 align-top">
                    Main Frustrations
                  </td>
                  {personasList.map(p => (
                    <td key={p.id} className="p-4 align-top text-stone-700 space-y-1">
                      {p.painPoints.slice(0, 3).map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-rose-500 font-bold shrink-0">✕</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-100 hover:bg-stone-50/50">
                  <td className="p-4 font-bold text-stone-800 bg-stone-50/60 align-top">
                    Unmet Needs
                  </td>
                  {personasList.map(p => (
                    <td key={p.id} className="p-4 align-top text-stone-700 space-y-1">
                      {p.unmetNeeds.slice(0, 3).map((need, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold shrink-0">•</span>
                          <span>{need}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-100 hover:bg-stone-50/50 bg-teal-50/20">
                  <td className="p-4 font-bold text-teal-900 bg-teal-50/50 align-top">
                    What CommonGround Solves
                  </td>
                  {personasList.map(p => (
                    <td key={p.id} className="p-4 align-top text-stone-800 leading-relaxed">
                      {p.commonGroundFitSummary}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
