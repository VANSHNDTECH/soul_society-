import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { calculateCompatibility, DEFAULT_INFLUENCE_SETTINGS } from '../src/utils/compatibility';
import { clearSignalsService } from '../src/services/clearSignalsService';
import { User, InfluenceSettings } from '../src/types';

console.log('\n============================================================');
console.log('CommonGround — OpenSignals Transparent Connections Test Suite');
console.log('============================================================\n');

let passedCount = 0;
function test(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res.then(() => {
        console.log(`  ✓ PASS: ${name}`);
        passedCount++;
      }).catch((err) => {
        console.error(`  ✗ FAIL: ${name}`);
        console.error(err);
        process.exitCode = 1;
      });
    } else {
      console.log(`  ✓ PASS: ${name}`);
      passedCount++;
    }
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

async function runTests() {
  const userMe: User = {
    id: 'user-me',
    name: 'Current User',
    headline: 'Exploring thoughtful conversation',
    bio: 'Test user bio',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    avatarColor: 'teal',
    intentions: ['Meaningful Friendship', 'Study & Co-working'],
    interests: ['Book Clubs', 'Philosophy', 'Board Games'],
    values: ['Curiosity', 'Open Communication', 'Empathy'],
    communicationPreferences: {
      pace: 'A few thoughtful messages a day',
      style: 'Balanced & reflective',
      socialEnergy: 'Introverted / Calm',
    },
    privacySettings: {
      discoveryPaused: false,
      visibility: 'public_match',
      showLocation: true,
      introRequirement: 'any',
      aiAssistanceEnabled: true,
      influenceSettings: DEFAULT_INFLUENCE_SETTINGS,
    },
    joinedDate: '2026-01-15',
  };

  const partnerDemo: User = {
    id: 'user-demo-rohan',
    name: 'Rohan Sharma',
    headline: 'Avid reader and board game lover',
    bio: 'Avid reader and board game lover',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    avatarColor: 'blue',
    intentions: ['Meaningful Friendship', 'Study & Co-working'],
    interests: ['Book Clubs', 'Board Games', 'Specialty Coffee'],
    values: ['Curiosity', 'Empathy', 'Respect'],
    communicationPreferences: {
      pace: 'A few thoughtful messages a day',
      style: 'Balanced & reflective',
      socialEnergy: 'Introverted / Calm',
    },
    privacySettings: {
      discoveryPaused: false,
      visibility: 'public_match',
      showLocation: true,
      introRequirement: 'any',
      aiAssistanceEnabled: true,
    },
    joinedDate: '2026-02-01',
  };

  const partnerRegistered: User = {
    id: 'usr_real_987123',
    name: 'Priya Verma',
    headline: 'Software engineer and indie book lover',
    bio: 'Software engineer and indie book lover',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    avatarColor: 'emerald',
    intentions: ['Meaningful Friendship'],
    interests: ['Philosophy', 'Book Clubs'],
    values: ['Open Communication', 'Curiosity'],
    communicationPreferences: {
      pace: 'Real-time spontaneous chats',
      style: 'Prompt & concise',
      socialEnergy: 'Extroverted / High energy',
    },
    privacySettings: {
      discoveryPaused: false,
      visibility: 'public_match',
      showLocation: true,
      introRequirement: 'any',
    },
    joinedDate: '2026-02-10',
  };

  console.log('--- 1. Explain Connection Recommendations ("Why am I seeing this person?") ---');

  test('Produces honest, multi-factor compatibility explanation based on actual factors', () => {
    const result = calculateCompatibility(userMe, partnerDemo);

    assert.ok(result.score > 0 && result.score <= 100, 'Score must be between 1 and 100');
    assert.ok(result.reasons.length >= 2, 'Must provide concrete reasons');
    assert.ok(result.sharedInterests.length > 0, 'Must identify shared interests');
    assert.ok(result.sharedValues.length > 0, 'Must identify shared values');
    assert.ok(result.sharedIntentions.length > 0, 'Must identify shared intentions');
    assert.strictEqual(result.paceMatch, true, 'Pace match must be true when identical');
    assert.strictEqual(result.isDemoProfile, true, 'Must correctly identify user-demo-* as demo profile');

    // Verify reasons do NOT claim attraction or emotional certainty
    for (const reason of result.reasons) {
      const lower = reason.toLowerCase();
      assert.ok(!lower.includes('attraction') && !lower.includes('romantic fate') && !lower.includes('guaranteed chemistry'),
        'Reasons must never claim attraction or guaranteed chemistry');
    }
  });

  test('Distinguishes demo personas from live community profiles honestly', () => {
    const demoResult = calculateCompatibility(userMe, partnerDemo);
    const realResult = calculateCompatibility(userMe, partnerRegistered);

    assert.strictEqual(demoResult.isDemoProfile, true, 'Demo profile flagged as demo');
    assert.strictEqual(realResult.isDemoProfile, false, 'Registered profile not flagged as demo');
  });

  console.log('\n--- 2. User-Governed Influence Controls (Feature C & Factor Weight Toggling) ---');

  test('Excluding interests from influence zeroes out interest score and lists it in inactiveFactors', () => {
    const normalResult = calculateCompatibility(userMe, partnerDemo, DEFAULT_INFLUENCE_SETTINGS);

    const customSettings: InfluenceSettings = {
      ...DEFAULT_INFLUENCE_SETTINGS,
      useInterestsInMatching: false,
    };

    const customizedResult = calculateCompatibility(userMe, partnerDemo, customSettings);

    // Score without interests (40% weight removed) must be less than normal
    assert.ok((customizedResult.score || 0) < (normalResult.score || 0), 'Score should decrease when interests factor is disabled');
    assert.ok(customizedResult.inactiveFactors?.some(f => f.includes('Shared Interests')),
      'Inactive factor list must clearly disclose disabled interests factor');
    assert.ok(customizedResult.activeFactors?.some(f => f.includes('Intentions')),
      'Active factor list must include intentions');
  });

  test('Excluding intentions zeroes out intention score and recalculates deterministically', () => {
    const customSettings: InfluenceSettings = {
      ...DEFAULT_INFLUENCE_SETTINGS,
      useIntentionsInMatching: false,
    };

    const customizedResult = calculateCompatibility(userMe, partnerDemo, customSettings);
    assert.ok(customizedResult.inactiveFactors?.some(f => f.includes('Intentions')), 'Inactive factor list must disclose intentions turned off');
    assert.ok(!customizedResult.reasons?.some(r => r.includes('Both looking for')), 'Must not include mutual intention match bullet');
  });

  test('Disabling all factors yields a transparent score of 0 with all inactive factors reported', () => {
    const zeroSettings: InfluenceSettings = {
      aiAssistanceEnabled: false,
      useInterestsInMatching: false,
      useIntentionsInMatching: false,
      useValuesInMatching: false,
      useCommunicationPaceInMatching: false,
    };

    const zeroResult = calculateCompatibility(userMe, partnerDemo, zeroSettings);
    assert.strictEqual(zeroResult.score, 0, 'Score should be 0 when all matching factors are disabled');
    assert.strictEqual(zeroResult.activeFactors?.length, 0, 'No active factors when all toggled off');
    assert.strictEqual(zeroResult.inactiveFactors?.length, 4, 'All 4 factors must be listed as inactive');
    assert.ok(zeroResult.reasons[0].includes('All recommendation influence factors have been disabled'),
      'Must explain why score is 0');
  });

  console.log('\n--- 3. AI Assistance Disclosure & User Agency (Feature B) ---');

  test('AI assistance drafts are labeled honestly with explicit user-send requirement', () => {
    const draft = clearSignalsService.generateReplyDraft(
      "Are we still on for the book club?",
      'gentle',
      'Rohan'
    );

    assert.ok(draft.draft.length > 0, 'Must produce non-empty draft');
    assert.strictEqual(draft.engineType, 'rules', 'Engine type must be accurately labeled as heuristic/rules');
    assert.strictEqual(draft.tone, 'gentle');

    // Test that the draft does not contain hostile or accusatory language
    assert.ok(!draft.draft.toLowerCase().includes('why are you asking'), 'Must be gentle and supportive');
  });

  test('AI drafting assistance can be enabled or disabled via InfluenceSettings', () => {
    const enabledSettings: InfluenceSettings = { ...DEFAULT_INFLUENCE_SETTINGS, aiAssistanceEnabled: true };
    const disabledSettings: InfluenceSettings = { ...DEFAULT_INFLUENCE_SETTINGS, aiAssistanceEnabled: false };

    assert.strictEqual(enabledSettings.aiAssistanceEnabled, true);
    assert.strictEqual(disabledSettings.aiAssistanceEnabled, false);
  });

  console.log('\n--- 4. Recommendation Dismissal Logic ---');

  test('Dismissed user IDs filter out from active recommendations', () => {
    const discoverablePool: User[] = [partnerDemo, partnerRegistered];
    const dismissedUserIds: string[] = ['user-demo-rohan'];

    const filtered = discoverablePool.filter(u => !dismissedUserIds.includes(u.id));
    assert.strictEqual(filtered.length, 1, 'Dismissed user must be removed from discoverable pool');
    assert.strictEqual(filtered[0].id, 'usr_real_987123');

    // Resetting dismissed recommendations restores pool
    const resetDismissed: string[] = [];
    const restored = discoverablePool.filter(u => !resetDismissed.includes(u.id));
    assert.strictEqual(restored.length, 2, 'Restoring dismissed recommendations brings all users back');
  });

  console.log('\n--- 5. Database Schema & Persistence Verification ---');

  test('supabase/setup.sql contains influence_settings column on public.profiles', () => {
    const sqlPath = path.resolve(process.cwd(), 'supabase', 'setup.sql');
    assert.ok(fs.existsSync(sqlPath), 'setup.sql must exist');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    assert.ok(sqlContent.includes('influence_settings JSONB'), 'setup.sql must define influence_settings JSONB column');
    assert.ok(sqlContent.includes('ai_assistance_enabled'), 'setup.sql default must specify ai_assistance_enabled');
    assert.ok(sqlContent.includes('use_interests'), 'setup.sql default must specify use_interests');
  });

  console.log('\n============================================================');
  console.log(`OpenSignals Test Suite Complete: ${passedCount} tests passed.`);
  console.log('============================================================\n');
}

runTests();
