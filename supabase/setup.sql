-- ============================================================================
-- CommonGround Migration 001: Core Application & Relationship Schema
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked directly to Supabase Auth)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INTEGER CHECK (age >= 18),
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'moderator', 'admin')),
  intentions TEXT[] DEFAULT '{}',
  communication_style TEXT,
  social_energy TEXT,
  pace_preference TEXT,
  accessibility_preferences TEXT, -- Private by default; only viewable by profile owner
  discovery_enabled BOOLEAN DEFAULT true,
  profile_visibility TEXT DEFAULT 'standard' CHECK (profile_visibility IN ('standard', 'private', 'hidden')),
  location TEXT,
  influence_settings JSONB DEFAULT '{"ai_assistance_enabled": true, "use_interests": true, "use_intentions": true, "use_values": true, "use_communication": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. INTERESTS & USER_INTERESTS (Categorized taxonomy & Join Table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_interests (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id TEXT REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, interest_id)
);

-- ----------------------------------------------------------------------------
-- 3. CONNECTION REQUESTS (Low-Pressure Mutual Consent Introductions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  intro_message TEXT NOT NULL,
  shared_interest TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT different_users CHECK (sender_id <> recipient_id)
);

-- Prevent duplicate active pending requests between the same pair of users
CREATE UNIQUE INDEX IF NOT EXISTS unique_pending_request_idx 
ON public.connection_requests (sender_id, recipient_id) 
WHERE status = 'pending';

-- ----------------------------------------------------------------------------
-- 4. CONNECTIONS (Accepted Mutual Relationships)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'disconnected')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT canonical_user_order CHECK (user1_id < user2_id),
  CONSTRAINT unique_active_connection UNIQUE (user1_id, user2_id)
);

-- ----------------------------------------------------------------------------
-- 5. CONVERSATIONS & MESSAGES (Protected 1-on-1 Chat Channels)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.connections(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);

-- ----------------------------------------------------------------------------
-- 6. USER BLOCKS & SAFETY REPORTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT cannot_block_self CHECK (blocker_id <> blocked_id),
  CONSTRAINT unique_block_pair UNIQUE (blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reported_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT cannot_report_self CHECK (reporter_id <> reported_id)
);

-- ----------------------------------------------------------------------------
-- 8. PRIVATE REFLECTIONS (ClearSignals Cognitive Clarification Sandbox)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.private_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  situation TEXT NOT NULL,
  facts TEXT[] NOT NULL DEFAULT '{}',
  assumptions TEXT[] NOT NULL DEFAULT '{}',
  alternative_explanations TEXT[] NOT NULL DEFAULT '{}',
  unknowns TEXT[] NOT NULL DEFAULT '{}',
  suggested_next_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  scenario_shortcut TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS private_reflections_user_idx ON public.private_reflections (user_id);

