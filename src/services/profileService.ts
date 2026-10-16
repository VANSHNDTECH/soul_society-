import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbProfile, DbInterest } from '../types/database';
import { DEMO_PROFILES } from './authService';

const localProfileStore = new Map<string, DbProfile>();

// Seed initial profiles
Object.values(DEMO_PROFILES).forEach(p => {
  localProfileStore.set(p.id, p);
});

export const profileService = {
  async getProfile(userId: string): Promise<DbProfile | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        return data as DbProfile;
      }
    }

    return localProfileStore.get(userId) || null;
  },

  async updateProfile(userId: string, updates: Partial<DbProfile>): Promise<{
    profile: DbProfile | null;
    error: string | null;
  }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          ...updates,
          id: userId,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }
      if (data) {
        localProfileStore.set(userId, data as DbProfile);
        return { profile: data as DbProfile, error: null };
      }
    }

    const existing = localProfileStore.get(userId) || {
      id: userId,
      display_name: updates.display_name || 'User',
      role: 'user',
      intentions: updates.intentions || ['Friendship'],
      discovery_enabled: updates.discovery_enabled ?? true,
      profile_visibility: updates.profile_visibility || 'standard',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as DbProfile;

    const merged: DbProfile = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localProfileStore.set(userId, merged);

    return {
      profile: merged,
      error: null,
    };
  },

  async getAllInterests(): Promise<DbInterest[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('interests')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching interests:', error);
      } else if (data && data.length > 0) {
        return data as DbInterest[];
      }
    }

    // Default taxonomy fallback
    return [
      { id: 'specialty-coffee', name: 'Specialty Coffee & Cafes', category: 'Lifestyle', icon: 'Coffee', created_at: '' },
      { id: 'analog-photography', name: 'Analog & Film Photography', category: 'Creative', icon: 'Camera', created_at: '' },
      { id: 'hiking-trails', name: 'Hiking & Trail Running', category: 'Outdoors', icon: 'Mountain', created_at: '' },
      { id: 'sci-fi-fiction', name: 'Sci-Fi & Speculative Fiction', category: 'Culture', icon: 'Book', created_at: '' },
      { id: 'indie-boardgames', name: 'Modern Indie Board Games', category: 'Gaming', icon: 'Dice', created_at: '' },
      { id: 'ceramics-pottery', name: 'Ceramics & Studio Pottery', category: 'Creative', icon: 'Sparkles', created_at: '' },
      { id: 'synth-music', name: 'Electronic & Ambient Music', category: 'Music', icon: 'Headphones', created_at: '' },
      { id: 'open-source', name: 'Open-Source & Ethical Tech', category: 'Technology', icon: 'Laptop', created_at: '' },
      { id: 'plant-care', name: 'Urban Gardening & Botanicals', category: 'Lifestyle', icon: 'Flower', created_at: '' },
      { id: 'bouldering', name: 'Bouldering & Climbing', category: 'Fitness', icon: 'Footprints', created_at: '' },
      { id: 'tea-culture', name: 'Artisanal Teas & Rituals', category: 'Lifestyle', icon: 'Cup', created_at: '' },
      { id: 'volunteering', name: 'Community & Mutual Aid', category: 'Social', icon: 'Heart', created_at: '' },
    ];
  },

  async getUserInterests(userId: string): Promise<string[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('user_interests')
        .select('interest_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user interests:', error);
        return [];
      }
      return data.map((d: any) => d.interest_id);
    }
    return ['specialty-coffee', 'analog-photography', 'hiking-trails'];
  },

  async setUserInterests(userId: string, interestIds: string[]): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      // Delete old interests
      await supabase.from('user_interests').delete().eq('user_id', userId);

      // Insert new ones
      if (interestIds.length > 0) {
        const rows = interestIds.map((interest_id) => ({
          user_id: userId,
          interest_id,
        }));
        const { error } = await supabase.from('user_interests').insert(rows);
        if (error) {
          console.error('Error inserting user interests:', error);
          return false;
        }
      }
      return true;
    }
    return true;
  },
};
