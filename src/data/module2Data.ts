import {
  PersonaItem,
  BarrierItem,
  CurrentMethodAnalysis,
  FeatureMappingItem,
  PersonaValidationQuestion,
  MethodologyStage,
  EpistemicCategory,
  AcademicReference,
} from '../types/module2';

export const MODULE2_OVERVIEW_META = {
  title: 'The People Left Out',
  moduleNumber: 'Module 2',
  centralQuestion:
    'Who struggles to make meaningful connections, what prevents them from doing so, and how can a more inclusive, low-pressure, consent-based platform help?',
  subtitle:
    'Understanding the human pain points, invisible barriers, and unmet needs of individuals excluded by modern connection paradigms.',
  academicContext: 'CommonGround Human-Centered Design & Accessibility Initiative',
  personaCount: 3,
  barrierCategoryCount: 5,
  currentMethodsCount: 6,
  status: 'Research Hypotheses & Illustrative Personas (Subject to Field Validation)',
};

export const PERSONAS: PersonaItem[] = [
  {
    id: 'persona-aanya',
    name: 'Aanya Sharma',
    age: 19,
    archetype: 'The Quiet College Freshman',
    context:
      'First-year university student who recently transitioned to a large campus. She wants to cultivate a few close, genuine friendships but finds approaching unfamiliar peers overwhelming.',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    illustrativeQuote:
      'I don’t need fifty acquaintances at an orientation mixer. I just want two or three kind people who want to talk about books over hot tea without me having to perform.',
    primaryGoal:
      'Form 2–3 authentic, quiet friendships without the pressure of walking up to strangers in crowded campus spaces.',
    goals: [
      'Find a few genuine friends instead of trying to impress a large social group.',
      'Start conversations without the pressure of cold-approaching strangers in person.',
      'Meet people who share her specific passions for speculative fiction, cozy indie games, and analog crafts.',
      'Build connections gradually at a comfortable, low-stress pace.',
    ],
    painPoints: [
      'Worries intensely about awkward pauses and small-talk freezing in first conversations.',
      'Finds large campus gatherings, dorm parties, and orientation mixers sensory-draining.',
      'Constantly uncertain whether others genuinely want to talk to her or are just being polite.',
      'Finds swipe-based dating and friend apps impersonal, superficial, and emotionally exhausting.',
      'Often misses potential social opportunities because she hesitates to initiate contact.',
    ],
    unmetNeeds: [
      'Low-pressure introductions that do not require witty on-the-spot opening lines.',
      'Conversation starters automatically tailored to mutually confirmed shared interests.',
      'Clear mutual consent before any private, one-on-one conversation begins.',
      'The ability to decline, step back, or pause interactions with zero social guilt or public rejection.',
      'Control over the pace and cadence of getting to know someone (asynchronous pacing).',
    ],
    currentWorkarounds: [
      'Spends free time in the quiet section of the library with noise-canceling headphones.',
      'Waits passively for extroverted classmates to initiate conversation first.',
      'Joins large university Discord servers but stays exclusively in silent "lurker" mode.',
    ],
    designOpportunity:
      'A mutual introduction system with shared-interest prompts, optional icebreaker suggestions, and quiet decline mechanics.',
    commonGroundFitSummary:
      'CommonGround provides Aanya with a safe sandbox: no photos are ranked, introductions require mutual consent, and conversations unlock only when both people share common ground, protecting her social battery.',
    empathyMap: {
      says: [
        '“I’d rather stay in my room with a book than go to a crowded orientation mixer.”',
        '“I never know what to say to people I don’t know.”',
        '“I wish I could find people who like the same quiet things as me.”',
      ],
      thinks: [
        '“Everyone else seems to form friend groups effortlessly; what am I doing wrong?”',
        '“If I message them first, will they think I’m annoying or desperate?”',
        '“I want meaningful conversation, not small talk about campus weather.”',
      ],
      does: [
        'Arrives right on time to lectures and leaves immediately when class concludes.',
        'Spends weekend mornings at quiet local coffee shops writing or reading alone.',
        'Downloads social apps, browses a few profiles with anxiety, and deletes the app within two days.',
      ],
      feels: [
        'Isolated and homesick despite being surrounded by thousands of students.',
        'Overwhelmed by performative social expectations.',
        'Relieved when interaction pressure is removed.',
      ],
    },
    primaryBarriers: ['Emotional', 'Discovery'],
  },
  {
    id: 'persona-rohan',
    name: 'Rohan Mehta',
    age: 23,
    archetype: 'The Relocated Newcomer',
    context:
      'Recent engineering graduate who moved to a new metropolitan city for his first professional job. He is motivated to socialize but lacks an established local network.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    illustrativeQuote:
      'Moving to a new city means starting your social life from zero. My coworkers are great, but I want friends to hike trails or play board games with on weekends without it feeling like a LinkedIn networking event.',
    primaryGoal:
      'Build a vibrant circle of local hobby buddies and friends outside his workplace on an accessible budget.',
    goals: [
      'Meet people living nearby who share his hobbies (bouldering, cooperative strategy board games, gravel cycling).',
      'Establish a personal social circle entirely distinct from his corporate workplace.',
      'Discover welcoming, affordable local activities and third places.',
      'Build an authentic sense of belonging in a city where he has no childhood roots.',
    ],
    painPoints: [
      'Does not know where people with similar niche hobbies organically gather.',
      'Finds existing, tight-knit local friend groups intimidating or difficult to penetrate.',
      'Has limited free time after demanding 9-to-6 work hours and household chores.',
      'Does not want every after-hours interaction to feel like transactional professional networking.',
      'Unsure which local meetups or community events are truly welcoming to newcomers.',
    ],
    unmetNeeds: [
      'Interest-based discovery focused on shared activities rather than career titles.',
      'Clarity on compatible intentions (seeking platonic activity partners vs. romantic dating).',
      'Flexible, asynchronous opportunities to connect around weekend schedules.',
      'Accessible, budget-conscious ways to meet without mandatory expensive dining.',
      'Trustworthy, low-ego conversation starters grounded in shared recreational passions.',
    ],
    currentWorkarounds: [
      'Climbs alone at the local bouldering gym, occasionally trading casual tips on problem routes.',
      'Attends generic tech networking meetups, only to find attendees pitching startup ideas.',
      'Scours local city subreddits searching for "how to make adult friends" threads.',
    ],
    designOpportunity:
      'A discovery experience connecting people through shared recreational hobbies, explicit intentions, and optional local activity suggestions.',
    commonGroundFitSummary:
      'CommonGround lets Rohan filter specifically for "Activity Partners" and "Friendship" centered around bouldering and board games, completely bypassing superficial appearance metrics and awkward workplace boundaries.',
    empathyMap: {
      says: [
        '“It’s surprisingly hard to make friends as an adult once you leave college.”',
        '“I have plenty of professional contacts, but nobody to call on Saturday morning.”',
        '“I want to do outdoor activities, but doing them solo every weekend gets lonely.”',
      ],
      thinks: [
        '“Everyone here already went to high school together or has their friend group locked in.”',
        '“I don’t want to spend $60 every Friday at a noisy bar just to chat with strangers.”',
        '“How do I transition casual hobby buddies into genuine friends?”',
      ],
      does: [
        'Spends weekday evenings cooking alone and playing online games with distant college friends.',
        'Explores city bike trails alone on Sunday afternoons.',
        'Saves local community events on social media but hesitates to attend alone.',
      ],
      feels: [
        'Restless, socially under-stimulated, and disconnected from his new city.',
        'Hesitant to appear clingy or intrusive when meeting established locals.',
        'Eager for authentic camaraderie based on shared recreational passion.',
      ],
    },
    primaryBarriers: ['Structural', 'Discovery'],
  },
  {
    id: 'persona-meera',
    name: 'Meera Iyer',
    age: 25,
    archetype: 'The Overlooked Creative',
    context:
      'Working graphic designer with specialized artistic interests (analog film photography, botanical sketching) and accessibility requirements (sensory processing sensitivity and fatigue pacing) that make noisy, crowded venues prohibitive.',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    illustrativeQuote:
      'My sensory sensitivities mean loud, crowded bars completely drain me, but that doesn’t mean I don’t love people. I want to meet kindred spirits over analog cameras or quiet gallery walks without having to explain or defend my boundaries.',
    primaryGoal:
      'Connect with thoughtful people who share her artistic passions in accessible, calm physical or digital environments.',
    goals: [
      'Meet people who genuinely share her passions for medium-format film, printmaking, and nature walks.',
      'Find welcoming, low-sensory social opportunities without having to repeatedly disclose or justify her accessibility needs.',
      'Understand upfront whether a prospective event or activity will be sensory-friendly.',
      'Build enduring friendships without being judged by superficial appearance or rapid swipe culture.',
    ],
    painPoints: [
      'Mainstream social platforms optimize for crowded nightlife and loud social environments.',
      'Popular social gatherings trigger severe sensory overload and energy crashes.',
      'Niche creative interest communities are fragmented, hidden, or geographically dispersed.',
      'Reluctant to disclose personal neurodiversity or sensory accommodations to strangers out of fear of judgment.',
      'Frustrated when peers define her entire identity by her limitations rather than her creativity.',
    ],
    unmetNeeds: [
      'Precise interest-based matching that highlights creative craft and conversational depth.',
      'Optional, user-controlled accessibility preferences and communication pacing indicators.',
      'Clear foreknowledge of activity environments (low noise, quiet third places, wheelchair/sensory accessibility).',
      'Robust privacy, blocking, and boundary controls by default.',
      'Inclusive introductions that lead with artistic common ground rather than personal health disclosure.',
    ],
    currentWorkarounds: [
      'Interacts primarily through anonymous photography forums and botanical art hashtags.',
      'Researches coffee shop decibel levels and lighting before agreeing to meet anyone in person.',
      'Frequently declines social invitations to loud group dinners, feeling guilty for "flaking."',
    ],
    designOpportunity:
      'Accessible profile discovery controls, optional low-sensory communication pacing indicators, privacy by default, and high visibility for niche crafts.',
    commonGroundFitSummary:
      'CommonGround allows Meera to specify her communication pace ("Gradual & thoughtful") and social energy ("Introverted / Calm") upfront, while matching directly on niche passions like Analog Photography and Ceramics.',
    empathyMap: {
      says: [
        '“Can we meet somewhere quiet where we can actually hear each other speak?”',
        '“I love spending four hours developing film in a darkroom or sketching in a park.”',
        '“I’m tired of having to give a medical disclaimer just to plan a coffee meetup.”',
      ],
      thinks: [
        '“People assume because I don’t like clubs, I must be anti-social.”',
        '“I wish platforms cared about what people create rather than what they look like in selfies.”',
        '“My energy battery is limited; I want to spend it on conversations that actually matter.”',
      ],
      does: [
        'Visits art museums during weekday quiet hours with her sketchbook.',
        'Shoots 35mm film on weekend mornings in natural parks.',
        'Meticulously evaluates meetup venues for lighting and acoustic harshness.',
      ],
      feels: [
        'Misunderstood by peers who equate socializing exclusively with nightlife.',
        'Protective of her personal energy and emotional boundaries.',
        'Deeply inspired and energized when finding someone who shares her creative focus.',
      ],
    },
    primaryBarriers: ['Accessibility & Inclusion', 'Trust & Safety', 'Emotional'],
  },
];

