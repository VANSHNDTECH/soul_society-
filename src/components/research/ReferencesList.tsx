import React, { useState } from 'react';
import { EVIDENCE_SOURCES } from '../../data/researchData';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

export const ReferencesList: React.FC = () => {
  const [filterType, setFilterType] = useState('All');

  const filtered = EVIDENCE_SOURCES.filter(s =>
    filterType === 'All' ? true : s.sourceType === filterType
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          Bibliography & Scholarly Record
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
          Academic References & Verified Sources
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Complete citations, persistent identifiers (DOI/PubMed), and links to original empirical publications.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {['All', 'Peer-Reviewed Academic', 'Government & Public Health', 'Reputable Survey Institution', 'Regulatory Agency'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === type
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* References Stream */}
      <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 shadow-xs overflow-hidden">
        {filtered.map((source, idx) => (
          <div key={source.id} className="p-6 space-y-2.5 hover:bg-stone-50/50 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                [{idx + 1}] {source.sourceType}
              </span>
              <a
                href={source.directUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950"
              >
                <span>Access Primary Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-heading">
              {source.sourceTitle}
            </h3>

            <div className="text-xs text-stone-600 space-y-1">
              <p>
                <strong>Authors / Organization:</strong> {source.authorOrOrganization}
              </p>
              <p>
                <strong>Date:</strong> {source.publicationDate}
              </p>
              <p className="text-stone-500 italic">
                "{source.claim}"
              </p>
            </div>

            <div className="text-[11px] text-stone-500 pt-1">
              <strong>Context & Target Population:</strong> {source.populationAndGeography}
            </div>
          </div>
        ))}
      </div>

      {/* Epistemological Disclosure */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
        <strong className="text-stone-900 block font-bold">Citation Integrity Guarantee</strong>
        <p>
          All citations in CommonGround Module 1 correspond to published, verifiable academic journals (e.g. <em>Psychological Science in the Public Interest</em>, <em>Social Science Research</em>, <em>Journal of Social and Personal Relationships</em>), federal advisories (U.S. Surgeon General / HHS), and reputable non-partisan demographic institutions (Pew Research Center).
        </p>
      </div>
    </div>
  );
};