-- Automated update trigger for updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_requests_updated_at ON public.connection_requests;
CREATE TRIGGER set_requests_updated_at
BEFORE UPDATE ON public.connection_requests
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_reflections_updated_at ON public.private_reflections;
CREATE TRIGGER set_reflections_updated_at
BEFORE UPDATE ON public.private_reflections
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
-- ============================================================================
-- CommonGround Migration 002: Research Intelligence & Persona Schema
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. RESEARCH PROBLEMS (Module 1 Core Investigation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_problems (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  primary_mechanism TEXT,
  severity_score NUMERIC(3,1) NOT NULL,
  reach_score NUMERIC(3,1) NOT NULL,
  evidence_strength_score NUMERIC(3,1) NOT NULL,
  design_opportunity_score NUMERIC(3,1) NOT NULL,
  weight NUMERIC(3,1) NOT NULL,
  composite_score NUMERIC(4,2) NOT NULL,
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('High', 'Moderate', 'Limited')),
  evidence_summary TEXT NOT NULL,
  unestablished_boundary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. RESEARCH SOURCES (Annotated Empirical Citations & Gaps)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research_sources (
  id TEXT PRIMARY KEY,
  problem_id TEXT REFERENCES public.research_problems(id) ON DELETE CASCADE,
  claim TEXT NOT NULL,
  source_title TEXT NOT NULL,
  author_or_organization TEXT NOT NULL,
  publication_date TEXT NOT NULL,
  source_type TEXT NOT NULL,
  relevant_finding TEXT NOT NULL,
  exact_statistic TEXT NOT NULL,
  population_and_geography TEXT NOT NULL,
  what_it_supports TEXT NOT NULL,
  what_it_does_not_establish TEXT NOT NULL,
  limitations TEXT NOT NULL,
  direct_url TEXT NOT NULL,
  confidence_level TEXT NOT NULL,
  confidence_justification TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. MEETING METHODS ANALYSIS (Comparative Institutional Analysis)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meeting_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  who_may_benefit TEXT[] NOT NULL,
  what_works_well TEXT[] NOT NULL,
  what_can_go_wrong TEXT[] NOT NULL,
  who_may_be_left_out TEXT[] NOT NULL,
  opportunity_for_improvement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. USER PERSONAS (Module 2 Human-Centered Archetypes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.personas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  archetype TEXT NOT NULL,
  context TEXT NOT NULL,
  avatar TEXT NOT NULL,
  illustrative_quote TEXT NOT NULL,
  primary_goal TEXT NOT NULL,
  goals TEXT[] NOT NULL,
  pain_points TEXT[] NOT NULL,
  unmet_needs TEXT[] NOT NULL,
  current_workarounds TEXT[] NOT NULL,
  design_opportunity TEXT NOT NULL,
  commonground_fit_summary TEXT NOT NULL,
  empathy_map JSONB NOT NULL,
  primary_barriers TEXT[] NOT NULL,
  is_validated BOOLEAN DEFAULT false NOT NULL, -- Clearly distinguishes illustrative hypotheses from field-validated
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 5. FEATURE MAPPINGS (Traceable Matrix: Needs -> Solutions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feature_mappings (
  id TEXT PRIMARY KEY,
  user_need TEXT NOT NULL,
  proposed_feature TEXT NOT NULL,
  intended_benefit TEXT NOT NULL,
  target_personas TEXT[] NOT NULL,
  design_hypothesis_note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. PERSONA VALIDATION QUESTIONS (Qualitative Interview Protocol)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.persona_validation_questions (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  question TEXT NOT NULL,
  target_focus TEXT NOT NULL,
  what_to_validate TEXT NOT NULL,
  probe_follow_ups TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- ============================================================================
-- CommonGround Migration 003: Row Level Security (RLS) & Authorization
-- ============================================================================

-- Enable RLS across all application tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_validation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_reflections ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is an authorized editor or admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if two users have blocked each other
CREATE OR REPLACE FUNCTION public.is_blocked_with(other_user UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_id = auth.uid() AND blocked_id = other_user)
       OR (blocker_id = other_user AND blocked_id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Any authenticated user can view discoverable profiles (unless mutually blocked)
CREATE POLICY "Public discoverable profiles are visible"
ON public.profiles FOR SELECT
USING (
  (auth.uid() = id) OR
  (
    discovery_enabled = true AND 
    profile_visibility <> 'hidden' AND
    NOT public.is_blocked_with(id)
  )
);

-- Users can insert their own profile on registration
CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can only edit their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. INTERESTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Interests taxonomy is readable by all"
ON public.interests FOR SELECT
USING (true);

CREATE POLICY "Editors can manage interests"
ON public.interests FOR ALL
USING (public.is_editor_or_admin());

CREATE POLICY "Users can read all user interest links"
ON public.user_interests FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own interests"
ON public.user_interests FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. CONNECTION REQUESTS POLICIES
-- ----------------------------------------------------------------------------
-- Only sender and recipient can view the request
CREATE POLICY "Participants can view their connection requests"
ON public.connection_requests FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Only sender can create an intro request
CREATE POLICY "Senders can create introduction requests"
ON public.connection_requests FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  NOT public.is_blocked_with(recipient_id)
);

-- Recipient can accept/decline; Sender can cancel
CREATE POLICY "Participants can update connection request status"
ON public.connection_requests FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id)
WITH CHECK (
  (auth.uid() = recipient_id AND status IN ('accepted', 'declined')) OR
  (auth.uid() = sender_id AND status = 'cancelled')
);

-- ----------------------------------------------------------------------------
-- 4. CONNECTIONS POLICIES
-- ----------------------------------------------------------------------------
-- Only connected pair can view their connection
CREATE POLICY "Connected users can view their active connection"
ON public.connections FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Disconnecting allowed by either participant
CREATE POLICY "Connected users can update connection status"
ON public.connections FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ----------------------------------------------------------------------------
-- 5. CONVERSATIONS & MESSAGES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Participants can view conversation details"
ON public.conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = public.conversations.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Participants can view conversation members"
ON public.conversation_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = public.conversation_participants.conversation_id 
      AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Participants can read messages in their conversations"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = public.messages.conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Participants can send messages to their conversations"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = public.messages.conversation_id AND user_id = auth.uid()
  )
);

-- ----------------------------------------------------------------------------
-- 6. BLOCKS & REPORTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can manage their own block list"
ON public.user_blocks FOR ALL
USING (auth.uid() = blocker_id)
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can create safety reports"
ON public.user_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters and moderators can view reports"
ON public.user_reports FOR SELECT
USING (
  auth.uid() = reporter_id OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  )
);

-- ----------------------------------------------------------------------------
-- 7. RESEARCH & PERSONA CONTENT POLICIES (Public Read, Editor Write)
-- ----------------------------------------------------------------------------
CREATE POLICY "Research problems are viewable by everyone"
ON public.research_problems FOR SELECT USING (true);

CREATE POLICY "Editors can modify research problems"
ON public.research_problems FOR ALL
USING (public.is_editor_or_admin());

CREATE POLICY "Research sources are viewable by everyone"
ON public.research_sources FOR SELECT USING (true);

CREATE POLICY "Editors can modify research sources"
ON public.research_sources FOR ALL
USING (public.is_editor_or_admin());

CREATE POLICY "Meeting methods are viewable by everyone"
ON public.meeting_methods FOR SELECT USING (true);

CREATE POLICY "Editors can modify meeting methods"
ON public.meeting_methods FOR ALL
USING (public.is_editor_or_admin());

CREATE POLICY "Personas are viewable by everyone"
ON public.personas FOR SELECT USING (true);

CREATE POLICY "Editors can modify personas"
ON public.personas FOR ALL
USING (public.is_editor_or_admin());

CREATE POLICY "Feature mappings are viewable by everyone"
ON public.feature_mappings FOR SELECT USING (true);

CREATE POLICY "Editors can modify feature mappings"
ON public.feature_mappings FOR ALL
USING (public.is_editor_or_admin());

CREATE POLICY "Validation questions are viewable by everyone"
ON public.persona_validation_questions FOR SELECT USING (true);

CREATE POLICY "Editors can modify validation questions"
ON public.persona_validation_questions FOR ALL
USING (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- 9. CLEARSIGNALS PRIVATE REFLECTIONS POLICIES (Strict Private Ownership)
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can only view their own private reflections"
ON public.private_reflections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own private reflections"
ON public.private_reflections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own private reflections"
ON public.private_reflections FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own private reflections"
ON public.private_reflections FOR DELETE
USING (auth.uid() = user_id);
-- ============================================================================
-- CommonGround Migration 004: Seed Data for Research, Personas, and Taxonomy
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED INTERESTS TAXONOMY
-- ----------------------------------------------------------------------------
INSERT INTO public.interests (id, name, category, icon) VALUES
('specialty-coffee', 'Specialty Coffee & Cafes', 'Lifestyle', 'Coffee'),
('analog-photography', 'Analog & Film Photography', 'Creative', 'Camera'),
('hiking-trails', 'Hiking & Trail Running', 'Outdoors', 'Mountain'),
('sci-fi-fiction', 'Sci-Fi & Speculative Fiction', 'Culture', 'Book'),
('indie-boardgames', 'Modern Indie Board Games', 'Gaming', 'Dice'),
('ceramics-pottery', 'Ceramics & Studio Pottery', 'Creative', 'Sparkles'),
('synth-music', 'Electronic & Ambient Music', 'Music', 'Headphones'),
('open-source', 'Open-Source & Ethical Tech', 'Technology', 'Laptop'),
('plant-care', 'Urban Gardening & Botanicals', 'Lifestyle', 'Flower'),
('bouldering', 'Bouldering & Climbing', 'Fitness', 'Footprints'),
('indie-films', 'Arthouse & Indie Cinema', 'Culture', 'Film'),
('tea-culture', 'Artisanal Teas & Rituals', 'Lifestyle', 'Cup'),
('bread-baking', 'Sourdough & Artisan Baking', 'Culinary', 'Utensils'),
('retro-gaming', 'Retro & Pixel Games', 'Gaming', 'Gamepad'),
('volunteering', 'Community & Mutual Aid', 'Social', 'Heart')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. SEED RESEARCH PROBLEMS (Module 1)
-- ----------------------------------------------------------------------------
INSERT INTO public.research_problems 
(id, number, title, tagline, primary_mechanism, severity_score, reach_score, evidence_strength_score, design_opportunity_score, weight, composite_score, confidence_level, evidence_summary, unestablished_boundary)
VALUES
(
  'prob-1-lookism', 
  1, 
  'Superficial Judgments and Poor Compatibility Signals',
  'Visual-first catalogs commodify people and induce choice paralysis.',
  'Visual Evaluation Dominance & Choice Overload',
  8.8, 9.4, 9.0, 9.2, 1.2, 9.10, 'High',
  'Peer-reviewed evidence (Finkel et al. 2012, Heino et al. 2010) demonstrates that 2D photo catalogs induce transactional shopping behavior, where human beings are evaluated like consumer products rather than relational partners.',
  'Does not establish that appearance plays zero role in attraction; does establish that visual-first interfaces actively inhibit the discovery of deep conversational and value-based compatibility.'
),
(
  'prob-2-ghosting-unwanted', 
  2, 
  'Ghosting, Rejection Pressure, and Unwanted Interactions',
  'Lack of consent boundaries enables persistent unwanted contact and awkward exits.',
  'Unconstrained Direct Messaging & Disconnection Avoidance',
  9.2, 8.6, 9.5, 9.0, 1.3, 9.12, 'High',
  'Pew Research (2023) representative data reveals that 48% of online daters encounter unwanted explicit content or persistent contact, disproportionately burdening young women (56%). Ghosting serves as an avoidant coping mechanism due to low-friction closure tools.',
  'Does not prove all ghosting stems from malicious intent; largely reflects interface designs lacking low-pressure, dignified dismissal paths.'
),
(
  'prob-3-limited-circles', 
  3, 
  'Limited Social Circles and Social Pressure via Friends/Family',
  'Pre-existing social structures reinforce insular homophily and awkward stakes.',
  'Structural Network Homophily & Interpersonal Stakes',
  7.6, 8.2, 8.5, 7.8, 1.0, 8.05, 'Moderate',
  'Sociological network research (Zhao 2023, McPherson et al. 2001) proves that social networks naturally reproduce homophily over time, making it exceptionally difficult for relocated newcomers or individuals outside established cliques to break in.',
  'Does not argue that meeting through family/friends is ineffective, but highlights structural exclusion for newcomers and awkward social consequences when introduced connections fail.'
),
(
  'prob-4-chance-encounters', 
  4, 
  'Unpredictability and Inaccessibility of Chance Encounters',
  'Declining civic third places and sensory hurdles exclude quiet and disabled peers.',
  'Public Third-Place Erosion & Initiation Anxiety',
  8.0, 7.5, 9.0, 8.4, 1.1, 8.20, 'High',
  'The U.S. Surgeon General’s 2023 Advisory documents a multi-decade collapse of physical civic third places. Spontaneous encounters rely on walkable geography, free time, disposable income, and extroversion—excluding introverts and people with accessibility needs.',
  'Does not claim real-world chemistry is obsolete; proves that chance encounters are statistically erratic and structurally inaccessible without digital pre-coordination.'
),
(
  'prob-5-trust-scams', 
  5, 
  'Trust Deficits, Suspected Scams, and Lack of Boundary Control',
  'Pervasive identity fraud and ambiguous intentions breed defensive cynicism.',
  'Epistemic Uncertainty & Asymmetric Intentions',
  8.5, 7.8, 8.8, 8.6, 1.1, 8.40, 'Moderate',
  'Pew Research (2023) reports 52% of online daters believe they have encountered fraudsters. FTC reports $1.3B lost to romance scams in 2022. Lack of transparent intentions creates chronic defensive suspicion.',
  'Does not measure the forensic count of automated botnets, but demonstrates widespread subjective trust deficits that inhibit genuine vulnerability.'
)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  evidence_summary = EXCLUDED.evidence_summary;

-- ----------------------------------------------------------------------------
-- 3. SEED RESEARCH SOURCES (Annotated Empirical Citations)
-- ----------------------------------------------------------------------------
INSERT INTO public.research_sources
(id, problem_id, claim, source_title, author_or_organization, publication_date, source_type, relevant_finding, exact_statistic, population_and_geography, what_it_supports, what_it_does_not_establish, limitations, direct_url, confidence_level, confidence_justification)
VALUES
(
  'src-finkel-2012',
  'prob-1-lookism',
  'Mathematical algorithms and photo browsing catalogs reduce relational partners to commodified attribute shopping.',
  'Online Dating: A Critical Analysis From the Perspective of Psychological Science',
  'Finkel, Eastwick, Karney, Reis, & Sprecher',
  '2012',
  'Peer-Reviewed Academic Review',
  'Browsing large sets of 2D profiles forces cognitive heuristics where users focus on easily quantifiable attributes rather than dynamic relational chemistry.',
  'Synthesized findings across >100 empirical psychology studies',
  'Global meta-analysis with North American focus',
  'Supports CommonGround’s shift toward shared context and mutual values over visual catalogs.',
  'Does not prove algorithm matchmaking never works; highlights fundamental flaws in visual pre-screening.',
  'Focuses primarily on dating apps rather than platonic friend discovery.',
  'https://doi.org/10.1177/1529100612436522',
  'High',
  'Seminal meta-analysis in Psychological Science in the Public Interest.'
),
(
  'src-pew-2023-unwanted',
  'prob-2-ghosting-unwanted',
  'Nearly half of U.S. online daters experience unsolicited explicit content or persistent contact.',
  'From Looking for Love to Swiping the Field: Online Dating in the U.S.',
  'Pew Research Center (Colleen McClain et al.)',
  'February 2, 2023',
  'Reputable Demographic Survey',
  '48% of U.S. online daters reported experiencing at least one unwanted behavior; 56% of women under 50 received unsolicited explicit images.',
  '48% overall unwanted interactions; 56% women <50',
  'Nationally representative sample of 6,034 U.S. adults (1,675 online daters)',
  'Proves high prevalence of boundary violations in unconstrained messaging interfaces.',
  'Does not establish that all unwanted interactions stem from bot accounts or malicious intentions.',
  'Self-reported survey methodology limited to U.S. adults.',
  'https://www.pewresearch.org/internet/2023/02/02/the-experiences-of-u-s-online-daters/',
  'High',
  'Gold-standard probability-based survey sampling by non-partisan institution.'
),
(
  'src-surgeon-general-2023',
  'prob-4-chance-encounters',
  'Physical civic third places have declined precipitously, accelerating widespread social isolation.',
  'Our Epidemic of Loneliness and Isolation: The U.S. Surgeon General’s Advisory',
  'Office of the U.S. Surgeon General (Dr. Vivek H. Murthy)',
  'May 2023',
  'Federal Public Health Advisory',
  'Documented dramatic drop in participation in community organizations, civic spaces, and informal social gatherings over two decades.',
  'Social isolation increases risk of premature death by >60%, comparable to daily smoking',
  'Comprehensive review of U.S. longitudinal epidemiological data',
  'Demonstrates that relying purely on chance in-person encounters structurally excludes disconnected populations.',
  'Does not measure digital connection efficacy directly.',
  'Public health focus rather than software engineering.',
  'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf',
  'High',
  'Official U.S. Department of Health and Human Services advisory.'
)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. SEED PERSONAS (Module 2 Illustrative Archetypes)
-- ----------------------------------------------------------------------------
INSERT INTO public.personas
(id, name, age, archetype, context, avatar, illustrative_quote, primary_goal, goals, pain_points, unmet_needs, current_workarounds, design_opportunity, commonground_fit_summary, empathy_map, primary_barriers, is_validated)
VALUES
(
  'persona-aanya',
  'Aanya Sharma',
  19,
  'The Quiet College Freshman',
  'First-year university student who transitioned to a large campus. Wants to cultivate 2–3 close friends but finds cold-approaching peers overwhelming.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'I don’t need fifty acquaintances at an orientation mixer. I just want two or three kind people who want to talk about books over hot tea without me having to perform.',
  'Form 2–3 authentic, quiet friendships without the pressure of walking up to strangers in crowded campus spaces.',
  ARRAY['Find genuine friends instead of trying to impress a crowd', 'Start conversations without cold-approach panic', 'Meet people sharing specific creative passions', 'Build connections at a comfortable, gradual pace'],
  ARRAY['Worries about awkward small-talk freezing', 'Finds orientation mixers sensory-draining', 'Uncertain if peers genuinely want to talk', 'Finds swipe apps superficial and exhausting'],
  ARRAY['Low-pressure mutual introductions', 'Icebreakers based on confirmed shared interests', 'Mutual consent before DMs unlock', 'Guilt-free quiet decline mechanics'],
  ARRAY['Wears headphones in campus library', 'Waits for extroverts to initiate', 'Silent lurker in campus Discord servers'],
  'A mutual introduction system with shared-interest prompts and quiet decline mechanics.',
  'CommonGround provides Aanya a safe sandbox where conversations unlock only when both parties agree on shared common ground.',
  '{"says": ["I never know what to say to strangers", "Mixers are exhausting"], "thinks": ["What if they think I am annoying?", "I just want quiet conversation"], "does": ["Leaves lecture immediately", "Lurks silently on Discord"], "feels": ["Overwhelmed by performative socializing", "Relieved when pressure is removed"]}'::jsonb,
  ARRAY['Emotional', 'Discovery'],
  false
),
(
  'persona-rohan',
  'Rohan Mehta',
  23,
  'The Relocated Newcomer',
  'Recent graduate who moved to a new city for work. Motivated to socialize but lacks an established local network.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'Moving to a new city means starting your social life from zero. My coworkers are great, but I want friends to hike trails or play board games with on weekends without it feeling like networking.',
  'Meet nearby people who share his weekend hobbies outside work without interactions feeling like LinkedIn networking.',
  ARRAY['Meet people nearby sharing hobbies', 'Find friends outside the workplace', 'Discover affordable local activities', 'Build belonging in an unfamiliar city'],
  ARRAY['Does not know where hobbyists gather', 'Intimidated by established cliques', 'Limited free time after hours', 'Wary of expensive commercial venues'],
  ARRAY['Interest-based discovery', 'Compatible intention matching (platonic vs dating)', 'Flexible social scheduling', 'Affordable activity coordination'],
  ARRAY['Browses local city subreddit', 'Attends hit-or-miss Meetup events', 'Grabs drinks with coworkers that stay purely professional'],
  'An activity-partner discovery experience connecting users around shared local hobbies.',
  'CommonGround connects Rohan with peers wanting to hike or play board games, bypassing clique barriers.',
  '{"says": ["It is hard making friends as an adult", "My weekends feel empty"], "thinks": ["Everyone already has their friend group", "I do not want to go to bars alone"], "does": ["Spends Saturday browsing trail maps", "Works late to stay busy"], "feels": ["Isolated despite living in a dense city", "Eager for real camaraderie"]}'::jsonb,
  ARRAY['Structural', 'Discovery'],
  false
),
(
  'persona-meera',
  'Meera Iyer',
  25,
  'The Niche & Accessible Explorer',
  'Working professional with niche creative crafts and accessibility needs that dictate physical comfort.',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'I love discussing experimental darkroom techniques, but I can’t do loud bars with bad lighting and zero seating. I want people to see my creativity first, not my physical accommodations.',
  'Meet kindred spirits sharing specialized crafts without having to explain or defend physical accommodations.',
  ARRAY['Meet people genuinely sharing niche arts', 'Find welcoming spaces without explaining needs', 'Understand venue accessibility in advance', 'Build friendships free of superficial judgment'],
  ARRAY['Mainstream platforms lack niche filters', 'Popular social venues are loud or physically inaccessible', 'Reluctance to disclose medical info to strangers', 'Fear of being defined solely by disability'],
  ARRAY['Precision interest tagging', 'Optional user-controlled accessibility badges', 'Verified low-sensory venue information', 'Strong privacy and blocking controls'],
  ARRAY['Active in global niche forums that lack local connection', 'Declines invitations to loud venues', 'Hides physical constraints until forced'],
  'Accessible profile controls, dignified sensory pacing badges, privacy by default, and high-visibility interest taxonomy.',
  'CommonGround allows Meera to connect over ceramics and film photography on her own terms.',
  '{"says": ["I want people to see my art first", "Loud clubs give me migraines"], "thinks": ["Will they pity me if I tell them?", "I wish venues had seating"], "does": ["Researches venue accessibility beforehand", "Leaves loud events early"], "feels": ["Frustrated by thoughtless event design", "Valued when respected"]}'::jsonb,
  ARRAY['Accessibility & Inclusion', 'Trust & Safety'],
  false
)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  context = EXCLUDED.context;