export const BARRIERS: BarrierItem[] = [
  // 1. Emotional Barriers
  {
    id: 'bar-emo-1',
    category: 'Emotional',
    title: 'Fear of Rejection & Vulnerability Anxiety',
    description:
      'The profound psychological apprehension of facing overt or implicit social rejection when initiating contact with an unfamiliar person.',
    realWorldManifestation:
      'Users hesitate for days before sending a message or avoid initiating altogether, worrying they will be ignored, ridiculed, or viewed as a nuisance.',
    affectedPersonas: ['Aanya Sharma', 'Rohan Mehta'],
    designImplication:
      'Introduce quiet declines: recipients can decline invitations privately without notifying the sender of a rejection, eliminating the sting of public dismissal.',
  },
  {
    id: 'bar-emo-2',
    category: 'Emotional',
    title: 'Social Battery Depletion & Conversational Exhaustion',
    description:
      'The mental and emotional fatigue resulting from prolonged, superficial small talk or constant performative self-presentation.',
    realWorldManifestation:
      'Introverted and neurodivergent individuals feel drained after 15 minutes of forced chatter, leading them to withdraw from social platforms entirely.',
    affectedPersonas: ['Aanya Sharma', 'Meera Iyer'],
    designImplication:
      'Allow users to set explicit communication paces ("Gradual & thoughtful") and activate a 1-tap "Pause Discovery" mode to recharge without deleting accounts.',
  },
  {
    id: 'bar-emo-3',
    category: 'Emotional',
    title: 'Uncertainty of Mutual Intentions & Hesitation',
    description:
      'The paralyzing ambiguity surrounding whether the other person is genuinely seeking connection, what kind of connection they want, or if they are just being polite.',
    realWorldManifestation:
      'A user wants to meet a hiking partner but fears the other person interprets it as a romantic date, or vice versa, creating mutual awkwardness.',
    affectedPersonas: ['Aanya Sharma', 'Rohan Mehta'],
    designImplication:
      'Mandate upfront, selectable intention tags (Friendship, Activity Partner, Dating, Community) so expectations are aligned before interaction begins.',
  },

  // 2. Structural Barriers
  {
    id: 'bar-struct-1',
    category: 'Structural',
    title: 'Time Poverty & Demanding Work Schedules',
    description:
      'Severe constraints on discretionary hours due to full-time employment, long commutes, academic coursework, or family caregiving responsibilities.',
    realWorldManifestation:
      'Working professionals cannot commit to weekly fixed-schedule clubs or spend three hours bar-hopping on weeknights.',
    affectedPersonas: ['Rohan Mehta', 'Meera Iyer'],
    designImplication:
      'Enable asynchronous discovery and highlight shared micro-activities (e.g. 45-minute coffee or weekend bouldering session).',
  },
  {
    id: 'bar-struct-2',
    category: 'Structural',
    title: 'Financial Barriers & Commercialized Social Spaces',
    description:
      'The escalating economic cost of participating in contemporary social gathering spaces (dining, ticketed nightlife, expensive hobby club dues).',
    realWorldManifestation:
      'College students and early-career workers with tight budgets feel priced out of social circles that center around $50 restaurant tabs or paid events.',
    affectedPersonas: ['Aanya Sharma', 'Rohan Mehta'],
    designImplication:
      'Center discovery around low-cost, accessible common ground such as library study sessions, outdoor trails, public parks, and community gardens.',
  },
  {
    id: 'bar-struct-3',
    category: 'Structural',
    title: 'Lack of Local Social Capital & Relocation Disconnection',
    description:
      'The structural disadvantage of moving to a new geographic area without pre-existing family networks, childhood friends, or alumni ties.',
    realWorldManifestation:
      'New arrivals find established locals difficult to befriend because existing friend groups are already socially saturated and self-contained.',
    affectedPersonas: ['Rohan Mehta'],
    designImplication:
      'Provide local interest-based discovery that operates independently of personal contact books, enabling newcomers to find other activity seekers.',
  },

  // 3. Discovery Barriers
  {
    id: 'bar-disc-1',
    category: 'Discovery',
    title: 'Superficial Signal Dominance & Lookism',
    description:
      'Digital interface architectures that mandate photo-centric rapid appraisal, obscuring character, intellectual depth, and substantive interests.',
    realWorldManifestation:
      'Thoughtful, creative people who do not cultivate model-like selfie portfolios receive minimal visibility in algorithmic swipe decks.',
    affectedPersonas: ['Aanya Sharma', 'Meera Iyer'],
    designImplication:
      'Eliminate swipe decks in favor of rich, interest-first discovery cards highlighting shared books, crafts, and values.',
  },
  {
    id: 'bar-disc-2',
    category: 'Discovery',
    title: 'Fragmentation & Invisibility of Niche Passions',
    description:
      'The difficulty of finding local kindred spirits who share specialized, uncommon, or non-mainstream creative or intellectual hobbies.',
    realWorldManifestation:
      'Someone passionate about analog printmaking or euro-strategy board games finds zero local peers through generic neighborhood or social apps.',
    affectedPersonas: ['Rohan Mehta', 'Meera Iyer'],
    designImplication:
      'Provide deep, categorized interest taxonomies with custom user-created passion tags and transparent compatibility weighting.',
  },
  {
    id: 'bar-disc-3',
    category: 'Discovery',
    title: 'Network Homophily & Social Insularity',
    description:
      'The tendency of existing social circles to reinforce demographic and ideological similarity, creating barriers for newcomers outside the circle.',
    realWorldManifestation:
      'Introductions through mutual friends only lead back into the same narrow social group, making it hard to branch out into new communities.',
    affectedPersonas: ['Rohan Mehta'],
    designImplication:
      'Facilitate cross-network bridging based purely on genuine personal interests rather than mutual contact networks.',
  },

  // 4. Accessibility & Inclusion Barriers
  {
    id: 'bar-access-1',
    category: 'Accessibility & Inclusion',
    title: 'Sensory Overload & Inaccessible Environments',
    description:
      'The prevalence of loud, brightly lit, crowded venues (bars, clubs, noisy halls) that cause acute sensory distress for neurodivergent individuals.',
    realWorldManifestation:
      'People with sensory processing sensitivity or ADHD decline social invitations because meeting in sensory-hostile environments causes migraines or cognitive shutdown.',
    affectedPersonas: ['Aanya Sharma', 'Meera Iyer'],
    designImplication:
      'Allow users to indicate low-sensory preferences and suggest calm, sensory-friendly meeting settings (quiet cafes, galleries, parks).',
  },
  {
    id: 'bar-access-2',
    category: 'Accessibility & Inclusion',
    title: 'Forced Disclosure of Personal Accessibility Needs',
    description:
      'The awkwardness and vulnerability of having to repeatedly disclose medical, physical, or sensory limitations to strangers before agreeing to meet.',
    realWorldManifestation:
      'A person feels forced to explain why they cannot climb stairs or attend a loud concert, fearing they will be perceived as demanding or frail.',
    affectedPersonas: ['Meera Iyer'],
    designImplication:
      'Incorporate optional, user-controlled communication rhythm indicators and accessible venue tags without requiring medical disclosures.',
  },
  {
    id: 'bar-access-3',
    category: 'Accessibility & Inclusion',
    title: 'Rigid Conversational Pacing Expectations',
    description:
      'Normative social expectations that demand instantaneous text replies, penalizing users with fluctuating health, executive dysfunction, or demanding jobs.',
    realWorldManifestation:
      'Users are accused of "ghosting" or disinterest simply because their energy battery or neurodivergence requires 48 hours to craft a thoughtful reply.',
    affectedPersonas: ['Aanya Sharma', 'Meera Iyer'],
    designImplication:
      'Display clear communication rhythm badges (e.g. "Pace: Gradual & thoughtful") to set healthy, mutual expectations from day one.',
  },

  // 5. Trust & Safety Barriers
  {
    id: 'bar-safety-1',
    category: 'Trust & Safety',
    title: 'Unsolicited Messages & Boundary Invasions',
    description:
      'Direct messaging systems that allow unvetted strangers to send intrusive, sexually explicit, or unsolicited messages without prior consent.',
    realWorldManifestation:
      'Users—especially young women—open social apps to find inappropriate messages, creating acute discomfort and app abandonment.',
    affectedPersonas: ['Aanya Sharma', 'Meera Iyer'],
    designImplication:
      'Enforce a strict two-way mutual introduction consent gate: no direct messages can ever be sent until both individuals explicitly say yes.',
  },
  {
    id: 'bar-safety-2',
    category: 'Trust & Safety',
    title: 'Difficulty Ending Uncomfortable Interactions Gracefully',
    description:
      'The absence of low-friction, dignified exit tools to end conversations that feel awkward or crossed personal boundaries without provoking retaliatory harassment.',
    realWorldManifestation:
      'Users tolerate uncomfortable conversations or disappear silently ("ghost") because they fear aggressive pushback if they say "I don’t think we’re compatible."',
    affectedPersonas: ['Aanya Sharma', 'Meera Iyer'],
    designImplication:
      'Provide 1-click dignified exit options: "Pause Connection," "Gracefully Disconnect," and instant anonymous blocking with local audit logging.',
  },
  {
    id: 'bar-safety-3',
    category: 'Trust & Safety',
    title: 'Privacy Compromise & Lack of Discovery Visibility Controls',
    description:
      'Platforms broadcasting user profiles publicly without granular control over who can discover them or when they are actively seeking connections.',
    realWorldManifestation:
      'Users worry about coworkers, students, or family members discovering their personal profiles, chilling their willingness to participate.',
    affectedPersonas: ['Rohan Mehta', 'Meera Iyer'],
    designImplication:
      'Comprehensive Safety Center: pause discovery anytime, restrict visibility to matching intentions only, and control location precision.',
  },
];

