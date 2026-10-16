import { User, CompatibilityResult, InfluenceSettings } from '../types';

/**
 * CommonGround Transparent Compatibility Engine
 * 
 * Weights (Configurable & Explainable via OpenSignals):
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

export const DEFAULT_INFLUENCE_SETTINGS: InfluenceSettings = {
  aiAssistanceEnabled: true,
  useInterestsInMatching: true,
  useIntentionsInMatching: true,
  useValuesInMatching: true,
  useCommunicationPaceInMatching: true,
};

export function calculateCompatibility(
  userA: User,
  userB: User,
  customSettings?: InfluenceSettings
): CompatibilityResult {
  const settings = customSettings || userA.privacySettings?.influenceSettings || DEFAULT_INFLUENCE_SETTINGS;

  const activeFactors: string[] = [];
  const inactiveFactors: string[] = [];

  // 1. Shared Interests (40%)
  const setAInterests = new Set(userA.interests.map(i => i.toLowerCase().trim()));
  const setBInterests = new Set(userB.interests.map(i => i.toLowerCase().trim()));
  
  const sharedInterests = userA.interests.filter(i => 
    setBInterests.has(i.toLowerCase().trim())
  );

  let interestScore = 0;
  if (settings.useInterestsInMatching) {
    const maxPossibleShared = Math.max(1, Math.min(userA.interests.length, userB.interests.length));
    const interestRatio = Math.min(1, sharedInterests.length / Math.min(4, maxPossibleShared));
    interestScore = Math.round(interestRatio * 100 * COMPATIBILITY_WEIGHTS.interests);
    if (sharedInterests.length > 0) {
      activeFactors.push(`Shared Interests: ${sharedInterests.slice(0, 3).join(', ')}`);
    }
  } else {
    inactiveFactors.push('Shared Interests (Turned off in OpenSignals)');
  }

  // 2. Compatible Intentions (30%)
  const setAIntentions = new Set(userA.intentions);
  const sharedIntentions = userB.intentions.filter(intent => setAIntentions.has(intent));
  
  let intentionScore = 0;
  if (settings.useIntentionsInMatching) {
    let intentionRatio = 0;
    if (sharedIntentions.length > 0) {
      intentionRatio = sharedIntentions.length >= 2 ? 1.0 : 0.8;
      activeFactors.push(`Compatible Intentions: ${sharedIntentions.join(' & ')}`);
    } else {
      intentionRatio = 0.1;
    }
    intentionScore = Math.round(intentionRatio * 100 * COMPATIBILITY_WEIGHTS.intentions);
  } else {
    inactiveFactors.push('Compatible Intentions (Turned off in OpenSignals)');
  }

  // 3. Shared Values (20%)
  const setBValues = new Set(userB.values.map(v => v.toLowerCase().trim()));
  const sharedValues = userA.values.filter(v => setBValues.has(v.toLowerCase().trim()));
  
  let valueScore = 0;
  if (settings.useValuesInMatching) {
    const valuesRatio = Math.min(1, sharedValues.length / 2.5);
    valueScore = Math.round(valuesRatio * 100 * COMPATIBILITY_WEIGHTS.values);
    if (sharedValues.length > 0) {
      activeFactors.push(`Shared Core Values: ${sharedValues.slice(0, 2).join(', ')}`);
    }
  } else {
    inactiveFactors.push('Shared Values (Turned off in OpenSignals)');
  }

  // 4. Communication Preferences (10%)
  const paceA = userA.communicationPreferences?.pace;
  const paceB = userB.communicationPreferences?.pace;
  const paceMatch = Boolean(paceA && paceB && paceA === paceB);
  const styleMatch = Boolean(
    userA.communicationPreferences?.style &&
    userB.communicationPreferences?.style &&
    userA.communicationPreferences.style === userB.communicationPreferences.style
  );
  const energyMatch = Boolean(
    userA.communicationPreferences?.socialEnergy &&
    userB.communicationPreferences?.socialEnergy &&
    userA.communicationPreferences.socialEnergy === userB.communicationPreferences.socialEnergy
  );

  let communicationScore = 0;
  if (settings.useCommunicationPaceInMatching) {
    let commPoints = 0;
    if (paceMatch) commPoints += 4;
    if (styleMatch) commPoints += 3;
    if (energyMatch) commPoints += 3;
    communicationScore = Math.round((commPoints / 10) * 100 * COMPATIBILITY_WEIGHTS.communication);
    if (paceMatch && paceA) {
      activeFactors.push(`Matching Pace: "${paceA}"`);
    }
  } else {
    inactiveFactors.push('Communication Style & Pace (Turned off in OpenSignals)');
  }

  const isDemo = Boolean(userB.id?.startsWith('user-demo-') || userB.id?.startsWith('user-current-'));

  const allFactorsDisabled =
    !settings.useInterestsInMatching &&
    !settings.useIntentionsInMatching &&
    !settings.useValuesInMatching &&
    !settings.useCommunicationPaceInMatching;

  const rawSum = interestScore + intentionScore + valueScore + communicationScore;
  const totalScore = allFactorsDisabled ? 0 : Math.min(99, Math.max(10, rawSum));

  // Natural language explanation
  const breakdownBullets: string[] = [];

  if (allFactorsDisabled) {
    breakdownBullets.push('All recommendation influence factors have been disabled in your OpenSignals settings.');
  } else {
    if (sharedInterests.length > 0 && settings.useInterestsInMatching) {
      breakdownBullets.push(
        `Shared Interests (${Math.round(interestScore / COMPATIBILITY_WEIGHTS.interests)}% match): You both enjoy ${sharedInterests.slice(0, 3).join(', ')}${sharedInterests.length > 3 ? ` and ${sharedInterests.length - 3} more` : ''}.`
      );
    } else if (!settings.useInterestsInMatching) {
      breakdownBullets.push(`Interests: Excluded from calculation by your OpenSignals settings.`);
    } else {
      breakdownBullets.push(`Interests: Few direct overlaps, but great opportunity to exchange perspectives.`);
    }

    if (sharedIntentions.length > 0 && settings.useIntentionsInMatching) {
      breakdownBullets.push(
        `Mutual Intentions (${Math.round(intentionScore / COMPATIBILITY_WEIGHTS.intentions)}% match): Both looking for ${sharedIntentions.join(' and ')}.`
      );
    } else if (!settings.useIntentionsInMatching) {
      breakdownBullets.push(`Intentions: Excluded from calculation by your OpenSignals settings.`);
    } else {
      breakdownBullets.push(`Intentions: Different primary reasons for connecting.`);
    }

    if (sharedValues.length > 0 && settings.useValuesInMatching) {
      breakdownBullets.push(
        `Shared Values (${Math.round(valueScore / COMPATIBILITY_WEIGHTS.values)}% match): Mutual focus on ${sharedValues.slice(0, 2).join(' & ')}.`
      );
    }

    if (paceMatch && settings.useCommunicationPaceInMatching && paceA) {
      breakdownBullets.push(
        `Communication Pace: Both prefer a "${paceA}" interaction pace.`
      );
    }
  }

  // Short natural headline explanation
  let explanation = '';
  if (allFactorsDisabled) {
    explanation = 'All matching influence factors have been disabled in your OpenSignals settings.';
  } else if (sharedInterests.length >= 2 && sharedIntentions.length > 0 && settings.useInterestsInMatching) {
    explanation = `You both enjoy ${sharedInterests[0]} and ${sharedInterests[1]}, and both seek ${sharedIntentions[0]}.`;
  } else if (sharedInterests.length === 1 && sharedIntentions.length > 0 && settings.useInterestsInMatching) {
    explanation = `Connected through mutual interest in ${sharedInterests[0]} and shared ${sharedIntentions[0]} intention.`;
  } else if (sharedValues.length > 0 && settings.useValuesInMatching) {
    explanation = `Strong value alignment in ${sharedValues[0]} with compatible interaction styles.`;
  } else {
    explanation = `Potential for discovering new shared passions and fresh perspectives.`;
  }

  return {
    totalScore,
    score: totalScore,
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
    reasons: breakdownBullets,
    activeFactors,
    inactiveFactors,
    isDemoProfile: isDemo,
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
