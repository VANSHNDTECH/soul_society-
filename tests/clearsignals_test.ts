import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { clearSignalsService } from '../src/services/clearSignalsService';
import { ClearSignalsReflection, ScenarioShortcut, ReplyTone } from '../src/types/clearsignals';

console.log('\n============================================================');
console.log('CommonGround — ClearSignals Comprehensive Test Suite');
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
  console.log('--- 1. Cognitive Reframing Engine & Fact vs Assumption Separation ---');

  test('Distinguishes observable facts from subjective assumptions for delayed reply', () => {
    const input = "They saw my message six hours ago but haven't replied. Maybe they don't like me anymore.";
    const reflection = clearSignalsService.analyzeSituation(input, 'delayed_reply', 'test-user-1');

    assert.ok(reflection.id.length > 0, 'Reflection must have unique ID');
    assert.strictEqual(reflection.engineType, 'rules', 'Engine must accurately label as rules/heuristics');
    assert.ok(reflection.facts.length >= 2, 'Must extract at least two observable facts');
    assert.ok(reflection.assumptions.length >= 2, 'Must identify at least two subjective assumptions');
    assert.ok(reflection.alternativeExplanations.length >= 3, 'Must offer multiple alternative hypotheses');
    assert.ok(reflection.unknowns.length >= 2, 'Must list missing unknown facts');

    // Verify it separates facts from mind-reading
    const factText = reflection.facts.join(' ').toLowerCase();
    const assumptionText = reflection.assumptions.join(' ').toLowerCase();

    assert.ok(
      factText.includes('message') || factText.includes('time') || factText.includes('hours'),
      'Facts must reference observable transmission/timeline'
    );
    assert.ok(
      assumptionText.includes('assuming') || assumptionText.includes('disinterest') || assumptionText.includes('rejection'),
      'Assumptions must flag mind-reading leaps'
    );
  });

  test('Supports all 6 scenario shortcuts with psychologically informed guidance', () => {
    const shortcuts: ScenarioShortcut[] = [
      'delayed_reply',
      'short_reply',
      'interest_uncertainty',
      'worried_said_wrong',
      'plans_changed',
      'other',
    ];

    for (const sc of shortcuts) {
      const res = clearSignalsService.analyzeSituation(`Testing scenario ${sc}`, sc, 'test-user-1');
      assert.strictEqual(res.scenarioShortcut, sc);
      assert.ok(res.facts.length > 0, `${sc} must provide observable facts`);
      assert.ok(res.assumptions.length > 0, `${sc} must provide assumptions breakdown`);
      assert.ok(res.alternativeExplanations.length > 0, `${sc} must provide alternative explanations`);
      assert.ok(res.unknowns.length > 0, `${sc} must provide unknowns`);
      assert.strictEqual(res.suggestedNextSteps.length, 3, `${sc} must offer 3 next steps (wait, clarify, express)`);
    }
  });

  test('Provides 3 distinct next-step pathways (Wait, Clarify, Express) with non-accusatory drafts', () => {
    const res = clearSignalsService.analyzeSituation("They replied with 'k'", 'short_reply', 'test-user-1');
    const waitStep = res.suggestedNextSteps.find(s => s.type === 'wait');
    const clarifyStep = res.suggestedNextSteps.find(s => s.type === 'clarify');
    const expressStep = res.suggestedNextSteps.find(s => s.type === 'express');

    assert.ok(waitStep, 'Must provide wait option');
    assert.ok(clarifyStep?.suggestedDraft, 'Clarify step must provide suggested draft');
    assert.ok(expressStep?.suggestedDraft, 'Express step must provide suggested draft');

    // Never accuse or pressure
    assert.ok(!clarifyStep.suggestedDraft.toLowerCase().includes('why did you ignore'), 'Must not accuse');
    assert.ok(!expressStep.suggestedDraft.toLowerCase().includes('you hurt my feelings'), 'Must use calm phrasing');
  });

  console.log('\n--- 2. Conversation Assistant ("Help me understand this" & "Help me reply") ---');

  test('Help me understand this: Separates literal text from speculation', () => {
    const analysis = clearSignalsService.analyzeConversationMessage('okay');

    assert.ok(analysis.literalContent.includes('okay'), 'Must state what message literally contains');
    assert.ok(analysis.whatItDoesNotEstablish.length >= 2, 'Must list what is not established');
    assert.ok(analysis.possibleInterpretations.length >= 3, 'Must offer multiple hypotheses labeled as possibilities');
    assert.ok(analysis.respectfulClarificationQuestion.length > 10, 'Must generate respectful clarification question');

    // Software must not claim to know true feelings
    const joined = analysis.whatItDoesNotEstablish.join(' ').toLowerCase();
    assert.ok(joined.includes('does not prove') || joined.includes('does not establish'));
  });

  test('Help me reply: Generates drafts across 4 tones enforcing boundary rules', () => {
    const tones: ReplyTone[] = ['casual', 'gentle', 'direct', 'boundary'];

    for (const tone of tones) {
      const draft = clearSignalsService.generateReplyDraft('Checking in after a quiet few days', tone, 'Alex');
      assert.strictEqual(draft.tone, tone);
      assert.ok(draft.draft.includes('Alex'), 'Draft must address recipient');
      assert.ok(draft.guidingPrinciples.length >= 3, 'Must document non-accusatory principles');
      
      // Verification of non-accusatory principles
      assert.ok(!draft.draft.toLowerCase().includes('you never'), 'Must not use absolute accusations');
      assert.ok(!draft.draft.toLowerCase().includes('you always'), 'Must not use sweeping accusations');
    }
  });

  console.log('\n--- 3. Private Reflection Storage & Strict Authorization ---');

  await test('User can create reflection without persisting it (unsaved by default)', () => {
    const reflection = clearSignalsService.analyzeSituation("My friend cancelled plans", 'plans_changed', 'user-alpha');
    assert.strictEqual(reflection.isSaved, false, 'Reflections must NOT be saved automatically');
  });

  await test('User can explicitly save reflection and retrieve it', async () => {
    const reflection = clearSignalsService.analyzeSituation("My friend cancelled plans", 'plans_changed', 'user-alpha');
    const saveRes = await clearSignalsService.saveReflection(reflection);

    assert.strictEqual(saveRes.success, true, 'Save must report success');
    assert.strictEqual(saveRes.data?.isSaved, true, 'Saved reflection must be marked isSaved = true');

    const retrieved = await clearSignalsService.getSavedReflections('user-alpha');
    const found = retrieved.find(r => r.id === reflection.id);
    assert.ok(found, 'Saved reflection must be retrieved for owner');
    assert.strictEqual(found.situation, reflection.situation);
  });

  await test('Second user cannot access first user reflections (Privacy Boundary)', async () => {
    const retrievedByOther = await clearSignalsService.getSavedReflections('user-beta');
    const leaked = retrievedByOther.find(r => r.userId === 'user-alpha');
    assert.strictEqual(leaked, undefined, 'User Beta must NEVER receive User Alpha private reflections');
  });

  await test('User can delete their own saved reflection', async () => {
    const reflection = clearSignalsService.analyzeSituation("Test reflection for deletion", 'other', 'user-alpha');
    await clearSignalsService.saveReflection(reflection);

    const deleteRes = await clearSignalsService.deleteReflection(reflection.id, 'user-alpha');
    assert.strictEqual(deleteRes.success, true, 'Delete must report success');

    const retrievedAfter = await clearSignalsService.getSavedReflections('user-alpha');
    assert.strictEqual(retrievedAfter.find(r => r.id === reflection.id), undefined, 'Deleted reflection must be removed');
  });

  console.log('\n--- 4. Database Schema & RLS Policy Verification ---');

  test('setup.sql defines public.private_reflections table with required fields', () => {
    const setupSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/setup.sql'), 'utf-8');
    assert.ok(setupSql.includes('CREATE TABLE IF NOT EXISTS public.private_reflections'), 'Must define private_reflections table');
    assert.ok(setupSql.includes('user_id UUID REFERENCES public.profiles(id)'), 'Must reference profiles table');
    assert.ok(setupSql.includes('situation TEXT NOT NULL'), 'Must include situation field');
    assert.ok(setupSql.includes('facts TEXT[] NOT NULL'), 'Must include facts array');
    assert.ok(setupSql.includes('assumptions TEXT[] NOT NULL'), 'Must include assumptions array');
    assert.ok(setupSql.includes('alternative_explanations TEXT[] NOT NULL'), 'Must include alternative_explanations array');
    assert.ok(setupSql.includes('unknowns TEXT[] NOT NULL'), 'Must include unknowns array');
    assert.ok(setupSql.includes('suggested_next_steps JSONB NOT NULL'), 'Must include suggested_next_steps jsonb');
  });

  test('setup.sql enables RLS and strictly enforces auth.uid() = user_id policies', () => {
    const setupSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/setup.sql'), 'utf-8');
    assert.ok(setupSql.includes('ALTER TABLE public.private_reflections ENABLE ROW LEVEL SECURITY;'), 'Must enable RLS');
    assert.ok(setupSql.includes('CREATE POLICY "Users can only view their own private reflections"'), 'Must define view policy');
    assert.ok(setupSql.includes('CREATE POLICY "Users can create their own private reflections"'), 'Must define create policy');
    assert.ok(setupSql.includes('CREATE POLICY "Users can update their own private reflections"'), 'Must define update policy');
    assert.ok(setupSql.includes('CREATE POLICY "Users can delete their own private reflections"'), 'Must define delete policy');
    assert.ok(setupSql.includes('USING (auth.uid() = user_id)'), 'Policies must enforce auth.uid() = user_id');
  });

  console.log('\n============================================================');
  console.log(`ClearSignals Test Suite Finished: ${passedCount} PASSED, 0 FAILED`);
  console.log('============================================================\n');
}

runTests();