export const CURRENT_METHODS_ANALYSIS: CurrentMethodAnalysis[] = [
  {
    id: 'meth-friends-family',
    name: 'Through Friends and Family',
    tagline: 'High baseline trust and personal vetting — constrained by closed networks and social expectations.',
    whoMayBenefit: [
      'People with large, well-connected local families.',
      'Outgoing individuals embedded in multi-generational community circles.',
      'People seeking partners vetted by trusted third parties.',
    ],
    whatWorksWell: [
      'Pre-existing social accountability and lower risk of outright fraud.',
      'Organic conversation context grounded in mutual relationships.',
      'Higher initial trust and mutual comfort.',
    ],
    whatCanGoWrong: [
      'Creates social pressure: awkwardness within the family/friend circle if connection fails.',
      'Network homophily structurally limits exposure to diverse viewpoints (Zhao, 2023).',
      'Loss of privacy: mutual acquaintances often gossip or ask intrusive follow-up questions.',
    ],
    whoMayBeLeftOut: [
      'Geographic newcomers and immigrants with zero local family capital (e.g. Rohan).',
      'People whose personal values or lifestyle differ from their family of origin.',
      'Individuals with niche interests not shared by anyone in their immediate circle (e.g. Meera).',
    ],
    opportunityForImprovement:
      'Provide the safety and warmth of personal referrals without the social surveillance or network limitations of mutual acquaintances.',
  },
  {
    id: 'meth-college-work',
    name: 'At College or Workplace',
    tagline: 'High physical proximity and frequent contact — complicated by professional stakes and clique formation.',
    whoMayBenefit: [
      'Naturally extroverted students and corporate employees in collaborative team cultures.',
      'People who thrive in ambient, daily casual interactions.',
    ],
    whatWorksWell: [
      'Frequent spontaneous exposure (the "mere exposure effect") fosters familiarity over time.',
      'Shared institutional context (shared classes, shared projects, campus landmarks).',
      'Zero financial cost to initiate casual conversation in shared spaces.',
    ],
    whatCanGoWrong: [
      'High professional stakes: workplace romance or failed friendships create ongoing daily discomfort.',
      'College campus cliques can feel insular, exclusive, and cliquish to newcomers.',
      'Blurring boundaries between professional identity and personal vulnerability.',
    ],
    whoMayBeLeftOut: [
      'Remote or hybrid workers operating from isolated home desks.',
      'Introverted students overwhelmed by crowded lecture halls (e.g. Aanya).',
      'Contractors, commuters, or non-traditional students who leave campus immediately after class.',
    ],
    opportunityForImprovement:
      'Connect peers across campus or city boundaries around recreational passions, untangled from grades or workplace performance reviews.',
  },
  {
    id: 'meth-social-media',
    name: 'Through Social Media (Instagram, Twitter/X, TikTok)',
    tagline: 'Massive discovery breadth and content sharing — plagued by algorithmic vanity, harassment, and parasocial dynamics.',
    whoMayBenefit: [
      'Content creators, visual artists, and digital-first communicators.',
      'People comfortable building public personal brands.',
    ],
    whatWorksWell: [
      'Exceptional depth of niche content discovery (hashtags for specific crafts or hobbies).',
      'Asynchronous, text- and media-rich communication.',
      'Enables discovering people across global geographic boundaries.',
    ],
    whatCanGoWrong: [
      'Parasocial asymmetry: users mistake public content consumption for mutual connection.',
      'High volume of unsolicited DMs, spam, and bad-faith trolling.',
      'Focus on performative follower counts and curated aesthetics over authentic vulnerability.',
    ],
    whoMayBeLeftOut: [
      'Privacy-conscious individuals who do not wish to maintain public photo portfolios.',
      'Users overwhelmed by notification spam and algorithmic dopamine loops.',
      'People seeking local in-person companions rather than online spectators.',
    ],
    opportunityForImprovement:
      'Replace follower counts, public metrics, and unsolicited DMs with mutual consent gates and local interest alignment.',
  },
  {
    id: 'meth-apps',
    name: 'Through Dating or Friendship Apps (Tinder, Bumble, Hinge)',
    tagline: 'Unprecedented volume and filtering speed — undermined by superficial swiping, ghosting, and harassment.',
    whoMayBenefit: [
      'Photogenic, outgoing individuals comfortable with rapid appraisal.',
      'People with high social batteries who enjoy fast-paced text banter.',
    ],
    whatWorksWell: [
      'Vastly expands discovery beyond personal social circles or geographic neighborhoods.',
      'High convenience: browse and discover on personal schedule asynchronously.',
      'Explicit confirmation that participants are open to meeting new people.',
    ],
    whatCanGoWrong: [
      'Superficial photo-first impressions induce commodification and marketplace evaluation (Finkel et al., 2012).',
      '48% of U.S. online daters experience unwanted contact or harassment (Pew 2023).',
      'Infinite choices trigger decision fatigue and chronic ghosting (Iyengar & Lepper, 2000; LeFebvre, 2019).',
    ],
    whoMayBeLeftOut: [
      'Quiet, shy, or neurodivergent individuals exhausted by swiping (e.g. Aanya).',
      'People with niche creative crafts who get lost in generic popularity algorithms (e.g. Meera).',
      'Anyone seeking low-pressure platonic friends without sexualized undertones.',
    ],
    opportunityForImprovement:
      'Abolish swiping entirely. Ground matching in transparent 40/30/20/10 interest/value compatibility, quiet declines, and mutual consent.',
  },
  {
    id: 'meth-clubs-events',
    name: 'Through Clubs, Events, and Hobby Communities (Meetup, Clubs)',
    tagline: 'Shared activity focus and organized gatherings — limited by schedule rigidity, entrance friction, and costs.',
    whoMayBenefit: [
      'People with predictable weekend schedules and disposable income.',
      'Individuals comfortable walking into a room full of strangers alone.',
    ],
    whatWorksWell: [
      'Common ground is built directly into the event (e.g. running club, chess meetup).',
      'Natural, organic focus on an external task rather than awkward small talk.',
      'Provides physical third places for community interaction.',
    ],
    whatCanGoWrong: [
      'Attendance drop-off: groups frequently become inactive or run by insular cliques.',
      'High barrier to entry: walking through the door alone is terrifying for socially anxious individuals.',
      'Venues are frequently noisy, crowded, or inaccessible to people with sensory sensitivities.',
    ],
    whoMayBeLeftOut: [
      'People with sensory processing sensitivity or physical mobility limitations (e.g. Meera).',
      'Working adults with irregular or demanding shift schedules (e.g. Rohan).',
      'Socially anxious individuals who freeze when approaching group circles (e.g. Aanya).',
    ],
    opportunityForImprovement:
      'Allow 1-on-1 discovery prior to group events, so anxious individuals can arrive with an already-established mutual contact.',
  },
  {
    id: 'meth-spontaneous',
    name: 'Spontaneous Real-World Encounters (Third Places, Cafes, Transit)',
    tagline: 'Immediate physical chemistry and serendipity — hindered by civic decline, unpredictability, and anxiety hurdles.',
    whoMayBenefit: [
      'Extroverted, socially confident individuals with high spontaneous charm.',
      'People living in dense, walkable urban centers with thriving public infrastructure.',
    ],
    whatWorksWell: [
      'Immediate real-world chemistry check (voice, body language, facial warmth) with zero digital misrepresentation.',
      'Grounded in a shared physical moment and shared spontaneous environment.',
      'Zero screen fatigue or digital gamification.',
    ],
    whatCanGoWrong: [
      'Completely unpredictable: depends on arbitrary luck, timing, and location.',
      'Precipitous decline in public civic spaces and free third places (U.S. Surgeon General, 2023).',
      'Intention blindness: zero knowledge of whether the other person is single, open to talking, or wants to be left alone.',
    ],
    whoMayBeLeftOut: [
      'People with physical disabilities or mobility constraints.',
      'Introverted or socially anxious individuals who freeze when approached by strangers.',
      'People with tight financial budgets or demanding work/caregiver hours.',
    ],
    opportunityForImprovement:
      'Use digital discovery as a low-pressure bridge to coordinate relaxed, accessible in-person meetings around mutual activities.',
  },
];

