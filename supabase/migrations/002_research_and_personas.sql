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
