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
