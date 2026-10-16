import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  HeartHandshake,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Clock,
  Compass,
  Check,
  UserCheck,
  ArrowRight,
  Filter,
  Eye,
  UserX,
} from 'lucide-react';
import { calculateCompatibility } from '../utils/compatibility';
import { IntentionType, User } from '../types';

export const DiscoveryView: React.FC = () => {
  const {
    currentUser,
    discoverableUsers,
    setDetailUser,
    setIntroTargetUser,
    setWhyMatchUser,
    introductions,
    connections,
    setActiveTab,
    setActiveConnectionId,
    filterIntention,
    setFilterIntention,
    filterSearch,
    setFilterSearch,
    minCompatibilityScore,
    setMinCompatibilityScore,
    togglePauseDiscovery,
    influenceSettings,
    dismissUserFromDiscovery,
  } = useApp();

  const isPaused = currentUser.privacySettings.discoveryPaused;

  const intentionOptions = [
    'All',
    'Friendship',
    'Activity Partners',
    'Dating',
    'Community & Learning',
    'Professional Networking',
  ];

  // Calculate compatibility for each discoverable user and apply filters
  const usersWithScores = discoverableUsers.map(user => {
    const comp = calculateCompatibility(currentUser, user, influenceSettings);
    return {
      user,
      comp,
    };
  });

  const filteredUsers = usersWithScores.filter(({ user, comp }) => {
    // Score threshold
    if (comp.totalScore < minCompatibilityScore) return false;

    // Intention filter
    if (filterIntention !== 'All') {
      if (!user.intentions.includes(filterIntention as IntentionType)) {
        return false;
      }
    }

    // Keyword search (name, interests, headline, bio)
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase().trim();
      const inName = user.name.toLowerCase().includes(q);
      const inHeadline = user.headline.toLowerCase().includes(q);
      const inInterests = user.interests.some(i => i.toLowerCase().includes(q));
      const inValues = user.values.some(v => v.toLowerCase().includes(q));
      if (!inName && !inHeadline && !inInterests && !inValues) return false;
    }

    return true;
  });

  // Sort by compatibility score
  filteredUsers.sort((a, b) => b.comp.totalScore - a.comp.totalScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Personalized Welcome Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Common Ground</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Here are compatible people who share your passions for{' '}
            <span className="text-teal-300 font-medium">
              {currentUser.interests.slice(0, 3).join(', ')}
            </span>
            . Ranked purely by transparent shared context — never by popularity or appearance.
          </p>
        </div>

        {/* Discovery Pause State Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          {isPaused ? (
            <div className="bg-amber-950/80 border border-amber-600/50 px-4 py-3 rounded-2xl flex items-center gap-3">
              <PauseCircle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-amber-200">Discovery is Paused</p>
                <p className="text-[11px] text-amber-300/80">You are invisible to new matches</p>
              </div>
              <button
                onClick={togglePauseDiscovery}
                className="ml-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors"
              >
                Resume
              </button>
            </div>
          ) : (
            <button
              onClick={togglePauseDiscovery}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-colors"
              title="Pause discovery when your social battery is full"
            >
              <PauseCircle className="w-4 h-4 text-stone-300" />
              <span>Pause Discovery</span>
            </button>
          )}
        </div>
      </div>

      {/* OpenSignals Recommendation Transparency Banner */}
      <div className="bg-gradient-to-r from-teal-50/90 via-stone-50 to-white rounded-2xl p-4 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-stone-900">
              OpenSignals: You have full control over what influences these suggestions.
            </p>
            <p className="text-[11px] text-stone-500">
              Matches are calculated from user-provided tags—never from secret ad profiles or surveillance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('opensignals')}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-teal-300 text-teal-900 text-xs font-bold transition-colors shadow-2xs shrink-0"
        >
          Manage OpenSignals →
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Intention Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-2 shrink-0">
            Intention:
          </span>
          {intentionOptions.map(tab => (
            <button
              key={tab}
              onClick={() => setFilterIntention(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                filterIntention === tab
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Compatibility Threshold */}
        <div className="grid sm:grid-cols-12 gap-3 pt-2 border-t border-stone-100 items-center">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              placeholder="Search by interest (e.g. Hiking, Photography, Board Games, Sourdough)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-3 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
            <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
            <span className="text-xs text-stone-600 font-medium shrink-0">
              Min Match: <strong className="text-stone-900">{minCompatibilityScore}%</strong>
            </span>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={minCompatibilityScore}
              onChange={e => setMinCompatibilityScore(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Discovery Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-900">{filteredUsers.length}</strong> compatible people
        </span>
        <span className="flex items-center gap-1.5 text-stone-600">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Consent-first: Connect only upon mutual agreement
        </span>
      </div>

      {/* Cards Grid */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No compatible matches with current filters</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Try lowering the minimum compatibility slider or selecting "All" intentions to see more members.
          </p>
          <button
            onClick={() => {
              setFilterIntention('All');
              setFilterSearch('');
              setMinCompatibilityScore(20);
            }}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(({ user, comp }) => {
            // Check if there is an active connection or pending intro
            const isConnected = connections.some(
              c => c.status === 'active' && c.userIds.includes(user.id)
            );
            const activeConn = connections.find(
              c => c.status === 'active' && c.userIds.includes(user.id)
            );

            const hasPendingSent = introductions.some(
              i => i.fromUserId === currentUser.id && i.toUserId === user.id && i.status === 'pending'
            );

            const hasPendingReceived = introductions.some(
              i => i.fromUserId === user.id && i.toUserId === currentUser.id && i.status === 'pending'
            );

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top: Avatar, Compatibility Pill, Location */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100 group-hover:ring-teal-500/40 transition-all"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="Active recently" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-stone-900 flex items-center gap-1.5">
                          {user.name}
                          {user.pronouns && (
                            <span className="text-xs font-normal text-stone-500">
                              ({user.pronouns})
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-stone-500">{user.location}</p>
                      </div>
                    </div>

                    {/* Compatibility Score Badge with Trigger */}
                    <button
                      onClick={() => setWhyMatchUser(user)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 text-xs font-bold transition-colors shrink-0"
                      title="Click to view explainable compatibility breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>{comp.totalScore}%</span>
                    </button>
                  </div>

                  {/* Headline */}
                  <p className="text-xs text-stone-700 font-medium leading-relaxed line-clamp-2">
                    {user.headline}
                  </p>

                  {/* Natural Language Compatibility Summary */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{comp.explanation}</span>
                  </div>

                  {/* Shared Interests Highlights */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                      Mutual Interests ({comp.sharedInterests.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.sharedInterests.length > 0 ? (
                        comp.sharedInterests.slice(0, 3).map(interest => (
                          <span
                            key={interest}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-semibold"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">
                          Complementary interests
                        </span>
                      )}
                      {comp.sharedInterests.length > 3 && (
                        <span className="text-[11px] text-stone-500 px-1 py-0.5">
                          +{comp.sharedInterests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Intentions & Pacing Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {user.intentions.map(intent => (
                      <span
                        key={intent}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                      >
                        {intent}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[10px] font-medium border border-purple-100">
                      <Clock className="w-2.5 h-2.5" />
                      {user.communicationPreferences.pace}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Actions */}
                <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setWhyMatchUser(user)}
                      className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 transition-colors"
                      title="Explain why this recommendation appeared"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>Why am I seeing this person?</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dismissUserFromDiscovery(user.id)}
                        className="text-[11px] text-stone-400 hover:text-stone-600 px-1 py-0.5 rounded transition-colors"
                        title="Dismiss this recommendation from your feed"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => setDetailUser(user)}
                        className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-2 py-1 rounded-lg hover:bg-stone-200/60 transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-end">
                    {/* Connect / Chat State */}
                    {isConnected ? (
                      <button
                        onClick={() => {
                          if (activeConn) {
                            setActiveConnectionId(activeConn.id);
                            setActiveTab('chat');
                          }
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Connected • Chat</span>
                      </button>
                    ) : hasPendingReceived ? (
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>View Invitation</span>
                      </button>
                    ) : hasPendingSent ? (
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-medium cursor-default text-center"
                      >
                        Invitation Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => setIntroTargetUser(user)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-semibold shadow-2xs transition-all"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-teal-300" />
                        <span>Invite to Connect</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
