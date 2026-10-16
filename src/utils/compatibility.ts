import { User, CompatibilityResult } from '../types';

/**
 * CommonGround Transparent Compatibility Engine
 * 
 * Weights (Configurable & Explainable):
 * - Shared Interests: 40% (Shared passions, activities, topics)
 * - Compatible Intentions: 30% (Mutual desire for friendship, activity partner, dating, etc.)
 * - Shared Core Values: 20% (Alignment on ethics, lifestyle, worldview)
 * - Communication Preferences: 10% (Pace, conversation depth, and social energy)
 * 
 * NOTE: This is an estimated indicator of common ground to facilitate conversation,
 * NEVER an infallible guarantee or superficial ranking.
 */

export const COMPATIBILITY_WEIGHTS = {
  interests: 0.40,
  intentions: 0.30,
  values: 0.20,
  communication: 0.10,
};

export function calculateCompatibility(userA: User, userB: User): CompatibilityResult {
  // 1. Shared Interests (40%)
  const setAInterests = new Set(userA.interests.map(i => i.toLowerCase().trim()));
  const setBInterests = new Set(userB.interests.map(i => i.toLowerCase().trim()));
  
  const sharedInterests = userA.interests.filter(i => 
    setBInterests.has(i.toLowerCase().trim())
  );

  // Interest score calculation: base on overlap relative to average interests count
  const maxPossibleShared = Math.max(1, Math.min(userA.interests.length, userB.interests.length));
  const interestRatio = Math.min(1, sharedInterests.length / Math.min(4, maxPossibleShared));
  const interestScore = Math.round(interestRatio * 100 * COMPATIBILITY_WEIGHTS.interests);

  // 2. Compatible Intentions (30%)
  const setAIntentions = new Set(userA.intentions);
  const sharedIntentions = userB.intentions.filter(intent => setAIntentions.has(intent));
  
  // Having at least 1 overlapping intention is critical for consent & mutual expectations
  let intentionRatio = 0;
  if (sharedIntentions.length > 0) {
    // 1 match = 80% of intention weight, 2+ matches = 100%
    intentionRatio = sharedIntentions.length >= 2 ? 1.0 : 0.8;
  } else {
    // Zero intention overlap = low compatibility because goals clash
    intentionRatio = 0.1;
  }
  const intentionScore = Math.round(intentionRatio * 100 * COMPATIBILITY_WEIGHTS.intentions);

  // 3. Shared Values (20%)
  const setBValues = new Set(userB.values.map(v => v.toLowerCase().trim()));
  const sharedValues = userA.values.filter(v => setBValues.has(v.toLowerCase().trim()));
  const valuesRatio = Math.min(1, sharedValues.length / 2.5);
  const valueScore = Math.round(valuesRatio * 100 * COMPATIBILITY_WEIGHTS.values);

  // 4. Communication Preferences (10%)
  const paceMatch = userA.communicationPreferences.pace === userB.communicationPreferences.pace;
  const styleMatch = userA.communicationPreferences.style === userB.communicationPreferences.style;
  const energyMatch = userA.communicationPreferences.socialEnergy === userB.communicationPreferences.socialEnergy;

  let commPoints = 0;
  if (paceMatch) commPoints += 4;
  if (styleMatch) commPoints += 3;
  if (energyMatch) commPoints += 3;
  const communicationScore = Math.round((commPoints / 10) * 100 * COMPATIBILITY_WEIGHTS.communication);

  const totalScore = Math.min(99, Math.max(25, interestScore + intentionScore + valueScore + communicationScore));

  // Natural language explanation
  const breakdownBullets: string[] = [];
  
  if (sharedInterests.length > 0) {
    breakdownBullets.push(
      `Shared Interests (${Math.round(interestScore / COMPATIBILITY_WEIGHTS.interests)}% match): You both enjoy ${sharedInterests.slice(0, 3).join(', ')}${sharedInterests.length > 3 ? ` and ${sharedInterests.length - 3} more` : ''}.`
    );
  } else {
    breakdownBullets.push(`Interests: Few direct overlaps, but great opportunity to exchange perspectives.`);
  }

  if (sharedIntentions.length > 0) {
    breakdownBullets.push(
      `Mutual Intentions (${Math.round(intentionScore / COMPATIBILITY_WEIGHTS.intentions)}% match): Both looking for ${sharedIntentions.join(' and ')}.`
    );
  } else {
    breakdownBullets.push(`Intentions: Different primary reasons for connecting.`);
  }

  if (sharedValues.length > 0) {
    breakdownBullets.push(
      `Shared Values (${Math.round(valueScore / COMPATIBILITY_WEIGHTS.values)}% match): Mutual focus on ${sharedValues.slice(0, 2).join(' & ')}.`
    );
  }

  if (paceMatch) {
    breakdownBullets.push(
      `Communication Pace: Both prefer a "${userA.communicationPreferences.pace}" interaction pace.`
    );
  }

  // Short natural headline explanation
  let explanation = '';
  if (sharedInterests.length >= 2 && sharedIntentions.length > 0) {
    explanation = `You both enjoy ${sharedInterests[0]} and ${sharedInterests[1]}, and both seek ${sharedIntentions[0]}.`;
  } else if (sharedInterests.length === 1 && sharedIntentions.length > 0) {
    explanation = `Connected through mutual interest in ${sharedInterests[0]} and shared ${sharedIntentions[0]} intention.`;
  } else if (sharedValues.length > 0) {
    explanation = `Strong value alignment in ${sharedValues[0]} with compatible interaction styles.`;
  } else {
    explanation = `Potential for discovering new shared passions and fresh perspectives.`;
  }

  return {
    totalScore,
    interestScore,
    intentionScore,
    valueScore,
    communicationScore,
    sharedInterests,
    sharedIntentions,
    sharedValues,
    paceMatch,
    styleMatch,
    energyMatch,
    explanation,
    breakdownBullets,
  };
}

/**
 * Generates context-aware, respectful icebreaker prompts based on shared interests
 */
export function generateSuggestedIcebreakers(userA: User, userB: User): string[] {
  const comp = calculateCompatibility(userA, userB);
  const prompts: string[] = [];

  if (comp.sharedInterests.length > 0) {
    const firstInterest = comp.sharedInterests[0];
    prompts.push(`I noticed we both enjoy ${firstInterest}. What do you love most about it?`);
    
    if (comp.sharedInterests.length > 1) {
      const secondInterest = comp.sharedInterests[1];
      prompts.push(`We both selected ${secondInterest}! Have any recommendations or favorite projects lately?`);
    }
  }

  if (comp.sharedIntentions.length > 0) {
    prompts.push(`Saw that we're both looking for ${comp.sharedIntentions[0]}. Would love to connect and share notes!`);
  }

  if (prompts.length < 3) {
    prompts.push(`Hi ${userB.name}! Your profile caught my eye because of your focus on ${userB.values[0] || 'meaningful conversations'}. Hope you're having a wonderful week!`);
  }

  return prompts.slice(0, 3);
}
