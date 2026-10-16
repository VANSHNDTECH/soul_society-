export interface DbProfile {
  id: string;
  display_name: string;
  age?: number | null;
  bio?: string | null;
  avatar_url?: string | null;
  role: 'user' | 'editor' | 'moderator' | 'admin';
  intentions: string[];
  communication_style?: string | null;
  social_energy?: string | null;
  pace_preference?: string | null;
  accessibility_preferences?: string | null;
  discovery_enabled: boolean;
  profile_visibility: 'standard' | 'private' | 'hidden';
  location?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbInterest {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  created_at: string;
}

export interface DbConnectionRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  intro_message: string;
  shared_interest?: string | null;
  created_at: string;
  updated_at: string;
  sender?: DbProfile;
  recipient?: DbProfile;
}

export interface DbConnection {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'active' | 'disconnected';
  created_at: string;
  updated_at: string;
  user1?: DbProfile;
  user2?: DbProfile;
}

export interface DbConversation {
  id: string;
  connection_id: string;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at?: string | null;
  created_at: string;
}

export interface DbUserBlock {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface DbUserReport {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  description?: string | null;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

export interface DbResearchProblem {
  id: string;
  number: number;
  title: string;
  tagline?: string | null;
  primary_mechanism?: string | null;
  severity_score: number;
  reach_score: number;
  evidence_strength_score: number;
  design_opportunity_score: number;
  weight: number;
  composite_score: number;
  confidence_level: 'High' | 'Moderate' | 'Limited';
  evidence_summary: string;
  unestablished_boundary: string;
  created_at: string;
  updated_at: string;
}

export interface DbResearchSource {
  id: string;
  problem_id: string;
  claim: string;
  source_title: string;
  author_or_organization: string;
  publication_date: string;
  source_type: string;
  relevant_finding: string;
  exact_statistic: string;
  population_and_geography: string;
  what_it_supports: string;
  what_it_does_not_establish: string;
  limitations: string;
  direct_url: string;
  confidence_level: string;
  confidence_justification: string;
  created_at: string;
}

export interface DbPersona {
  id: string;
  name: string;
  age: number;
  archetype: string;
  context: string;
  avatar: string;
  illustrative_quote: string;
  primary_goal: string;
  goals: string[];
  pain_points: string[];
  unmet_needs: string[];
  current_workarounds: string[];
  design_opportunity: string;
  commonground_fit_summary: string;
  empathy_map: {
    says: string[];
    thinks: string[];
    does: string[];
    feels: string[];
  };
  primary_barriers: string[];
  is_validated: boolean;
  created_at: string;
  updated_at: string;
}
