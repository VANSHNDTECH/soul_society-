import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbProfile } from '../types/database';
import { CompatibilityResult, User, IntentionType } from '../types';
import { MOCK_USERS } from '../data/mockUsers';

export interface DiscoverableProfile {
  profile: DbProfile;
  interests: string[];
  compatibility: CompatibilityResult;
}

export const discoveryService = {
  async getDiscoverableProfiles(
    currentUserId: string,
    currentUserProfile?: DbProfile,
    currentUserInterests?: string[]
  ): Promise<DiscoverableProfile[]> {
    const userInterests = currentUserInterests || ['specialty-coffee', 'analog-photography', 'hiking-trails'];
    const userIntentions = currentUserProfile?.intentions || ['Friendship', 'Activity Partners'];

    if (isSupabaseConfigured() && supabase) {
      try {
        // Query profiles with discovery enabled and not equal to current user
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select(`
            id,
            display_name,
            age,
            bio,
            avatar_url,
            role,
            intentions,
            communication_style,
            social_energy,
            pace_preference,
            discovery_enabled,
            profile_visibility,
            location,
            created_at,
            updated_at
          `)
          .eq('discovery_enabled', true)
          .neq('id', currentUserId)
          .neq('profile_visibility', 'hidden');

        if (error) {
          console.error('Error fetching discovery profiles from Supabase:', error);
        } else if (profiles && profiles.length > 0) {
          // Fetch user interests
          const { data: userInts } = await supabase
            .from('user_interests')
            .select('user_id, interest_id');

          const userInterestMap = new Map<string, string[]>();
          (userInts || []).forEach((row: any) => {
            const list = userInterestMap.get(row.user_id) || [];
            list.push(row.interest_id);
            userInterestMap.set(row.user_id, list);
          });

          // Fetch blocks
          const { data: blocks } = await supabase
            .from('user_blocks')
            .select('blocked_id')
            .eq('blocker_id', currentUserId);

          const blockedIds = new Set((blocks || []).map((b: any) => b.blocked_id));

          return profiles
            .filter((p) => !blockedIds.has(p.id))
            .map((p) => {
              const profileInterests = userInterestMap.get(p.id) || ['indie-boardgames', 'sci-fi-fiction'];
              const compatibility = this.calculateCompatibility(
                userInterests,
                userIntentions,
                currentUserProfile?.communication_style || 'Deep & reflective',
                currentUserProfile?.social_energy || 'Ambivert / Adaptable',
                profileInterests,
                p.intentions || ['Friendship'],
                p.communication_style || 'Lighthearted & casual',
                p.social_energy || 'Ambivert / Adaptable'
              );

              return {
                profile: p as DbProfile,
                interests: profileInterests,
                compatibility,
              };
            });
        }
      } catch (err) {
        console.error('Failed to run live discovery query:', err);
      }
    }

    // High-fidelity fallback based on existing research personas and mock directory
    return MOCK_USERS.filter((u) => u.id !== currentUserId).map((u) => {
      const mockProfile: DbProfile = {
        id: u.id,
        display_name: u.name,
        age: u.age || 22,
        bio: u.bio,
        avatar_url: u.avatar,
        role: 'user',
        intentions: u.intentions,
        communication_style: u.communicationPreferences.style,
        social_energy: u.communicationPreferences.socialEnergy,
        pace_preference: u.communicationPreferences.pace,
        discovery_enabled: !u.privacySettings.discoveryPaused,
        profile_visibility: 'standard',
        location: u.location,
        created_at: u.joinedDate,
        updated_at: u.joinedDate,
      };

      const compatibility = this.calculateCompatibility(
        userInterests,
        userIntentions,
        currentUserProfile?.communication_style || 'Deep & reflective',
        currentUserProfile?.social_energy || 'Ambivert / Adaptable',
        u.interests,
        u.intentions,
        u.communicationPreferences.style,
        u.communicationPreferences.socialEnergy
      );

      return {
        profile: mockProfile,
        interests: u.interests,
        compatibility,
      };
    });
  },

  calculateCompatibility(
    userAInterests: string[],
    userAIntentions: string[],
    userAStyle: string,
    userAEnergy: string,
    userBInterests: string[],
    userBIntentions: string[],
    userBStyle: string,
    userBEnergy: string
  ): CompatibilityResult {
    // 1. Shared Interests (40% Weight)
    const normAInterests = userAInterests.map((s) => s.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const sharedInterests = userBInterests.filter((b) =>
      normAInterests.includes(b.toLowerCase().replace(/[^a-z0-9]/g, ''))
    );
    const interestRatio = userAInterests.length > 0 ? sharedInterests.length / Math.max(userAInterests.length, 3) : 0.5;
    const interestScore = Math.min(40, Math.round(interestRatio * 40));

    // 2. Compatible Intentions (30% Weight)
    const sharedIntentions = userAIntentions.filter((i) => userBIntentions.includes(i)) as IntentionType[];
    const intentionRatio = userAIntentions.length > 0 ? sharedIntentions.length / userAIntentions.length : 0.6;
    const intentionScore = Math.min(30, Math.round(intentionRatio * 30));

    // 3. Values & Style Match (20% Weight)
    const styleMatch = userAStyle === userBStyle;
    const valueScore = styleMatch ? 20 : 12;

    // 4. Social Energy Complementarity (10% Weight)
    const energyMatch = userAEnergy === userBEnergy;
    const communicationScore = energyMatch ? 10 : 7;

    const totalScore = Math.min(98, Math.max(42, interestScore + intentionScore + valueScore + communicationScore));

    let explanation = 'Compatible intention match with shared connection goals.';
    if (sharedInterests.length >= 2) {
      explanation = `Strong overlap in ${sharedInterests.slice(0, 2).join(' & ')} with aligned intentions.`;
    } else if (sharedIntentions.length > 0) {
      explanation = `Mutual priority on ${sharedIntentions[0]} with complementary communication pace.`;
    }

    const breakdownBullets = [
      `${sharedInterests.length} shared passion${sharedInterests.length === 1 ? '' : 's'} (${interestScore}/40 pts)`,
      `${sharedIntentions.length} confirmed shared intention${sharedIntentions.length === 1 ? '' : 's'} (${intentionScore}/30 pts)`,
      `Style alignment: ${userAStyle === userBStyle ? 'Harmonious match' : 'Complementary'} (${valueScore}/20 pts)`,
      `Social energy balance (${communicationScore}/10 pts)`,
    ];

    return {
      totalScore,
      interestScore,
      intentionScore,
      valueScore,
      communicationScore,
      sharedInterests,
      sharedIntentions,
      sharedValues: ['Authenticity', 'Curiosity', 'Kindness'],
      paceMatch: true,
      styleMatch,
      energyMatch,
      explanation,
      breakdownBullets,
    };
  },
};
