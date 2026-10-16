import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbProfile } from '../types/database';

export interface AuthSession {
  user: {
    id: string;
    email?: string;
  } | null;
  profile: DbProfile | null;
  isAuthenticated: boolean;
  isBackendConnected: boolean;
}

const LOCAL_STORAGE_AUTH_KEY = 'commonground_auth_session';

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async getSession(): Promise<AuthSession> {
    if (this.isConfigured() && supabase) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session?.user) {
          return {
            user: null,
            profile: null,
            isAuthenticated: false,
            isBackendConnected: true,
          };
        }

        const profile = await this.getCurrentProfile(session.user.id);
        return {
          user: {
            id: session.user.id,
            email: session.user.email,
          },
          profile,
          isAuthenticated: true,
          isBackendConnected: true,
        };
      } catch (err) {
        console.error('Error fetching Supabase auth session:', err);
      }
    }

    // Local demonstration session fallback when Supabase is not configured
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          user: parsed.user,
          profile: parsed.profile,
          isAuthenticated: Boolean(parsed.user),
          isBackendConnected: false,
        };
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    // Default demonstration user (Maya Lin - first-year student archetype)
    const defaultDemoProfile: DbProfile = {
      id: 'usr-maya-001',
      display_name: 'Maya Lin',
      age: 20,
      bio: 'Design student & analog photography enthusiast. Looking for peers to explore cozy coffee spots and talk indie games.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'editor', // Allows testing research and persona edits
      intentions: ['Friendship', 'Activity Partners'],
      communication_style: 'Deep & reflective',
      social_energy: 'Ambivert / Adaptable',
      pace_preference: 'Gradual & thoughtful',
      accessibility_preferences: 'Prefers quiet, low-sensory meeting spots with comfortable seating.',
      discovery_enabled: true,
      profile_visibility: 'standard',
      location: 'University Campus & Downtown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      user: { id: defaultDemoProfile.id, email: 'maya.lin@university.edu' },
      profile: defaultDemoProfile,
      isAuthenticated: true,
      isBackendConnected: false,
    };
  },

  async getCurrentProfile(userId: string): Promise<DbProfile | null> {
    if (this.isConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return null;
      }
      return data as DbProfile;
    }
    return null;
  },

  async signUp(email: string, password: string, displayName: string): Promise<{
    user: any;
    profile: DbProfile | null;
    error: string | null;
  }> {
    if (this.isConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        return { user: null, profile: null, error: error.message };
      }

      if (data.user) {
        // Create initial profile record
        const initialProfile: Partial<DbProfile> = {
          id: data.user.id,
          display_name: displayName,
          role: 'user',
          intentions: ['Friendship'],
          discovery_enabled: true,
          profile_visibility: 'standard',
          avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
        };

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert(initialProfile)
          .select()
          .single();

        if (profileError) {
          console.error('Error creating profile after signup:', profileError);
        }

        return { user: data.user, profile: profileData as DbProfile, error: null };
      }
    }

    // Local demonstration signup
    const newId = `usr-${Date.now().toString(36)}`;
    const newProfile: DbProfile = {
      id: newId,
      display_name: displayName,
      role: 'user',
      intentions: ['Friendship'],
      discovery_enabled: true,
      profile_visibility: 'standard',
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const sessionData = {
      user: { id: newId, email },
      profile: newProfile,
    };
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(sessionData));

    return { user: sessionData.user, profile: newProfile, error: null };
  },

  async signIn(email: string, password: string): Promise<{
    user: any;
    profile: DbProfile | null;
    error: string | null;
  }> {
    if (this.isConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, profile: null, error: error.message };
      }

      if (data.user) {
        const profile = await this.getCurrentProfile(data.user.id);
        return { user: data.user, profile, error: null };
      }
    }

    // Local demonstration signin
    const demoUser = { id: `usr-${email.split('@')[0]}`, email };
    const demoProfile: DbProfile = {
      id: demoUser.id,
      display_name: email.split('@')[0],
      role: email.includes('editor') ? 'editor' : 'user',
      intentions: ['Friendship'],
      discovery_enabled: true,
      profile_visibility: 'standard',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(
      LOCAL_STORAGE_AUTH_KEY,
      JSON.stringify({ user: demoUser, profile: demoProfile })
    );

    return { user: demoUser, profile: demoProfile, error: null };
  },

  async signOut(): Promise<void> {
    if (this.isConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  },

  onAuthStateChange(callback: (session: AuthSession) => void) {
    if (this.isConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const profile = await this.getCurrentProfile(session.user.id);
            callback({
              user: { id: session.user.id, email: session.user.email },
              profile,
              isAuthenticated: true,
              isBackendConnected: true,
            });
          } else {
            callback({
              user: null,
              profile: null,
              isAuthenticated: false,
              isBackendConnected: true,
            });
          }
        }
      );
      return () => subscription.unsubscribe();
    }

    return () => {};
  },
};