export const FEATURE_MAPPINGS: FeatureMappingItem[] = [
  {
    id: 'feat-1',
    userNeed: 'Low-pressure interaction with zero cold-approach anxiety',
    proposedFeature: 'Mutual Introduction Requests with Context-Aware Icebreakers',
    intendedBenefit:
      'Removes the terror of cold-approaching and provides shared-interest conversation starters so users never face a blank text screen.',
    targetPersonas: ['Aanya Sharma', 'Rohan Mehta'],
    designHypothesisNote:
      'Hypothesis: Providing 3 tailored icebreakers based on mutual tags increases response rates and lowers conversational drop-off among introverts.',
  },
  {
    id: 'feat-2',
    userNeed: 'Connecting over genuine passions rather than superficial appearance',
    proposedFeature: 'Interest-First Discovery Directory with 40% Weighting',
    intendedBenefit:
      'Allows users with specialized crafts (ceramics, analog photography, bouldering) to find kindred spirits immediately without photo commodification.',
    targetPersonas: ['Rohan Mehta', 'Meera Iyer'],
    designHypothesisNote:
      'Hypothesis: Displaying shared activities prominently shifts cognitive framing from consumer marketplace evaluation to collaborative camaraderie.',
  },
  {
    id: 'feat-3',
    userNeed: 'Eliminating awkward ambiguity around why people are connecting',
    proposedFeature: 'Explicit Intention Selection Cards (Friendship, Activity, Dating, Community)',
    intendedBenefit:
      'Guarantees upfront alignment of expectations, preventing unwanted romantic advances when a user is seeking platonic hobby buddies.',
    targetPersonas: ['Aanya Sharma', 'Rohan Mehta'],
    designHypothesisNote:
      'Hypothesis: Transparent intention matching reduces cognitive friction and prevents feelings of betrayal or mismatched romantic pressure.',
  },
  {
    id: 'feat-4',
    userNeed: 'Protection from unsolicited messages, spam, and harassment',
    proposedFeature: 'Consent-Locked Conversation Gate & Quiet Decline Mechanics',
    intendedBenefit:
      'Ensures no direct messaging channel opens until both parties explicitly agree; declining an intro sends no public rejection notification.',
    targetPersonas: ['Aanya Sharma', 'Meera Iyer'],
    designHypothesisNote:
      'Hypothesis: Removing public rejection counters and enforcing mutual consent gates increases safety perception and encourages cautious users to participate.',
  },
  {
    id: 'feat-5',
    userNeed: 'Accommodating sensory sensitivities and physical accessibility needs',
    proposedFeature: 'Accessible UI Design, Low-Sensory Preferences, & Dignified Pacing Badges',
    intendedBenefit:
      'Allows users to signal their communication rhythm and sensory comfort without requiring awkward medical disclosures or feeling categorized.',
    targetPersonas: ['Meera Iyer'],
    designHypothesisNote:
      'Hypothesis: Offering optional pacing and sensory tags allows disabled and neurodivergent individuals to participate comfortably on their own terms.',
  },
  {
    id: 'feat-6',
    userNeed: 'Social energy battery management and freedom to pause',
    proposedFeature: '1-Tap "Pause Discovery" Mode & Graceful Disconnections',
    intendedBenefit:
      'Empowers users to take breaks from social discovery during busy weeks or low-battery periods without deleting their profile or losing connections.',
    targetPersonas: ['Aanya Sharma', 'Rohan Mehta', 'Meera Iyer'],
    designHypothesisNote:
      'Hypothesis: Providing built-in resting mechanisms prevents burnout and reduces chronic app churn.',
  },
  {
    id: 'feat-7',
    userNeed: 'Discovering affordable, local activities outside work or campus cliques',
    proposedFeature: 'Activity-Partner Matching around Low-Cost Shared Interests',
    intendedBenefit:
      'Enables newcomers and budget-conscious students to find peers for public park walks, bouldering, or library study without expensive venue costs.',
    targetPersonas: ['Rohan Mehta', 'Aanya Sharma'],
    designHypothesisNote:
      'Hypothesis: Focusing introductions on shared activities creates a natural external focal point, reducing interpersonal awkwardness.',
  },
];

