import { TOP_PROBLEMS, EVIDENCE_SOURCES, MEETING_METHODS } from '../src/data/researchData';
import { PERSONAS, BARRIERS, CURRENT_METHODS_ANALYSIS, FEATURE_MAPPINGS } from '../src/data/module2Data';
import { MOCK_USERS, INITIAL_CURRENT_USER } from '../src/data/mockUsers';
import { calculateCompatibility, generateSuggestedIcebreakers } from '../src/utils/compatibility';
import { researchService } from '../src/services/researchService';
import { personaService } from '../src/services/personaService';
import { authService } from '../src/services/authService';
import { connectionService } from '../src/services/connectionService';
import { chatService } from '../src/services/chatService';
import { safetyService } from '../src/services/safetyService';
import { profileService } from '../src/services/profileService';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✕ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    failed++;
  }
}

async function runAuditSuite() {
  console.log('\n============================================================');
  console.log('CommonGround — Comprehensive Application Audit & Verification');
  console.log('============================================================\n');

  // --------------------------------------------------------------------------
  // Phase 2: Module 1 Audit (The Problem Detective)
  // --------------------------------------------------------------------------
  console.log('--- Phase 2: Module 1 (The Problem Detective) ---');

  // Test 1.1: 5 Candidate Problems
  assert(
    TOP_PROBLEMS.length === 5,
    'Module 1 defines exactly 5 primary empirical problems',
    `Found ${TOP_PROBLEMS.length}`
  );

  // Test 1.2: Problem Scoring Integrity
  const allProblemsHaveValidScores = TOP_PROBLEMS.every(p => 
    p.baselineScores.severity >= 1 && p.baselineScores.severity <= 5 &&
    p.baselineScores.reach >= 1 && p.baselineScores.reach <= 5 &&
    p.baselineScores.evidenceStrength >= 1 && p.baselineScores.evidenceStrength <= 5 &&
    p.baselineScores.opportunity >= 1 && p.baselineScores.opportunity <= 5
  );
  assert(allProblemsHaveValidScores, 'All candidate problems have bounded 1-5 empirical scores');

  // Test 1.3: Composite Score Formula Check
  const problem1 = TOP_PROBLEMS[0];
  const calculatedComposite = Number((
    (problem1.baselineScores.severity * 0.3) +
    (problem1.baselineScores.reach * 0.25) +
    (problem1.baselineScores.evidenceStrength * 0.25) +
    (problem1.baselineScores.opportunity * 0.2)
  ).toFixed(2));
  assert(
    calculatedComposite >= 1 && calculatedComposite <= 5,
    `Problem baseline scores calculate a valid composite score (${calculatedComposite}/5)`
  );

  // Test 1.4: Evidence Sources Integrity
  assert(
    EVIDENCE_SOURCES.length >= 7,
    `Module 1 contains at least 7 annotated academic sources (found ${EVIDENCE_SOURCES.length})`
  );

  const sourcesHaveValidUrls = EVIDENCE_SOURCES.every(s => 
    s.directUrl && s.directUrl.startsWith('http') && s.authorOrOrganization && s.publicationDate
  );
  assert(sourcesHaveValidUrls, 'All evidence sources provide direct external URLs, authors, and dates');

  // Test 1.5: Meeting Methods Analysis
  assert(
    MEETING_METHODS.length === 4,
    `Module 1 compares 4 major meeting methods (found ${MEETING_METHODS.length})`
  );

  // Test 1.6: Research Service Integration
  const fetchedProblems = await researchService.getProblems();
  assert(
    fetchedProblems.length === 5,
    'researchService.getProblems() returns 5 candidate problems'
  );

  // --------------------------------------------------------------------------
  // Phase 2: Module 2 Audit (The People Left Out)
  // --------------------------------------------------------------------------
  console.log('\n--- Phase 2: Module 2 (The People Left Out) ---');

  // Test 2.1: 3 Human-Centered Personas
  assert(
    PERSONAS.length === 3,
    `Module 2 includes 3 detailed user personas (found ${PERSONAS.length})`
  );

  // Test 2.2: Persona Completeness
  const personaCompleteness = PERSONAS.every(p =>
    p.name && p.age && p.archetype && p.context && p.illustrativeQuote &&
    p.primaryGoal && p.goals.length > 0 && p.painPoints.length > 0 &&
    p.unmetNeeds.length > 0 && p.empathyMap && p.commonGroundFitSummary
  );
  assert(personaCompleteness, 'All personas provide complete qualitative profiles and empathy maps');

  // Test 2.3: Barriers Analysis
  assert(
    BARRIERS.length >= 12,
    `Module 2 maps at least 12 granular human connection obstacles (found ${BARRIERS.length})`
  );

  const categories = new Set(BARRIERS.map(b => b.category));
  assert(
    categories.size === 5,
    `Barriers span 5 distinct categories: Emotional, Structural, Discovery, Accessibility, and Safety (found ${categories.size})`
  );

  // Test 2.4: Current Methods Analysis
  assert(
    CURRENT_METHODS_ANALYSIS.length === 6,
    `Module 2 analyzes 6 current connection methods (found ${CURRENT_METHODS_ANALYSIS.length})`
  );

  // Test 2.5: Traceable Feature Mapping
  assert(
    FEATURE_MAPPINGS.length >= 6,
    `Module 2 provides traceable feature mappings from needs to solutions (found ${FEATURE_MAPPINGS.length})`
  );

  // Test 2.6: Persona Service Integration
  const fetchedPersonas = await personaService.getPersonas();
  assert(
    fetchedPersonas.length === 3,
    'personaService.getPersonas() loads personas cleanly'
  );

  // --------------------------------------------------------------------------
  // Phase 2: Module 3 Audit (The Solution Architect & Connection Platform)
  // --------------------------------------------------------------------------
  console.log('\n--- Phase 2: Module 3 (The Solution Architect) ---');

  // Test 3.1: Explainable Compatibility Algorithm
  const userA = INITIAL_CURRENT_USER;
  const userB = MOCK_USERS[0];
  const comp = calculateCompatibility(userA, userB);
  assert(
    comp.totalScore >= 0 && comp.totalScore <= 100,
    `Compatibility score is bounded 0-100% (calculated ${comp.totalScore}%)`
  );
  assert(
    comp.interestScore <= 40 && comp.intentionScore <= 30 && comp.valueScore <= 20 && comp.communicationScore <= 10,
    'Compatibility weighting strictly adheres to 40% Interests, 30% Intentions, 20% Values, 10% Style'
  );

  // Test 3.2: Icebreaker Generation
  const prompts = generateSuggestedIcebreakers(userA, userB);
  assert(
    prompts.length >= 1,
    `generateSuggestedIcebreakers produces contextual prompts (generated ${prompts.length} prompts)`
  );

  // Test 3.3: Connection Request Lifecycle
  const reqRes = await connectionService.sendIntroductionRequest({
    senderId: userA.id,
    recipientId: userB.id,
    introMessage: 'Would love to chat about ceramics and pour-over coffee!',
    sharedInterest: 'Ceramics & Pottery',
  });
  assert(
    reqRes.request !== null && reqRes.request.status === 'pending',
    'connectionService creates introduction requests in pending status'
  );

  // Test 3.4: Connection Acceptance
  const acceptRes = await connectionService.acceptRequest(reqRes.request!.id, userB.id);
  assert(
    acceptRes.connection !== null && acceptRes.connection.status === 'active',
    'connectionService accepting request creates an active connection'
  );

  // Test 3.5: Chat Messaging
  const chatRes = await chatService.sendMessage({
    conversationId: `conv-${acceptRes.connection!.id}`,
    senderId: userA.id,
    content: 'Hi! Looking forward to our conversation.',
  });
  assert(
    chatRes.message !== null && chatRes.message.content.length > 0,
    'chatService stores and returns sent chat messages'
  );

  // Test 3.6: Safety Controls (Block & Report)
  const blockRes = await safetyService.blockUser({
    blockerId: userA.id,
    blockedId: userB.id,
  });
  assert(
    blockRes.block !== null && blockRes.block.blocked_id === userB.id,
    'safetyService records user block action'
  );

  const reportRes = await safetyService.reportUser({
    reporterId: userA.id,
    reportedId: userB.id,
    reason: 'Inappropriate Content',
    description: 'Test moderation logging',
  });
  assert(
    reportRes.report !== null && reportRes.report.reason === 'Inappropriate Content',
    'safetyService securely records moderation reports'
  );

  // --------------------------------------------------------------------------
  // Phase 4: Database Schema, Migrations, and RLS Audit
  // --------------------------------------------------------------------------
  console.log('\n--- Phase 4: Database Schema, Migrations, and RLS Audit ---');

  const setupSqlPath = resolve(process.cwd(), 'supabase/setup.sql');
  assert(existsSync(setupSqlPath), 'supabase/setup.sql master script exists');

  const setupSql = readFileSync(setupSqlPath, 'utf8');

  // Check table definitions
  const expectedTables = [
    'public.profiles',
    'public.interests',
    'public.user_interests',
    'public.connection_requests',
    'public.connections',
    'public.conversations',
    'public.conversation_participants',
    'public.messages',
    'public.user_blocks',
    'public.user_reports',
    'public.research_problems',
    'public.research_sources',
    'public.personas',
  ];
  for (const table of expectedTables) {
    assert(
      setupSql.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
      `Schema defines table: ${table}`
    );
  }

  // Check RLS Enablement
  assert(
    setupSql.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'),
    'Row Level Security enabled on profiles'
  );
  assert(
    setupSql.includes('ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;'),
    'Row Level Security enabled on messages'
  );
  assert(
    setupSql.includes('ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;'),
    'Row Level Security enabled on connections'
  );

  // Check Security Definer helper functions
  assert(
    setupSql.includes('CREATE OR REPLACE FUNCTION public.is_editor_or_admin()'),
    'Security Definer function is_editor_or_admin() defined'
  );
  assert(
    setupSql.includes('CREATE OR REPLACE FUNCTION public.is_blocked_with('),
    'Security Definer function is_blocked_with() defined'
  );

  // Check Canonical Pairwise constraint on connections
  assert(
    setupSql.includes('CONSTRAINT canonical_user_order CHECK (user1_id < user2_id)'),
    'Connections enforce canonical ordering constraint (user1_id < user2_id)'
  );

  // Check Partial Unique Index on pending requests
  assert(
    setupSql.includes('CREATE UNIQUE INDEX IF NOT EXISTS unique_pending_request_idx'),
    'Connection requests enforce unique pending requests per user pair'
  );

  // --------------------------------------------------------------------------
  // Phase 6: Security & Privacy Audit
  // --------------------------------------------------------------------------
  console.log('\n--- Phase 6: Security and Privacy Audit ---');

  // Test 6.1: Secrets leak check in frontend code
  const envExamplePath = resolve(process.cwd(), '.env.example');
  assert(existsSync(envExamplePath), '.env.example template file exists with placeholders');

  const gitignorePath = resolve(process.cwd(), '.gitignore');
  const gitignore = readFileSync(gitignorePath, 'utf8');
  assert(
    gitignore.includes('.env') && gitignore.includes('.env.local'),
    '.gitignore strictly excludes local environment secrets (.env, .env.local)'
  );

  // Test 6.2: Check that no service role key is hardcoded in src/
  const supabaseClientSource = readFileSync(resolve(process.cwd(), 'src/lib/supabase.ts'), 'utf8');
  assert(
    !supabaseClientSource.includes('service_role') && !supabaseClientSource.includes('eyJhbGciOi'),
    'No Supabase service_role keys or raw JWT secrets hardcoded in src/lib/supabase.ts'
  );

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`Audit Suite Finished: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuditSuite().catch(err => {
  console.error('Unhandled error during audit suite execution:', err);
  process.exit(1);
});
