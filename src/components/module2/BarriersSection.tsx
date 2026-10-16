import React, { useState } from 'react';
import { BARRIERS } from '../../data/module2Data';
import { BarrierCategory } from '../../types/module2';
import {
  AlertTriangle,
  Heart,
  Briefcase,
  Search,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Users,
  Lightbulb,
  Info,
} from 'lucide-react';

export const BarriersSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: ('All' | BarrierCategory)[] = [
    'All',
    'Emotional',
    'Structural',
    'Discovery',
    'Accessibility & Inclusion',
    'Trust & Safety',
  ];

  const filteredBarriers = BARRIERS.filter(b =>
    selectedCategory === 'All' ? true : b.category === selectedCategory
  );

  const categoryIcons: Record<BarrierCategory, React.ReactNode> = {
    Emotional: <Heart className="w-4 h-4 text-rose-600" />,
    Structural: <Briefcase className="w-4 h-4 text-amber-600" />,
    Discovery: <Search className="w-4 h-4 text-blue-600" />,
    'Accessibility & Inclusion': <Eye className="w-4 h-4 text-purple-600" />,
    'Trust & Safety': <ShieldCheck className="w-4 h-4 text-teal-600" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
          Root Cause Diagnosis
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
          The 5 Categories of Human Connection Barriers
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Unpacking the psychological, economic, discovery, accessibility, and safety walls preventing people from meeting.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat} {cat !== 'All' && `(${BARRIERS.filter(b => b.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Conceptual Framework Diagram / Notice */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
        <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-900 block font-bold">
            Conceptual Taxonomy Note:
          </strong>
          <p className="mt-0.5">
            These five categories categorize the friction points identified across our user personas. They represent a qualitative analytical framework for design planning, not an arbitrary commercial metric.
          </p>
        </div>
      </div>

      {/* Barriers Stream */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarriers.map(barrier => (
          <div
            key={barrier.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md">
                  {categoryIcons[barrier.category]}
                  <span>{barrier.category}</span>
                </span>

                <div className="flex gap-1">
                  {barrier.affectedPersonas.map(persona => (
                    <span
                      key={persona}
                      className="text-[9px] font-bold bg-purple-50 text-purple-900 px-1.5 py-0.5 rounded"
                      title={`Affects ${persona}`}
                    >
                      {persona.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-base text-stone-900 leading-snug font-heading">
                {barrier.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {barrier.description}
              </p>

              {/* Real-World Manifestation */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-700 space-y-1">
                <strong className="text-stone-800 block text-[10px] uppercase tracking-wider">
                  How it plays out in daily life:
                </strong>
                <p className="italic text-stone-600 leading-relaxed">
                  "{barrier.realWorldManifestation}"
                </p>
              </div>
            </div>

            {/* Design Implication */}
            <div className="pt-3 border-t border-stone-100 text-[11px] text-teal-950 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
              <strong className="text-teal-900 block font-bold text-[10px] uppercase flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-teal-700" />
                <span>CommonGround Design Response:</span>
              </strong>
              <p className="mt-0.5 leading-relaxed">{barrier.designImplication}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
