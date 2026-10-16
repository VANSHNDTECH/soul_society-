export type IntentionType =
  | 'Friendship'
  | 'Dating'
  | 'Activity Partners'
  | 'Professional Networking'
  | 'Community & Learning';

export type CommunicationPace =
  | 'Gradual & thoughtful'
  | 'Balanced & steady'
  | 'Quick & spontaneous';

export type CommunicationStyle =
  | 'Deep & reflective'
  | 'Lighthearted & casual'
  | 'Activity-focused'
  | 'Prompt & concise';

export type SocialEnergy =
  | 'Introverted / Calm'
  | 'Ambivert / Adaptable'
  | 'Extroverted / High energy';

export interface CommunicationPreferences {
  pace: CommunicationPace;
  style: CommunicationStyle;
  socialEnergy: SocialEnergy;
}

export interface InfluenceSettings {
  aiAssistanceEnabled: boolean;
  useInterestsInMatching: boolean;
  useIntentionsInMatching: boolean;
  useValuesInMatching: boolean;
  useCommunicationPaceInMatching: boolean;
}

export interface PrivacySettings {
  discoveryPaused: boolean;
  visibility: 'public_match' | 'intentions_only' | 'private';
  showLocation: boolean;
  introRequirement: 'any' | 'shared_intention' | 'high_match';
  aiAssistanceEnabled?: boolean;
  influenceSettings?: InfluenceSettings;
}

export interface User {
  id: string;
  name: string;
  pronouns?: string;
  age?: number;
  headline: string;
  bio: string;
  location: string;
  avatar: string;
  avatarColor: string;
  interests: string[];
  intentions: IntentionType[];
  values: string[];
  communicationPreferences: CommunicationPreferences;
  privacySettings: PrivacySettings;
  joinedDate: string;
}

export interface CompatibilityResult {
  totalScore: number;
  score?: number;
  interestScore: number; // 40% weight
  intentionScore: number; // 30% weight
  valueScore: number; // 20% weight
  communicationScore: number; // 10% weight
  sharedInterests: string[];
  sharedIntentions: IntentionType[];
  sharedValues: string[];
  paceMatch: boolean;
  styleMatch: boolean;
  energyMatch: boolean;
  explanation: string;
  breakdownBullets: string[];
  reasons?: string[];
  activeFactors?: string[];
  inactiveFactors?: string[];
  isDemoProfile?: boolean;
}

export interface IntroductionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  icebreakerPrompt: string;
  message: string;
  sharedInterestRef: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
}

export interface Connection {
  id: string;
  userIds: [string, string];
  status: 'active' | 'paused' | 'disconnected' | 'blocked';
  connectedAt: string;
  sharedInterests: string[];
  initialIcebreaker: string;
}

export interface ChatMessage {
  id: string;
  connectionId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ReportRecord {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'Received (Saved to PostgreSQL DB)' | 'Received (Local Prototype Sim)' | 'Reviewed' | 'Action Taken';
}

export type ActiveTab =
  | 'landing'
  | 'onboarding'
  | 'discovery'
  | 'requests'
  | 'chat'
  | 'safety'
  | 'clearsignals'
  | 'opensignals'
  | 'presentation';
