import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  Send,
  MoreVertical,
  ShieldCheck,
  PauseCircle,
  UserX,
  ShieldAlert,
  Sparkles,
  Clock,
  Compass,
  Smile,
  CheckCheck,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { calculateCompatibility } from '../utils/compatibility';
import { ConversationClearSignalsModal } from './clearsignals/ConversationClearSignalsModal';

export const ConnectionsChatView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    connections,
    activeConnectionId,
    setActiveConnectionId,
    messages,
    sendMessage,
    pauseConnection,
    disconnectConnection,
    setReportTargetUser,
    blockUser,
    setActiveTab,
    authSession,
    openAuthModal,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [clearSignalsModalOpen, setClearSignalsModalOpen] = useState(false);
  const [clearSignalsMode, setClearSignalsMode] = useState<'understand' | 'reply'>('understand');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active connections where currentUser is a participant and status is not blocked
  const myConnections = connections.filter(
    c => c.userIds.includes(currentUser.id) && c.status !== 'blocked'
  );

  const currentConnection = myConnections.find(c => c.id === activeConnectionId) || myConnections[0];

  const otherUserId = currentConnection?.userIds.find(id => id !== currentUser.id);
  const otherUser = allUsers.find(u => u.id === otherUserId);

  const currentMessages = currentConnection ? messages[currentConnection.id] || [] : [];

  const comp = otherUser ? calculateCompatibility(currentUser, otherUser) : null;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !currentConnection) return;

    sendMessage(currentConnection.id, inputVal.trim());
    setInputVal('');

    // Trigger typing simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (!currentConnection) return;
    sendMessage(currentConnection.id, promptText);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  };

  if (!authSession.isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Private Messaging Requires Authentication</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            CommonGround ensures message confidentiality by requiring a verified session. Sign in or create an account to view and participate in mutual conversations.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('Sign in to view your conversations and send messages.')}
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

  if (myConnections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">No Active Connections Yet</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            CommonGround is consent-first: conversations only open when both people mutually agree. Check your pending invitations or explore new compatible people!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('requests')}
              className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              Check Introductions
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[640px]">
        {/* Left Sidebar: Connections List */}
        <div className="lg:col-span-4 border-r border-stone-200 dark:border-stone-800 flex flex-col bg-stone-50/50 dark:bg-stone-900/50">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Active Connections ({myConnections.length})</span>
            </h2>
            <span className="text-[10px] bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full">
              Mutual Only
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
            {myConnections.map(conn => {
              const partnerId = conn.userIds.find(id => id !== currentUser.id);
              const partner = allUsers.find(u => u.id === partnerId);
              if (!partner) return null;

              const isSelected = conn.id === currentConnection?.id;
              const connMsgs = messages[conn.id] || [];
              const lastMsg = connMsgs[connMsgs.length - 1];

              return (
                <button
                  key={conn.id}
                  onClick={() => {
                    setActiveConnectionId(conn.id);
                    setShowMenu(false);
                  }}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-stone-800/90 border-l-4 border-l-teal-600 shadow-2xs'
                      : 'hover:bg-stone-100/70 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    {conn.status === 'paused' ? (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white dark:border-stone-900" title="Paused" />
                    ) : (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900" title="Active" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                        {partner.name}
                      </h4>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 shrink-0">
                        {lastMsg ? lastMsg.timestamp.split(',')[0] : 'Just now'}
                      </span>
                    </div>

                    <p className="text-[11px] text-teal-800 dark:text-teal-400 font-medium truncate mt-0.5">
                      {conn.sharedInterests[0] || partner.interests[0]}
                    </p>

                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-1">
                      {lastMsg ? lastMsg.text : 'Conversation unlocked'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Pane: Chat Window */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white dark:bg-[#12100e] h-[640px]">
          {otherUser && currentConnection ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/70">
                <div className="flex items-center gap-3">
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">{otherUser.name}</h3>
                      {otherUser.pronouns && (
                        <span className="text-xs text-stone-400">({otherUser.pronouns})</span>
                      )}
                      {currentConnection.status === 'paused' && (
                        <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                          Paused
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Pace: {otherUser.communicationPreferences.pace} • {comp?.totalScore}% Common Ground
                    </p>
                  </div>
                </div>

                {/* Safety Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 py-1.5 z-20 animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => {
                          pauseConnection(currentConnection.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2"
                      >
                        <PauseCircle className="w-4 h-4 text-amber-600" />
                        <span>
                          {currentConnection.status === 'paused' ? 'Resume Connection' : 'Pause Connection'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to respectfully disconnect from ${otherUser.name}? You can step back anytime.`)) {
                            disconnectConnection(currentConnection.id);
                            setShowMenu(false);
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4 text-stone-500" />
                        <span>End Connection Gracefully</span>
                      </button>

                      <div className="border-t border-stone-100 dark:border-stone-700 my-1" />

                      <button
                        onClick={() => {
                          setReportTargetUser(otherUser);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span>Report & Block</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Consent and Boundary Reminder Banner */}
              <div className="bg-teal-50/70 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900 px-4 py-2.5 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
                  Connected mutually over:{' '}
                  <strong>{currentConnection.sharedInterests.join(', ')}</strong>
                </span>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 hidden sm:inline">
                  You are both free to pause or step back anytime.
                </span>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/30 dark:bg-stone-950/40">
                {/* Initial Icebreaker Context Card */}
                {currentConnection.initialIcebreaker && (
                  <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-700 shadow-2xs max-w-md mx-auto text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Introductory Icebreaker
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                      "{currentConnection.initialIcebreaker}"
                    </p>
                  </div>
                )}

                {/* Message Bubbles */}
                {currentMessages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-stone-900 dark:bg-teal-700 text-white rounded-br-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 shadow-2xs rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[10px] text-stone-400 dark:text-stone-500">
                          {msg.timestamp}
                        </span>
                        {!isMe && (
                          <button
                            type="button"
                            onClick={() => {
                              setClearSignalsMode('understand');
                              setClearSignalsModalOpen(true);
                            }}
                            className="text-[10px] text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 font-semibold flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                            title="Reflect on this message with ClearSignals"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Reflect</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing simulation indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-stone-400 text-xs pl-2">
                    <div className="flex gap-1 items-center bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      {otherUser.name} is typing a thoughtful reply...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Icebreaker Follow-Up Suggestions */}
              <div className="px-4 py-2 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  Ideas:
                </span>
                {[
                  `What got you started in ${otherUser.interests[0]}?`,
                  `Do you have a favorite spot in ${otherUser.location.split(' ')[0]}?`,
                  `Totally agree! How do you like to spend your Saturdays?`,
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPrompt(idea)}
                    className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-900/40 border border-stone-200 dark:border-stone-700 hover:border-teal-300 dark:hover:border-teal-600 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:text-teal-900 dark:hover:text-teal-200 shrink-0 transition-colors"
                  >
                    "{idea}"
                  </button>
                ))}
              </div>

              {/* ClearSignals Assistant Action Toolbar */}
              <div className="px-4 py-2 bg-gradient-to-r from-teal-50/80 via-stone-50 to-stone-50 dark:from-teal-950/40 dark:via-stone-900/60 dark:to-stone-900/60 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  ClearSignals:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setClearSignalsMode('understand');
                      setClearSignalsModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-900/40 border border-teal-200/90 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-600 rounded-lg text-[11px] font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Eye className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span>Help me understand this</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setClearSignalsMode('reply');
                      setClearSignalsModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-900/40 border border-teal-200/90 dark:border-teal-800 hover:border-teal-300 dark:hover:border-teal-600 rounded-lg text-[11px] font-semibold text-teal-900 dark:text-teal-200 flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Compass className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span>Help me reply</span>
                  </button>
                </div>
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder={`Send a respectful message to ${otherUser.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-2.5 rounded-xl bg-stone-900 dark:bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-stone-400 text-sm">
              Select a connection from the list on the left to view the conversation.
            </div>
          )}
        </div>
      </div>

      {/* ClearSignals Conversation Assistant Modal */}
      {otherUser && currentConnection && (
        <ConversationClearSignalsModal
          isOpen={clearSignalsModalOpen}
          onClose={() => setClearSignalsModalOpen(false)}
          initialMode={clearSignalsMode}
          currentConnection={currentConnection}
          otherUser={otherUser}
          currentUser={currentUser}
          recentMessages={currentMessages}
          onSendMessage={sendMessage}
        />
      )}
    </div>
  );
};
