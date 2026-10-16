import React, { useState } from 'react';
import { EVIDENCE_SOURCES, TOP_PROBLEMS } from '../../data/researchData';
import {
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Globe,
  FileText,
} from 'lucide-react';

export const EvidenceExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblemFilter, setSelectedProblemFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedStrengthFilter, setSelectedStrengthFilter] = useState('All');

  const sourceTypes = [
    'All',
    'Peer-Reviewed Academic',
    'Government & Public Health',
    'Reputable Survey Institution',
    'Regulatory Agency',
  ];

  const strengthOptions = ['All', 'Strong', 'Moderate', 'Preliminary'];

  // Filter sources
  const filteredSources = EVIDENCE_SOURCES.filter(s => {
    // Problem Filter
    if (selectedProblemFilter !== 'All' && s.problemId !== selectedProblemFilter) {
      return false;
    }

    // Source Type Filter
    if (selectedTypeFilter !== 'All' && s.sourceType !== selectedTypeFilter) {
      return false;
    }

    // Strength Filter
    if (selectedStrengthFilter !== 'All' && s.confidenceLevel !== selectedStrengthFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inClaim = s.claim.toLowerCase().includes(q);
      const inTitle = s.sourceTitle.toLowerCase().includes(q);
      const inAuthor = s.authorOrOrganization.toLowerCase().includes(q);
      const inFinding = s.relevantFinding.toLowerCase().includes(q);
      const inPop = s.populationAndGeography.toLowerCase().includes(q);
      if (!inClaim && !inTitle && !inAuthor && !inFinding && !inPop) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          Traceable Evidence Repository
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-heading">
          Evidence Explorer & Citations Library
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Search and verify primary empirical studies, government advisories, and national surveys.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search claims, authors, finding keywords, statistics (e.g. 48%, homophily, Surgeon General, Finkel)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Dropdowns / Filter Chips */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100 text-xs">
          {/* Problem Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Problem Category
            </label>
            <select
              value={selectedProblemFilter}
              onChange={e => setSelectedProblemFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All 5 Problems</option>
              {TOP_PROBLEMS.map(p => (
                <option key={p.id} value={p.id}>
                  P{p.number}: {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Source Type Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Source Type
            </label>
            <select
              value={selectedTypeFilter}
              onChange={e => setSelectedTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {sourceTypes.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Confidence Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Evidence Confidence
            </label>
            <select
              value={selectedStrengthFilter}
              onChange={e => setSelectedStrengthFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {strengthOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Confidence Levels' : `${opt} Confidence`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-900">{filteredSources.length}</strong> of{' '}
          {EVIDENCE_SOURCES.length} verified evidence sources
        </span>
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedProblemFilter('All');
            setSelectedTypeFilter('All');
            setSelectedStrengthFilter('All');
          }}
          className="text-teal-800 hover:text-teal-950 font-semibold"
        >
          Reset Filters
        </button>
      </div>

      {/* Evidence Cards Stream */}
      <div className="space-y-5">
        {filteredSources.map(source => {
          const associatedProblem = TOP_PROBLEMS.find(p => p.id === source.problemId);

          return (
            <div
              key={source.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-2xs hover:border-teal-300 transition-all space-y-4"
            >
              {/* Card Top: Badges & Direct Source Link */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md">
                    {source.sourceType}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      source.confidenceLevel === 'Strong'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
                    }`}
                  >
                    {source.confidenceLevel} Confidence
                  </span>
                  {associatedProblem && (
                    <span className="text-[10px] font-medium text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
                      Problem #{associatedProblem.number}
                    </span>
                  )}
                </div>

                <a
                  href={source.directUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold border border-teal-200 self-start sm:self-center transition-colors shrink-0"
                >
                  <span>Read Primary Source</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                </a>
              </div>

              {/* Claim Title */}
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-snug">
                  "{source.claim}"
                </h3>
                <p className="text-xs font-semibold text-stone-500">
                  {source.sourceTitle}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-400 pt-0.5">
                  <span>Author/Publisher: <strong className="text-stone-700">{source.authorOrOrganization}</strong></span>
                  <span>Published: <strong className="text-stone-700">{source.publicationDate}</strong></span>
                </div>
              </div>

              {/* Relevant Finding & Exact Statistic */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 text-xs">
                <div>
                  <strong className="text-stone-900 block text-[11px] uppercase tracking-wider mb-0.5">
                    Empirical Finding:
                  </strong>
                  <p className="text-stone-700 leading-relaxed">{source.relevantFinding}</p>
                </div>

                {source.exactStatistic && (
                  <div className="pt-2 border-t border-stone-200/60 text-teal-950 font-medium">
                    <span className="font-bold text-teal-800 text-[10px] uppercase block">
                      Specific Documented Metric:
                    </span>
                    <p className="text-xs font-bold">{source.exactStatistic}</p>
                  </div>
                )}
              </div>

              {/* Population & Context */}
              <div className="text-xs text-stone-600 flex items-start gap-2">
                <Globe className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Study Population & Geography:</strong> {source.populationAndGeography}
                </span>
              </div>

              {/* What It Supports vs Limitations */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <strong className="text-emerald-900 block font-bold text-[11px] uppercase">
                    What this evidence supports:
                  </strong>
                  <p className="text-stone-700">{source.whatItSupports}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-100/70 border border-stone-200 space-y-1">
                  <strong className="text-stone-800 block font-bold text-[11px] uppercase">
                    Methodological Limitations:
                  </strong>
                  <p className="text-stone-600">{source.limitations}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
