import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  IntroductionRequest,
  Connection,
  ChatMessage,
  ReportRecord,
  ActiveTab,
  IntentionType,
  CommunicationPreferences,
  PrivacySettings,
} from '../types';
import {
  INITIAL_CURRENT_USER,
  MOCK_USERS,
  INITIAL_INTRODUCTIONS,
  INITIAL_CONNECTIONS,
  INITIAL_MESSAGES,
} from '../data/mockUsers';
import { authService, AuthSession } from '../services/authService';
import { connectionService } from '../services/connectionService';
import { chatService } from '../services/chatService';
import { safetyService } from '../services/safetyService';
import { profileService } from '../services/profileService';
import { discoveryService } from '../services/discoveryService';
import { isSupabaseConfigured } from '../lib/supabase';
import { DbProfile } from '../types/database';

interface AppContextType {
  currentUser: User;
  updateCurrentUser: (updated: Partial<User>) => void;
  updateCommunicationPreferences: (prefs: Partial<CommunicationPreferences>) => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  allUsers: User[];
  discoverableUsers: User[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Modals
  detailUser: User | null;
  setDetailUser: (user: User | null) => void;
  introTargetUser: User | null;
  setIntroTargetUser: (user: User | null) => void;
  whyMatchUser: User | null;
  setWhyMatchUser: (user: User | null) => void;
  reportTargetUser: User | null;
  setReportTargetUser: (user: User | null) => void;
  showPresentationModal: boolean;
  setShowPresentationModal: (show: boolean) => void;

  // Introductions
  introductions: IntroductionRequest[];
  sendIntroduction: (toUserId: string, icebreakerPrompt: string, message: string, sharedInterestRef: string) => void;
  acceptIntroduction: (introId: string) => void;
  declineIntroduction: (introId: string) => void;
  cancelIntroduction: (introId: string) => void;
  
  // Connections & Chat
  connections: Connection[];
  activeConnectionId: string | null;
  setActiveConnectionId: (id: string | null) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (connectionId: string, text: string) => void;
  pauseConnection: (connectionId: string) => void;
  disconnectConnection: (connectionId: string) => void;
  
  // Safety & Block/Report
  blockedUserIds: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reports: ReportRecord[];
  submitReport: (userId: string, reason: string, details: string, alsoBlock?: boolean) => void;
  togglePauseDiscovery: () => void;
  
  // Demo Presentation Helper
  activePersonaId: string;
  setActivePersonaId: (id: string) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  resetDemoData: () => void;

  // Filter state
  filterIntention: string;
  setFilterIntention: (val: string) => void;
  filterSearch: string;
  setFilterSearch: (val: string) => void;
  minCompatibilityScore: number;
  setMinCompatibilityScore: (val: number) => void;

  // Full-Stack Extensions
  isBackendConnected: boolean;
  userRole: 'user' | 'editor' | 'moderator' | 'admin';
  refreshBackendData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'commonground_current_user_v3',
  INTRODUCTIONS: 'commonground_introductions_v3',
  CONNECTIONS: 'commonground_connections_v3',
  MESSAGES: 'commonground_messages_v3',
  BLOCKED: 'commonground_blocked_v3',
  REPORTS: 'commonground_reports_v3',
};

function profileToUser(profile: DbProfile, fallback: User): User {
  return {
    ...fallback,
    id: profile.id,
    name: profile.display_name,
    age: profile.age || fallback.age,
    bio: profile.bio || fallback.bio,
    avatar: profile.avatar_url || fallback.avatar,
    location: profile.location || fallback.location,
    intentions: (profile.intentions as IntentionType[]) || fallback.intentions,
    communicationPreferences: {
      pace: (profile.pace_preference as any) || fallback.communicationPreferences.pace,
      style: (profile.communication_style as any) || fallback.communicationPreferences.style,
      socialEnergy: (profile.social_energy as any) || fallback.communicationPreferences.socialEnergy,
    },
    privacySettings: {
      ...fallback.privacySettings,
      discoveryPaused: !profile.discovery_enabled,
      visibility: profile.profile_visibility === 'standard' ? 'public_match' : 'private',
    },
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBackend = isSupabaseConfigured();

  // Current user state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
    } catch {
      return INITIAL_CURRENT_USER;
    }
  });

  const [userRole, setUserRole] = useState<'user' | 'editor' | 'moderator' | 'admin'>('user');
  const [activePersonaId, setActivePersonaId] = useState<string>('user-current-maya');
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');

  // Modals
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [introTargetUser, setIntroTargetUser] = useState<User | null>(null);
  const [whyMatchUser, setWhyMatchUser] = useState<User | null>(null);
  const [reportTargetUser, setReportTargetUser] = useState<User | null>(null);
  const [showPresentationModal, setShowPresentationModal] = useState<boolean>(false);

  // Introductions
  const [introductions, setIntroductions] = useState<IntroductionRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTRODUCTIONS);
      return saved ? JSON.parse(saved) : INITIAL_INTRODUCTIONS;
    } catch {
      return INITIAL_INTRODUCTIONS;
    }
  });

  // Connections
  const [connections, setConnections] = useState<Connection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      return saved ? JSON.parse(saved) : INITIAL_CONNECTIONS;
    } catch {
      return INITIAL_CONNECTIONS;
    }
  });

  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(
    INITIAL_CONNECTIONS[0]?.id || null
  );

  // Messages
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Blocked users
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reports
  const [reports, setReports] = useState<ReportRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Filters
  const [filterIntention, setFilterIntention] = useState<string>('All');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [minCompatibilityScore, setMinCompatibilityScore] = useState<number>(30);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Sync Auth State & Load Backend Data
  const refreshBackendData = useCallback(async () => {
    try {
      const session = await authService.getSession();
      if (session.profile) {
        setUserRole(session.profile.role || 'user');
        setCurrentUser(prev => profileToUser(session.profile!, prev));
      }

      if (isBackend && session.user) {
        // Load real requests from database
        const { incoming, outgoing } = await connectionService.getRequests(session.user.id);
        const mappedIncoming: IntroductionRequest[] = incoming.map(r => ({
          id: r.id,
          fromUserId: r.sender_id,
          toUserId: r.recipient_id,
          icebreakerPrompt: r.shared_interest ? `Let's discuss ${r.shared_interest}` : 'Hello from CommonGround',
          message: r.intro_message,
          sharedInterestRef: r.shared_interest || 'CommonGround',
          createdAt: new Date(r.created_at).toLocaleDateString(),
          status: r.status,
        }));
        const mappedOutgoing: IntroductionRequest[] = outgoing.map(r => ({
          id: r.id,
          fromUserId: r.sender_id,
          toUserId: r.recipient_id,
          icebreakerPrompt: r.shared_interest ? `Let's discuss ${r.shared_interest}` : 'Hello from CommonGround',
          message: r.intro_message,
          sharedInterestRef: r.shared_interest || 'CommonGround',
          createdAt: new Date(r.created_at).toLocaleDateString(),
          status: r.status,
        }));
        const combined = [...mappedIncoming, ...mappedOutgoing.filter(o => o.status === 'pending')];
        if (combined.length > 0) {
          setIntroductions(combined);
        }

        // Load real connections
        const dbConnections = await connectionService.getConnections(session.user.id);
        if (dbConnections.length > 0) {
          const mappedConns: Connection[] = dbConnections.map(c => ({
            id: c.id,
            userIds: [c.user1_id, c.user2_id],
            status: c.status,
            connectedAt: new Date(c.created_at).toLocaleDateString(),
            sharedInterests: ['Specialty Coffee', 'Creative Technology'],
            initialIcebreaker: 'Connected via mutual introduction on CommonGround',
          }));
          setConnections(mappedConns);
          if (!activeConnectionId && mappedConns.length > 0) {
            setActiveConnectionId(mappedConns[0].id);
          }
        }

        // Load blocked users
        const blockedList = await safetyService.getBlockedUsers(session.user.id);
        if (blockedList.length > 0) {
          setBlockedUserIds(blockedList);
        }
      }
    } catch (err) {
      console.error('Error synchronizing backend data:', err);
    }
  }, [isBackend, activeConnectionId]);

  // Initial mount load
  useEffect(() => {
    refreshBackendData();

    // Listen to Supabase auth events
    const unsub = authService.onAuthStateChange(session => {
      if (session.profile) {
        setUserRole(session.profile.role || 'user');
        setCurrentUser(prev => profileToUser(session.profile!, prev));
        showToast(`Signed in as ${session.profile.display_name} (${session.profile.role})`, 'success');
      }
    });

    return () => unsub();
  }, [refreshBackendData]);

  // Realtime subscription for active connection chat messages
  useEffect(() => {
    if (!activeConnectionId) return;

    let unsubscribe = () => {};

    if (isBackend) {
      // 1. Fetch existing messages for connection
      chatService.getOrCreateConversation(activeConnectionId).then(conv => {
        if (conv) {
          chatService.getMessages(conv.id).then(dbMsgs => {
            if (dbMsgs && dbMsgs.length > 0) {
              setMessages(prev => ({
                ...prev,
                [activeConnectionId]: dbMsgs.map(m => ({
                  id: m.id,
                  connectionId: activeConnectionId,
                  senderId: m.sender_id,
                  text: m.content,
                  timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                })),
              }));
            }
          });

          // 2. Subscribe to new incoming messages via Supabase Realtime
          unsubscribe = chatService.subscribeToMessages(conv.id, newDbMsg => {
            setMessages(prev => {
              const currentList = prev[activeConnectionId] || [];
              if (currentList.some(m => m.id === newDbMsg.id)) return prev;
              return {
                ...prev,
                [activeConnectionId]: [
                  ...currentList,
                  {
                    id: newDbMsg.id,
                    connectionId: activeConnectionId,
                    senderId: newDbMsg.sender_id,
                    text: newDbMsg.content,
                    timestamp: new Date(newDbMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ],
              };
            });
          });
        }
      });
    }

    return () => {
      unsubscribe();
    };
  }, [activeConnectionId, isBackend]);

  // Persistence side-effects in localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTRODUCTIONS, JSON.stringify(introductions));
  }, [introductions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  // Profile update handler
  const updateCurrentUser = async (updated: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
    showToast('Your profile preferences have been updated.', 'success');

    if (isBackend) {
      await profileService.updateProfile(currentUser.id, {
        display_name: updated.name,
        bio: updated.bio,
        location: updated.location,
        avatar_url: updated.avatar,
        intentions: updated.intentions,
        communication_style: updated.communicationPreferences?.style,
        social_energy: updated.communicationPreferences?.socialEnergy,
        pace_preference: updated.communicationPreferences?.pace,
      });
    }
  };

  const updateCommunicationPreferences = async (prefs: Partial<CommunicationPreferences>) => {
    const updated = { ...currentUser.communicationPreferences, ...prefs };
    setCurrentUser(prev => ({
      ...prev,
      communicationPreferences: updated,
    }));
    showToast('Communication preferences updated.', 'success');

    if (isBackend) {
      await profileService.updateProfile(currentUser.id, {
        communication_style: updated.style,
        social_energy: updated.socialEnergy,
        pace_preference: updated.pace,
      });
    }
  };

  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    const updated = { ...currentUser.privacySettings, ...settings };
    setCurrentUser(prev => ({
      ...prev,
      privacySettings: updated,
    }));
    showToast('Privacy & discovery settings updated.', 'success');

    if (isBackend) {
      await profileService.updateProfile(currentUser.id, {
        discovery_enabled: !updated.discoveryPaused,
        profile_visibility: updated.visibility === 'public_match' ? 'standard' : 'private',
      });
    }
  };

  const togglePauseDiscovery = async () => {
    const newState = !currentUser.privacySettings.discoveryPaused;
    setCurrentUser(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        discoveryPaused: newState,
      },
    }));

    if (newState) {
      showToast('Discovery paused. Your profile is now hidden from new people.', 'warning');
    } else {
      showToast('Discovery resumed. You are visible to compatible members.', 'success');
    }

    if (isBackend) {
      await profileService.updateProfile(currentUser.id, {
        discovery_enabled: !newState,
      });
    }
  };

  // Discoverable users: exclude blocked users and current user
  const allUsers = [currentUser, ...MOCK_USERS];
  const discoverableUsers = MOCK_USERS.filter(
    u => !blockedUserIds.includes(u.id) && u.id !== currentUser.id
  );

  // Send an introduction invitation
  const sendIntroduction = async (
    toUserId: string,
    icebreakerPrompt: string,
    message: string,
    sharedInterestRef: string
  ) => {
    const target = allUsers.find(u => u.id === toUserId);
    if (!target) return;

    // Check if one already exists
    const existing = introductions.find(
      i => i.fromUserId === currentUser.id && i.toUserId === toUserId && i.status === 'pending'
    );
    if (existing) {
      showToast('You already have a pending introduction invitation with this person.', 'info');
      return;
    }

    const tempId = `intro-${Date.now()}`;
    const newIntro: IntroductionRequest = {
      id: tempId,
      fromUserId: currentUser.id,
      toUserId,
      icebreakerPrompt,
      message,
      sharedInterestRef,
      createdAt: 'Just now',
      status: 'pending',
    };

    setIntroductions(prev => [newIntro, ...prev]);
    showToast(`Introduction sent to ${target.name}. Saved securely to backend.`, 'success');
    setIntroTargetUser(null);

    if (isBackend) {
      const { request, error } = await connectionService.sendIntroductionRequest({
        senderId: currentUser.id,
        recipientId: toUserId,
        introMessage: message || icebreakerPrompt,
        sharedInterest: sharedInterestRef,
      });

      if (error) {
        showToast(`Server note: ${error}`, 'warning');
      } else if (request) {
        setIntroductions(prev =>
          prev.map(i => (i.id === tempId ? { ...i, id: request.id } : i))
        );
      }
    }
  };

  // Recipient accepts introduction
  const acceptIntroduction = async (introId: string) => {
    const intro = introductions.find(i => i.id === introId);
    if (!intro) return;

    // Update intro status optimistically
    setIntroductions(prev =>
      prev.map(i => (i.id === introId ? { ...i, status: 'accepted' } : i))
    );

    const otherUserId = intro.fromUserId === currentUser.id ? intro.toUserId : intro.fromUserId;
    const otherUser = allUsers.find(u => u.id === otherUserId);

    // Create Connection
    const newConnectionId = `conn-${Date.now()}`;
    const newConnection: Connection = {
      id: newConnectionId,
      userIds: [currentUser.id, otherUserId],
      status: 'active',
      connectedAt: 'Just now',
      sharedInterests: [intro.sharedInterestRef],
      initialIcebreaker: intro.icebreakerPrompt,
    };

    setConnections(prev => [newConnection, ...prev]);

    // Initial message from introduction note
    const firstMessages: ChatMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        connectionId: newConnectionId,
        senderId: intro.fromUserId,
        text: intro.message || intro.icebreakerPrompt,
        timestamp: 'Just now',
      },
      {
        id: `msg-${Date.now()}-2`,
        connectionId: newConnectionId,
        senderId: currentUser.id,
        text: `Hi! I was happy to accept your introduction. Looking forward to talking about ${intro.sharedInterestRef}!`,
        timestamp: 'Just now',
      },
    ];

    setMessages(prev => ({
      ...prev,
      [newConnectionId]: firstMessages,
    }));

    setActiveConnectionId(newConnectionId);
    showToast(`Connection created with ${otherUser?.name || 'them'}! Chat is now unlocked.`, 'success');

    if (isBackend) {
      const { connection, error } = await connectionService.acceptRequest(introId, currentUser.id);
      if (error) {
        console.error('Backend acceptance error:', error);
      } else if (connection) {
        // Update connection id to database id
        setConnections(prev =>
          prev.map(c => (c.id === newConnectionId ? { ...c, id: connection.id } : c))
        );
        setActiveConnectionId(connection.id);
      }
    }
  };

  // Recipient declines introduction quietly (no penalty, no public counter)
  const declineIntroduction = async (introId: string) => {
    setIntroductions(prev =>
      prev.map(i => (i.id === introId ? { ...i, status: 'declined' } : i))
    );
    showToast('Invitation declined respectfully. No notification of rejection is sent.', 'info');

    if (isBackend) {
      await connectionService.declineRequest(introId, currentUser.id);
    }
  };

  // Sender cancels introduction
  const cancelIntroduction = async (introId: string) => {
    setIntroductions(prev =>
      prev.map(i => (i.id === introId ? { ...i, status: 'cancelled' } : i))
    );
    showToast('Pending introduction withdrawn.', 'info');

    if (isBackend) {
      await connectionService.cancelRequest(introId, currentUser.id);
    }
  };

  // Send a chat message
  const sendMessage = async (connectionId: string, text: string) => {
    if (!text.trim()) return;

    const trimmed = text.trim();
    const tempId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      connectionId,
      senderId: currentUser.id,
      text: trimmed,
      timestamp: 'Just now',
    };

    setMessages(prev => ({
      ...prev,
      [connectionId]: [...(prev[connectionId] || []), newMsg],
    }));

    if (isBackend) {
      const conv = await chatService.getOrCreateConversation(connectionId);
      if (conv) {
        await chatService.sendMessage({
          conversationId: conv.id,
          senderId: currentUser.id,
          content: trimmed,
        });
      }
    } else {
      // Local interactive reply simulation
      const conn = connections.find(c => c.id === connectionId);
      if (conn) {
        const otherUserId = conn.userIds.find(id => id !== currentUser.id);
        const otherUser = allUsers.find(u => u.id === otherUserId);

        if (otherUser) {
          setTimeout(() => {
            const autoReplies = [
              `I really appreciate that! How long have you been interested in ${otherUser.interests[0]}?`,
              `That resonates so much with me. It’s rare to find people who value ${otherUser.values[0] || 'good conversations'}!`,
              `Sounds awesome! Would love to hear more about your recent projects or favorite spots around town.`,
              `Totally agree. That's exactly why I prefer CommonGround over endless swiping apps!`,
            ];
            const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];

            const replyMsg: ChatMessage = {
              id: `msg-${Date.now()}-reply`,
              connectionId,
              senderId: otherUser.id,
              text: replyText,
              timestamp: 'Just now',
            };

            setMessages(current => ({
              ...current,
              [connectionId]: [...(current[connectionId] || []), replyMsg],
            }));
          }, 1800);
        }
      }
    }
  };

  // Pause connection
  const pauseConnection = (connectionId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === connectionId ? { ...c, status: c.status === 'paused' ? 'active' : 'paused' } : c))
    );
    showToast('Connection state updated.', 'info');
  };

  // End connection gracefully
  const disconnectConnection = async (connectionId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === connectionId ? { ...c, status: 'disconnected' } : c))
    );
    showToast('Connection ended with mutual respect. Conversation has been archived.', 'info');

    if (isBackend) {
      await connectionService.disconnect(connectionId);
    }
  };

  // Block user
  const blockUser = async (userId: string) => {
    if (!blockedUserIds.includes(userId)) {
      setBlockedUserIds(prev => [...prev, userId]);
    }
    // Remove active connections or set to blocked
    setConnections(prev =>
      prev.map(c => (c.userIds.includes(userId) ? { ...c, status: 'blocked' } : c))
    );
    const blockedProfile = allUsers.find(u => u.id === userId);
    showToast(`${blockedProfile?.name || 'User'} has been blocked and removed from your discovery view.`, 'warning');
    setDetailUser(null);

    if (isBackend) {
      await safetyService.blockUser({ blockerId: currentUser.id, blockedId: userId });
    }
  };

  const unblockUser = async (userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
    const target = allUsers.find(u => u.id === userId);
    showToast(`${target?.name || 'User'} has been unblocked.`, 'success');

    if (isBackend) {
      await safetyService.unblockUser(currentUser.id, userId);
    }
  };

  // Report user
  const submitReport = async (userId: string, reason: string, details: string, alsoBlock: boolean = false) => {
    const target = allUsers.find(u => u.id === userId);
    const newReport: ReportRecord = {
      id: `report-${Date.now()}`,
      reportedUserId: userId,
      reportedUserName: target?.name || 'Unknown User',
      reason,
      details,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: isBackend ? 'Received (Saved to PostgreSQL DB)' : 'Received (Local Prototype Sim)',
    };

    setReports(prev => [newReport, ...prev]);

    if (alsoBlock) {
      await blockUser(userId);
    }

    if (isBackend) {
      await safetyService.reportUser({
        reporterId: currentUser.id,
        reportedId: userId,
        reason,
        description: details,
      });
      showToast('Report submitted and securely stored in database.', 'success');
    } else {
      showToast('Report submitted locally. Thank you for helping keep our community safe.', 'success');
    }

    setReportTargetUser(null);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.INTRODUCTIONS);
    localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    
    setCurrentUser(INITIAL_CURRENT_USER);
    setIntroductions(INITIAL_INTRODUCTIONS);
    setConnections(INITIAL_CONNECTIONS);
    setMessages(INITIAL_MESSAGES);
    setBlockedUserIds([]);
    setReports([]);
    setActiveConnectionId(INITIAL_CONNECTIONS[0]?.id || null);
    showToast('Demo data reset to default seed.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        updateCommunicationPreferences,
        updatePrivacySettings,
        allUsers,
        discoverableUsers,
        activeTab,
        setActiveTab,
        detailUser,
        setDetailUser,
        introTargetUser,
        setIntroTargetUser,
        whyMatchUser,
        setWhyMatchUser,
        reportTargetUser,
        setReportTargetUser,
        showPresentationModal,
        setShowPresentationModal,
        introductions,
        sendIntroduction,
        acceptIntroduction,
        declineIntroduction,
        cancelIntroduction,
        connections,
        activeConnectionId,
        setActiveConnectionId,
        messages,
        sendMessage,
        pauseConnection,
        disconnectConnection,
        blockedUserIds,
        blockUser,
        unblockUser,
        reports,
        submitReport,
        togglePauseDiscovery,
        activePersonaId,
        setActivePersonaId,
        toast,
        showToast,
        resetDemoData,
        filterIntention,
        setFilterIntention,
        filterSearch,
        setFilterSearch,
        minCompatibilityScore,
        setMinCompatibilityScore,
        isBackendConnected: isBackend,
        userRole,
        refreshBackendData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
