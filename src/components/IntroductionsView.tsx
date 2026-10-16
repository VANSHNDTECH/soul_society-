import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Inbox,
  Send,
  CheckCircle,
  X,
  UserCheck,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { calculateCompatibility } from '../utils/compatibility';

export const IntroductionsView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    introductions,
    acceptIntroduction,
    declineIntroduction,
    cancelIntroduction,
    setDetailUser,
    setActiveTab,
    setActiveConnectionId,
    connections,
    showToast,
    authSession,
    openAuthModal,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'received' | 'sent'>('received');

  // Filter received and sent invitations for currentUser
  const receivedList = introductions.filter(
    i => i.toUserId === currentUser.id && i.status === 'pending'
  );

  const sentList = introductions.filter(
    i => i.fromUserId === currentUser.id && i.status === 'pending'
  );

  if (!authSession.isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Mutual Introductions Require Authentication</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            CommonGround ensures introduction privacy by requiring a verified account. Sign in or register to receive personal introduction invitations or invite peers to connect.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('Sign in to view and respond to introductions.')}
              className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              Sign In / Register
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className="px-5 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              Browse Discovery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md">
            Mutual Introduction System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
            Introductions & Requests
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Connections only form when both people say yes. No unsolicited spam, no public rejection statistics.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shrink-0">
          <button
            onClick={() => setActiveSubTab('received')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'received'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Inbox className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Received</span>
            {receivedList.length > 0 && (
              <span className="px-1.5 py-0.2 bg-teal-600 text-white text-[10px] rounded-full font-bold">
                {receivedList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('sent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'sent'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Send className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            <span>Sent Pending</span>
            {sentList.length > 0 && (
              <span className="px-1.5 py-0.2 bg-stone-300 dark:bg-stone-600 text-stone-800 dark:text-stone-200 text-[10px] rounded-full font-bold">
                {sentList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Low-pressure consent reminder */}
      <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-700 flex items-start gap-3 text-xs text-stone-600 dark:text-stone-300">
        <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-900 dark:text-stone-100 block">The CommonGround Mutual Consent Standard:</span>
          <p className="mt-0.5">
            Recipients can accept, decline, or ignore any introduction without explaining why. If you decline, the sender is never notified of a rejection, avoiding awkwardness or social pressure.
          </p>
        </div>
      </div>

      {/* RECEIVED TAB */}
      {activeSubTab === 'received' && (
        <div className="space-y-4">
          {receivedList.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Your introduction inbox is clear</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                When someone who shares your interests sends an invitation, it will appear here for your review.
              </p>
              <button
                onClick={() => setActiveTab('discovery')}
                className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors"
              >
                Explore Discoverable Members
              </button>
            </div>
          ) : (
            receivedList.map(intro => {
              const sender = allUsers.find(u => u.id === intro.fromUserId);
              if (!sender) return null;

              const comp = calculateCompatibility(currentUser, sender);

              return (
                <div
                  key={intro.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:border-teal-300 dark:hover:border-teal-700 transition-all p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={sender.avatar}
                        alt={sender.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100 dark:ring-stone-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">{sender.name}</h3>
                          {sender.pronouns && (
                            <span className="text-xs text-stone-500 dark:text-stone-400">({sender.pronouns})</span>
                          )}
                          <span className="text-[10px] bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                            {comp.totalScore}% Compatibility
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{sender.headline}</p>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                          Sent {intro.createdAt} • Connected over{' '}
                          <strong className="text-stone-700 dark:text-stone-300">{intro.sharedInterestRef}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setDetailUser(sender)}
                      className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 self-start sm:self-center transition-colors"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Icebreaker & Note Box */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-4 border border-stone-200/80 dark:border-stone-700 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Icebreaker Invitation:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 italic leading-relaxed">
                      "{intro.message || intro.icebreakerPrompt}"
                    </p>
                  </div>

                  {/* Actions: Accept or Decline */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">
                      No public rejection count. Declining is completely private.
                    </span>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => declineIntroduction(intro.id)}
                        className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors"
                      >
                        Politely Decline
                      </button>

                      <button
                        onClick={() => {
                          acceptIntroduction(intro.id);
                          setActiveTab('chat');
                        }}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-2xs transition-all"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Accept & Unlock Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SENT TAB */}
      {activeSubTab === 'sent' && (
        <div className="space-y-4">
          {sentList.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">No pending sent introductions</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                When you discover someone compatible in the Discovery directory, send them a low-pressure invitation!
              </p>
              <button
                onClick={() => setActiveTab('discovery')}
                className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors"
              >
                Browse People to Invite
              </button>
            </div>
          ) : (
            sentList.map(intro => {
              const recipient = allUsers.find(u => u.id === intro.toUserId);
              if (!recipient) return null;

              return (
                <div
                  key={intro.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={recipient.avatar}
                        alt={recipient.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          Invitation sent to {recipient.name}
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{recipient.headline}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md mt-1">
                          <Clock className="w-3 h-3" />
                          Pending their review • {intro.createdAt}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => cancelIntroduction(intro.id)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      Cancel Invitation
                    </button>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 text-xs text-stone-700 dark:text-stone-300 italic border border-stone-100 dark:border-stone-700">
                    "{intro.message || intro.icebreakerPrompt}"
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