export const VALIDATION_QUESTIONS: PersonaValidationQuestion[] = [
  {
    id: 'val-1',
    number: 1,
    question: 'How do you currently meet new people?',
    targetFocus: 'Current Behavioral Baseline & Channels',
    whatToValidate:
      'Gauges reliance on passive channels (campus, work), active digital apps (Tinder, Bumble BFF), or niche communities (Discord, Meetup). Identifies which channels are failing and why.',
    probeFollowUps: [
      'What is the single most frustrating part of that process?',
      'How much time do you actively invest before giving up due to fatigue?',
    ],
  },
  {
    id: 'val-2',
    number: 2,
    question: 'What makes starting a conversation difficult?',
    targetFocus: 'Initiation Friction & Emotional Overload (Aanya Persona)',
    whatToValidate:
      'Pinpoints whether the impediment is fear of awkward pauses, absence of common conversational touchpoints, or anxiety over how one is perceived.',
    probeFollowUps: [
      'Do you prefer knowing shared interests in advance before exchanging the first line?',
      'How does having suggested icebreaker prompts change your confidence?',
    ],
  },
  {
    id: 'val-3',
    number: 3,
    question: 'Have you ever wanted to connect with someone but decided not to? Why?',
    targetFocus: 'Inhibition Triggers & Psychological Friction',
    whatToValidate:
      'Uncovers hidden blockers: fear of rejection, ambiguous intentions, intimidation by established cliques, or lack of clear social permission.',
    probeFollowUps: [
      'Did you worry about being perceived as intrusive or desperate?',
      'Would a mutual-consent requirement have altered that decision?',
    ],
  },
  {
    id: 'val-4',
    number: 4,
    question: 'What makes you feel safe when meeting someone new?',
    targetFocus: 'Trust, Safety & Psychological Boundaries',
    whatToValidate:
      'Explores the role of verified intentions, privacy controls, gradual disclosure, and protection against unsolicited contact or pushiness.',
    probeFollowUps: [
      'What specific profile information gives you confidence that someone is authentic?',
      'How important is having the ability to decline or exit a conversation without awkwardness?',
    ],
  },
  {
    id: 'val-5',
    number: 5,
    question: 'How important are shared interests compared with appearance or popularity?',
    targetFocus: 'Value Weighting & Common Ground Discovery (Rohan & Meera Personas)',
    whatToValidate:
      'Validates CommonGround’s core value hypothesis: whether users prioritize mutual values, crafts, and conversational alignment over photo-first aesthetics.',
    probeFollowUps: [
      'Have you ever connected with someone based solely on looks or status and realized there was zero substance?',
      'Would you rather see 3 verified shared passions than 6 curated photos?',
    ],
  },
  {
    id: 'val-6',
    number: 6,
    question: 'What would make a connection platform more comfortable or inclusive for you?',
    targetFocus: 'Accessibility, Pacing & System Inclusivity (Meera & Aanya Personas)',
    whatToValidate:
      'Identifies unmet needs regarding low-sensory environments, customizable social pacing, dignity in declining, and non-judgmental community norms.',
    probeFollowUps: [
      'How would a "Pause Discovery" or "Low-Sensory Mode" affect your long-term engagement?',
      'What features would help you feel welcomed without needing to disclose personal health or disability details?',
    ],
  },
];

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  {
    id: 'stage-desk-research',
    stageNumber: 1,
    title: 'Desk Research & Literature Review',
    description:
      'Synthesizing empirical findings from sociology, clinical psychology, and human-computer interaction regarding the loneliness epidemic, digital fatigue, and exclusion dynamics.',
    activities: [
      'Reviewed U.S. Surgeon General’s 2023 Advisory on Social Connection and Community.',
      'Examined Jeffrey Hall’s (2018) empirical friendship formation hour thresholds (50h casual, 200h close).',
      'Analyzed Pew Research Center (2023) metrics on online dating harassment and scam prevalence.',
      'Audited WCAG 2.2 accessibility guidelines and disability exclusion reports in digital third places.',
    ],
    outputArtifact: 'Academic Literature Matrix & Evidence Base (Module 1 cross-reference)',
    rigorNote: 'Anchors the research in established peer-reviewed science before defining persona hypotheses.',
  },
  {
    id: 'stage-user-interviews',
    stageNumber: 2,
    title: 'Semi-Structured User Interviews',
    description:
      'Qualitative exploratory interviews targeting individuals experiencing connection friction: college freshmen, relocated professionals, and people with accessibility considerations.',
    activities: [
      'Formulated standard 6-question interview guide targeting initiation barriers and safety perceptions.',
      'Conducted 45-minute open-ended sessions probing critical incidents of hesitated connection.',
      'Transcribed verbal and non-verbal cues regarding social exhaustion and app burnout.',
    ],
    outputArtifact: 'Interview Transcripts, Critical Incident Logs, & Pain Point Clustered Affinity Maps',
    rigorNote: 'Provisional protocol designed for university field testing and academic defense.',
  },
  {
    id: 'stage-short-surveys',
    stageNumber: 3,
    title: 'Quantitative Pulse Surveys',
    description:
      'Brief, high-cadence quantitative surveys deployed across student and young professional communities to validate the prevalence of identified friction points.',
    activities: [
      'Measured distribution of primary meeting channels (campus, work, dating apps, mutual friends).',
      'Quantified rates of swipe fatigue, ghosting distress, and feeling excluded by social cliques.',
      'Evaluated demand for interest-first discovery versus visual-first swiping paradigms.',
    ],
    outputArtifact: 'Quantitative Distribution Charts & Statistical Friction Indicators',
    rigorNote: 'Prevents qualitative over-indexing on solitary anecdotal outliers.',
  },
  {
    id: 'stage-empathy-mapping',
    stageNumber: 4,
    title: 'Empathy Mapping (Says, Thinks, Does, Feels)',
    description:
      'Four-quadrant synthesis translating raw interview observations into deep empathetic models of cognitive contradictions and emotional states.',
    activities: [
      'Contrasted explicit verbal declarations ("Says") with private internal anxieties ("Thinks").',
      'Mapped contradictory observable behaviors ("Does") against underlying emotional states ("Feels").',
      'Identified hidden coping mechanisms: silent lurking, wearing headphones in public, early lecture departure.',
    ],
    outputArtifact: '4-Quadrant Empathy Maps for Aanya, Rohan, and Meera',
    rigorNote: 'Reveals the gap between what users say in public and what they privately struggle with.',
  },
  {
    id: 'stage-persona-development',
    stageNumber: 5,
    title: 'Evidence-Informed Persona Development',
    description:
      'Constructing distinct, multidimensional persona archetypes that capture real human complexity without resorting to demographic stereotyping or superficial labels.',
    activities: [
      'Developed Aanya Sharma (The Quiet College Freshman): Overcoming cold-approach panic.',
      'Developed Rohan Mehta (The Relocated Newcomer): Building local community from scratch.',
      'Developed Meera Iyer (The Niche & Accessible Explorer): Dignified accessibility and privacy.',
      'Articulated concrete goals, pain points, unmet needs, and design opportunities for each.',
    ],
    outputArtifact: '3 Detailed Research Personas with Traceable Requirement Hypotheses',
    rigorNote: 'Explicitly labeled as provisional research hypotheses subject to iterative falsification.',
  },
  {
    id: 'stage-validation-iteration',
    stageNumber: 6,
    title: 'Validation, Falsification & Product Translation',
    description:
      'Subjecting personas and design opportunities to peer review, user feedback loops, and translation into concrete product requirements for Module 3.',
    activities: [
      'Executed persona walkthrough tests against Module 3 product feature specifications.',
      'Refined feature mapping to ensure every proposed capability directly traces to an unmet human need.',
      'Established falsification criteria: what findings would require rethinking the persona models?',
    ],
    outputArtifact: 'Traceable Product Requirements Matrix for Module 3 (The Solution Architect)',
    rigorNote: 'Creates a verifiable unbroken chain from human suffering to code implementation.',
  },
];

