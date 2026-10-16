import React, { createContext, useContext, useState, useEffect } from 'react';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'commonground_current_user_v2',
  INTRODUCTIONS: 'commonground_introductions_v2',
  CONNECTIONS: 'commonground_connections_v2',
  MESSAGES: 'commonground_messages_v2',
  BLOCKED: 'commonground_blocked_v2',
  REPORTS: 'commonground_reports_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state with local storage hydration
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
    } catch {
      return INITIAL_CURRENT_USER;
    }
  });

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

  // Persistence side-effects
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

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const updateCurrentUser = (updated: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
    showToast('Your profile preferences have been updated.', 'success');
  };

  const updateCommunicationPreferences = (prefs: Partial<CommunicationPreferences>) => {
    setCurrentUser(prev => ({
      ...prev,
      communicationPreferences: { ...prev.communicationPreferences, ...prefs },
    }));
    showToast('Communication preferences updated.', 'success');
  };

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setCurrentUser(prev => ({
      ...prev,
      privacySettings: { ...prev.privacySettings, ...settings },
    }));
    showToast('Privacy & discovery settings updated.', 'success');
  };

  const togglePauseDiscovery = () => {
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
  };

  // Discoverable users: exclude blocked users and current user
  const allUsers = [currentUser, ...MOCK_USERS];
  const discoverableUsers = MOCK_USERS.filter(
    u => !blockedUserIds.includes(u.id) && u.id !== currentUser.id
  );

  // Send an introduction invitation
  const sendIntroduction = (
    toUserId: string,
    icebreakerPrompt: string,
    message: string,
    sharedInterestRef: string
  ) => {
    const target = MOCK_USERS.find(u => u.id === toUserId);
    if (!target) return;

    // Check if one already exists
    const existing = introductions.find(
      i => i.fromUserId === currentUser.id && i.toUserId === toUserId && i.status === 'pending'
    );
    if (existing) {
      showToast('You already have a pending introduction invitation with this person.', 'info');
      return;
    }

    const newIntro: IntroductionRequest = {
      id: `intro-${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId,
      icebreakerPrompt,
      message,
      sharedInterestRef,
      createdAt: 'Just now',
      status: 'pending',
    };

    setIntroductions(prev => [newIntro, ...prev]);
    showToast(`Introduction sent to ${target.name}. They can accept or decline without pressure.`, 'success');
    setIntroTargetUser(null);
  };

  // Recipient accepts introduction
  const acceptIntroduction = (introId: string) => {
    const intro = introductions.find(i => i.id === introId);
    if (!intro) return;

    // Update intro status
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
  };

  // Recipient declines introduction quietly (no penalty, no public counter)
  const declineIntroduction = (introId: string) => {
    setIntroductions(prev =>
      prev.map(i => (i.id === introId ? { ...i, status: 'declined' } : i))
    );
    showToast('Invitation declined respectfully. No notification of rejection is sent.', 'info');
  };

  // Sender cancels introduction
  const cancelIntroduction = (introId: string) => {
    setIntroductions(prev =>
      prev.map(i => (i.id === introId ? { ...i, status: 'cancelled' } : i))
    );
    showToast('Pending introduction withdrawn.', 'info');
  };

  // Send a chat message
  const sendMessage = (connectionId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      connectionId,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages(prev => ({
      ...prev,
      [connectionId]: [...(prev[connectionId] || []), newMsg],
    }));

    // Find other user in connection to simulate an interactive reply after 1.8 seconds!
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
  };

  // Pause connection
  const pauseConnection = (connectionId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === connectionId ? { ...c, status: c.status === 'paused' ? 'active' : 'paused' } : c))
    );
    showToast('Connection state updated.', 'info');
  };

  // End connection gracefully
  const disconnectConnection = (connectionId: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === connectionId ? { ...c, status: 'disconnected' } : c))
    );
    showToast('Connection ended with mutual respect. Conversation has been archived.', 'info');
  };

  // Block user
  const blockUser = (userId: string) => {
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
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
    const target = allUsers.find(u => u.id === userId);
    showToast(`${target?.name || 'User'} has been unblocked.`, 'success');
  };

  // Report user
  const submitReport = (userId: string, reason: string, details: string, alsoBlock: boolean = false) => {
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
      status: 'Received (Local Prototype Sim)',
    };

    setReports(prev => [newReport, ...prev]);

    if (alsoBlock) {
      blockUser(userId);
    }

    showToast(
      `Report submitted locally. Thank you for helping keep our community safe and respectful.`,
      'success'
    );
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
