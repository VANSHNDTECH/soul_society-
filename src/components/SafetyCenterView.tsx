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
  } = useApp();

  const isPaused = currentUser.privacySettings.discoveryPaused;

  const blockedUsers = allUsers.filter(u => blockedUserIds.includes(u.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
          Privacy & Safety Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
          Your Boundaries & Personal Safety
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          You are always in control of who can discover you, when people can reach out, and your interaction pacing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Discovery Controls */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              {isPaused ? <PauseCircle className="w-5 h-5 text-amber-600" /> : <Eye className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">Discovery Controls</h3>
              <p className="text-xs text-stone-500">Manage when you are visible to new people</p>
            </div>
          </div>

          {/* Pause Discovery Toggle */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-stone-900 block">
                {isPaused ? 'Discovery is currently PAUSED' : 'Discovery is ACTIVE'}
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">
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
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {isPaused ? 'Resume Discovery' : 'Pause Discovery'}
            </button>
          </div>

          {/* Visibility Scope */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
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
                      ? 'border-teal-600 bg-teal-50/70 font-medium text-teal-950 shadow-2xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <span className="block font-bold">{opt.label}</span>
                  <span className="block text-[11px] text-stone-500 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Introduction Boundaries */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">Introduction Boundaries</h3>
              <p className="text-xs text-stone-500">Filter incoming introduction requests</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
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
                    ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-medium shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <span className="block font-bold">{opt.title}</span>
                <span className="block text-[11px] text-stone-500 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Blocked Profiles Management */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Blocked Profiles ({blockedUsers.length})
              </h3>
              <p className="text-xs text-stone-500">
                Blocked members cannot find your profile or contact you
              </p>
            </div>
          </div>

          {blockedUsers.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-6 text-center text-xs text-stone-500 border border-stone-200/80">
              You haven't blocked any profiles. You can block someone anytime from their profile card or chat menu.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
              {blockedUsers.map(user => (
                <div key={user.id} className="p-3.5 flex items-center justify-between bg-stone-50/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">{user.name}</h4>
                      <p className="text-[10px] text-stone-400">Blocked permanently</p>
                    </div>
                  </div>

                  <button
                    onClick={() => unblockUser(user.id)}
                    className="px-3 py-1 rounded-lg border border-stone-300 text-[11px] font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 4: Moderation & Simulated Audit Trail */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">Safety & Report Log</h3>
              <p className="text-xs text-stone-500">
                Local prototype simulation of community moderation
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
            <strong>Demonstration Prototype Note:</strong> When you report a profile, it is logged locally in this session audit trail to demonstrate safety mechanics without sending real HTTP requests.
          </p>

          {reports.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-6 text-center text-xs text-stone-500 border border-stone-200/80">
              No reports submitted in this demo session.
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">
                      Report against {rep.reportedUserName}
                    </span>
                    <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-stone-600">
                    Reason: <strong className="text-stone-800">{rep.reason}</strong>
                  </p>
                  {rep.details && <p className="text-stone-500 italic">"{rep.details}"</p>}
                  <p className="text-[10px] text-stone-400">Recorded: {rep.timestamp}</p>
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