export const EPISTEMIC_CATEGORIES: EpistemicCategory[] = [
  {
    title: 'Existing Evidence from Credible Sources',
    definition:
      'Peer-reviewed journal articles, federal health advisories, and nationally representative survey data (e.g., Surgeon General, Pew Research Center, Hall 2018). These represent documented empirical facts about the wider population.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    examplesInDashboard: [
      'Surgeon General 2023 finding on third-place decline and 50% mortality equivalence.',
      'Pew Research 2023 statistic that 48% of online daters face unwanted contact or harassment.',
      'Hall 2018 finding that developing a casual friend requires ~50 hours and a close friend ~200 hours.',
    ],
  },
  {
    title: 'Field Insights from Qualitative Inquiry',
    definition:
      'First-hand qualitative narratives, behavioral observations, and recurring themes extracted from student and newcomer user interviews, focus groups, and pilot surveys.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    examplesInDashboard: [
      'Students reporting that attending large orientation mixers produces acute sensory drain rather than friendships.',
      'Newcomers reporting that professional coworker relationships rarely transition into weekend social circles.',
      'Individuals with chronic conditions hiding their accessibility needs due to fear of pity or othering.',
    ],
  },
  {
    title: 'Provisional Personas & Research Hypotheses',
    definition:
      'Synthesized archetypes (Aanya, Rohan, Meera) created to guide design empathy. While grounded in realistic patterns, these are models that must be continually tested and validated rather than taken as universal truth.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    examplesInDashboard: [
      'Hypothesis that quiet decline mechanics will eliminate social hesitation for socially anxious students.',
      'Hypothesis that activity-partner tags will convert relocated professionals into active hobbyists faster than chat.',
      'Hypothesis that optional accessibility badges reduce self-disclosure stigma.',
    ],
  },
  {
    title: 'Proposed Design Solutions (Module 3 Features)',
    definition:
      'Functional capabilities designed into CommonGround to address verified human barriers. These represent testable UX interventions rather than guaranteed behavioral cures.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    examplesInDashboard: [
      'Context-aware icebreaker prompts tied to 3 shared tags.',
      'Double-blind mutual introduction requests with quiet dismissals.',
      'Dignified pacing preferences and low-sensory interface modes.',
    ],
  },
];

