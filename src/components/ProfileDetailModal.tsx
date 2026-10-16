import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  ShieldAlert,
  Ban,
  HeartHandshake,
  Clock,
  Compass,
  Check,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { calculateCompatibility } from '../utils/compatibility';

export const ProfileDetailModal: React.FC = () => {
  const {
    detailUser,
    setDetailUser,
    currentUser,
    setIntroTargetUser,
    setReportTargetUser,
    blockUser,
    connections,
    introductions,
    setActiveTab,
    setActiveConnectionId,
  } = useApp();

  if (!detailUser) return null;

  const comp = calculateCompatibility(currentUser, detailUser);

  const isConnected = connections.some(
    c => c.status === 'active' && c.userIds.includes(detailUser.id)
  );
  const activeConn = connections.find(
    c => c.status === 'active' && c.userIds.includes(detailUser.id)
  );

  const hasPendingSent = introductions.some(
    i => i.fromUserId === currentUser.id && i.toUserId === detailUser.id && i.status === 'pending'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 to-teal-950 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={detailUser.avatar}
              alt={detailUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{detailUser.name}</h2>
                {detailUser.pronouns && (
                  <span className="text-xs text-stone-300">({detailUser.pronouns})</span>
                )}
                {detailUser.age && (
                  <span className="text-xs text-stone-400">• {detailUser.age}</span>
                )}
              </div>
              <p className="text-xs text-teal-300 font-medium">{detailUser.location}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Member since {detailUser.joinedDate}</p>
            </div>
          </div>

          <button
            onClick={() => setDetailUser(null)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Headline & Bio */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-stone-900">{detailUser.headline}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/70">
              "{detailUser.bio}"
            </p>
          </div>

          {/* Explainable Compatibility Card */}
          <div className="bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 rounded-2xl p-5 border border-teal-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-700" />
                <h4 className="font-bold text-sm text-stone-900">
                  Explainable Compatibility ({comp.totalScore}% Match)
                </h4>
              </div>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                Transparent Formula
              </span>
            </div>

            {/* Score Distribution Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-stone-500 block">Interests (40%)</span>
                <span className="font-bold text-teal-800 text-sm">{comp.interestScore} / 40</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-stone-500 block">Intentions (30%)</span>
                <span className="font-bold text-teal-800 text-sm">{comp.intentionScore} / 30</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-stone-500 block">Values (20%)</span>
                <span className="font-bold text-teal-800 text-sm">{comp.valueScore} / 20</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-stone-500 block">Communication (10%)</span>
                <span className="font-bold text-teal-800 text-sm">{comp.communicationScore} / 10</span>
              </div>
            </div>

            {/* Bullet explanations */}
            <div className="space-y-1.5 text-xs text-stone-700">
              {comp.breakdownBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-stone-500 italic border-t border-teal-100 pt-2">
              Disclaimer: Compatibility indicators are estimated from stated interests and preferences to facilitate low-pressure conversations — not a scientific guarantee of relationship success.
            </p>
          </div>

          {/* Interests Breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Interests & Passions
            </span>
            <div className="flex flex-wrap gap-2">
              {detailUser.interests.map(tag => {
                const isShared = comp.sharedInterests.includes(tag);
                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium ${
                      isShared
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {isShared && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    {tag}
                    {isShared && <span className="text-[10px] text-emerald-700">(Mutual)</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Intentions & Values */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Intentions on CommonGround
              </span>
              <div className="flex flex-wrap gap-1.5">
                {detailUser.intentions.map(intent => (
                  <span
                    key={intent}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium"
                  >
                    {intent}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Core Values
              </span>
              <div className="flex flex-wrap gap-1.5">
                {detailUser.values.map(val => (
                  <span
                    key={val}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 text-xs font-medium border border-purple-100"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Communication Rhythm & Comfort
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Pace</span>
                <span className="font-semibold text-stone-800">
                  {detailUser.communicationPreferences.pace}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Style</span>
                <span className="font-semibold text-stone-800">
                  {detailUser.communicationPreferences.style}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Energy</span>
                <span className="font-semibold text-stone-800">
                  {detailUser.communicationPreferences.socialEnergy}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Primary & Safety Actions */}
        <div className="p-4 sm:p-5 bg-stone-100/80 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          {/* Safety: Block & Report */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setReportTargetUser(detailUser);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-stone-600 hover:text-stone-900 text-xs font-medium rounded-lg hover:bg-stone-200 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-stone-500" />
              <span>Report Profile</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to block ${detailUser.name}? They will be completely removed from your discovery.`)) {
                  blockUser(detailUser.id);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:text-rose-700 text-xs font-medium rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Ban className="w-4 h-4 text-rose-500" />
              <span>Block User</span>
            </button>
          </div>

          {/* Primary Action */}
          <div>
            {isConnected ? (
              <button
                onClick={() => {
                  if (activeConn) {
                    setActiveConnectionId(activeConn.id);
                    setDetailUser(null);
                    setActiveTab('chat');
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Conversation</span>
              </button>
            ) : hasPendingSent ? (
              <span className="text-xs text-stone-500 font-medium px-4 py-2 bg-stone-200 rounded-xl">
                Introduction Pending Their Review
              </span>
            ) : (
              <button
                onClick={() => {
                  setIntroTargetUser(detailUser);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <HeartHandshake className="w-4 h-4 text-teal-300" />
                <span>Invite to Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
