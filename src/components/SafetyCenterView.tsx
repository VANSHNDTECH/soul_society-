import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  PauseCircle,
  Eye,
  EyeOff,
  Ban,
  ShieldAlert,
  Lock,
  CheckCircle,
  UserX,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

export const SafetyCenterView: React.FC = () => {
  const {
    currentUser,
    updatePrivacySettings,
    togglePauseDiscovery,
    blockedUserIds,
    unblockUser,
    allUsers,
    reports,
    showToast,
    authSession,
    openAuthModal,
  } = useApp();

  const isPaused = currentUser.privacySettings.discoveryPaused;

  const blockedUsers = allUsers.filter(u => blockedUserIds.includes(u.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200 dark:border-stone-800">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md">
          Privacy & Safety Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
          Your Boundaries & Personal Safety
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          You are always in control of who can discover you, when people can reach out, and your interaction pacing.
        </p>
      </div>

      {/* Visitor notice banner */}
      {!authSession.isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-950 dark:text-amber-200">
                Visitor Preview Mode
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Sign in to save and synchronize your personal boundary and privacy rules to your verified account.
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal('Sign in or register to update your account safety settings.')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 shadow-2xs transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Discovery Controls */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              {isPaused ? <PauseCircle className="w-5 h-5 text-amber-600" /> : <Eye className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">Discovery Controls</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Manage when you are visible to new people</p>
            </div>
          </div>

          {/* Pause Discovery Toggle */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                {isPaused ? 'Discovery is currently PAUSED' : 'Discovery is ACTIVE'}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                {isPaused
                  ? 'Your card is hidden from discovery. Existing connections remain active.'
                  : 'Compatible members can find your profile and send introduction requests.'}
              </span>
            </div>

            <button
              onClick={togglePauseDiscovery}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isPaused
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-stone-900 dark:bg-teal-600 hover:bg-stone-800 dark:hover:bg-teal-500 text-white'
              }`}
            >
              {isPaused ? 'Resume Discovery' : 'Pause Discovery'}
            </button>
          </div>

          {/* Visibility Scope */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Profile Visibility Scope
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'public_match',
                  label: 'All Compatible Members',
                  desc: 'Visible to anyone sharing your interests and intentions.',
                },
                {
                  id: 'intentions_only',
                  label: 'Identical Intentions Only',
                  desc: 'Only visible if someone seeks the exact same connection goals.',
                },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updatePrivacySettings({ visibility: opt.id as any })}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                    currentUser.privacySettings.visibility === opt.id
                      ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 font-medium text-teal-950 dark:text-teal-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-850'
                  }`}
                >
                  <span className="block font-bold">{opt.label}</span>
                  <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Introduction Boundaries */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">Introduction Boundaries</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Filter incoming introduction requests</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Who Can Send You Introduction Requests
            </label>
            {[
              {
                id: 'any',
                title: 'Open to All Compatible Members',
                desc: 'Anyone with estimated common ground can send a polite icebreaker.',
              },
              {
                id: 'shared_intention',
                title: 'Matching Intentions Only',
                desc: 'Requests accepted only from people with matching friendship/activity goals.',
              },
              {
                id: 'high_match',
                title: 'High Compatibility Only (>60%)',
                desc: 'Filters requests to members with deep shared interests and values.',
              },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updatePrivacySettings({ introRequirement: opt.id as any })}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                  currentUser.privacySettings.introRequirement === opt.id
                    ? 'border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 font-medium shadow-2xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-850'
                }`}
              >
                <span className="block font-bold">{opt.title}</span>
                <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Blocked Profiles Management */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Blocked Profiles ({blockedUsers.length})
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Blocked members cannot find your profile or contact you
              </p>
            </div>
          </div>

          {blockedUsers.length === 0 ? (
            <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 text-center text-xs text-stone-500 dark:text-stone-400 border border-stone-200/80 dark:border-stone-800">
              You haven't blocked any profiles. You can block someone anytime from their profile card or chat menu.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
              {blockedUsers.map(user => (
                <div key={user.id} className="p-3.5 flex items-center justify-between bg-stone-50/50 dark:bg-stone-850">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">{user.name}</h4>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500">Blocked permanently</p>
                    </div>
                  </div>

                  <button
                    onClick={() => unblockUser(user.id)}
                    className="px-3 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 4: Moderation & Simulated Audit Trail */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">Safety & Report Log</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Local prototype simulation of community moderation
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-600 dark:text-amber-200/90 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800">
            <strong>Demonstration Prototype Note:</strong> When you report a profile, it is logged locally in this session audit trail to demonstrate safety mechanics without sending real HTTP requests.
          </p>

          {reports.length === 0 ? (
            <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 text-center text-xs text-stone-500 dark:text-stone-400 border border-stone-200/80 dark:border-stone-800">
              No reports submitted in this demo session.
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      Report against {rep.reportedUserName}
                    </span>
                    <span className="text-[10px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full font-semibold border border-teal-200 dark:border-teal-800">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300">
                    Reason: <strong className="text-stone-800 dark:text-stone-200">{rep.reason}</strong>
                  </p>
                  {rep.details && <p className="text-stone-500 dark:text-stone-400 italic">"{rep.details}"</p>}
                  <p className="text-[10px] text-stone-400 dark:text-stone-500">Recorded: {rep.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charter of Dignity */}
      <div className="bg-gradient-to-br from-stone-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>The CommonGround Mutual Respect Charter</span>
        </div>
        <h3 className="text-xl font-bold">Community Principles</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-stone-300 pt-2">
          <div className="space-y-1">
            <strong className="text-white block font-semibold">1. Quiet Declines</strong>
            <p>Declining an invitation is peaceful and private. Nobody is entitled to someone else's attention.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block font-semibold">2. Pacing Respect</strong>
            <p>Every member sets their interaction rhythm. Take days between replies without guilt.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block font-semibold">3. Dignified Exits</strong>
            <p>Either person can pause or end a connection at any time without confrontation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