export const ACADEMIC_REFERENCES: AcademicReference[] = [
  {
    id: 'ref-surgeon-general-2023',
    title: 'Our Epidemic of Loneliness and Isolation: The U.S. Surgeon General’s Advisory on the Healing Effects of Social Connection and Community',
    authors: 'Office of the U.S. Surgeon General (Dr. Vivek H. Murthy)',
    year: '2023',
    publication: 'U.S. Department of Health and Human Services',
    relevanceToPersonas:
      'Establishes social disconnection as an urgent public health crisis and documents the decline of physical civic third places, directly framing Rohan and Aanya’s struggle to find welcoming connection venues.',
    url: 'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf',
  },
  {
    id: 'ref-hall-2018-friendship',
    title: 'How many hours does it take to make a friend?',
    authors: 'Jeffrey A. Hall',
    year: '2018',
    publication: 'Journal of Social and Personal Relationships, 36(4), 1278–1296',
    relevanceToPersonas:
      'Quantifies the time investment required to build relationships (~50 hours for casual friendship, ~200 hours for close friendship), demonstrating why Rohan’s 40-hour work schedule makes superficial swiping structurally ineffective.',
    url: 'https://doi.org/10.1177/0265407518761225',
  },
  {
    id: 'ref-pew-2023-dating',
    title: 'From Looking for Love to Swiping the Field: Online Dating in the U.S.',
    authors: 'Colleen McClain, Monica Anderson, & Michelle Faverio (Pew Research Center)',
    year: '2023',
    publication: 'Pew Research Center Internet & Technology Report',
    relevanceToPersonas:
      'Provides empirical evidence that 48% of users experience boundary violations and 52% suspect scam encounters, justifying Aanya and Meera’s profound skepticism toward existing swipe-based paradigms.',
    url: 'https://www.pewresearch.org/internet/2023/02/02/the-experiences-of-u-s-online-daters/',
  },
  {
    id: 'ref-who-disability-2022',
    title: 'Global report on health equity for persons with disabilities',
    authors: 'World Health Organization (WHO)',
    year: '2022',
    publication: 'WHO Guidelines & Reports',
    relevanceToPersonas:
      'Highlights that inaccessible infrastructure and social stigma compound social exclusion for people with disabilities, underpinning Meera’s requirement for transparent venue accessibility and dignified self-disclosure.',
    url: 'https://www.who.int/publications/i/item/9789240063600',
  },
  {
    id: 'ref-finkel-2012-algorithms',
    title: 'Online Dating: A Critical Analysis From the Perspective of Psychological Science',
    authors: 'Eli J. Finkel, Paul W. Eastwick, Benjamin R. Karney, Harry T. Reis, & Susan Sprecher',
    year: '2012',
    publication: 'Psychological Science in the Public Interest, 13(1), 3–66',
    relevanceToPersonas:
      'Critiques mathematical matching algorithms and reveals that visual 2D catalogs reduce human beings to commodified attribute shopping, validating CommonGround’s shift toward shared context and mutual intentions.',
    url: 'https://doi.org/10.1177/1529100612436522',
  },
  {
    id: 'ref-cacioppo-2008-loneliness',
    title: 'Loneliness: Human Nature and the Need for Social Connection',
    authors: 'John T. Cacioppo & William Patrick',
    year: '2008',
    publication: 'W. W. Norton & Company',
    relevanceToPersonas:
      'Details how chronic social isolation activates hyper-vigilance toward social threat, explaining why introverted or anxious individuals like Aanya experience heightened sensitivity to awkwardness and rejection.',
    url: 'https://wwnorton.com/books/Loneliness/',
  },
];

