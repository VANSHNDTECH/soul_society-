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
