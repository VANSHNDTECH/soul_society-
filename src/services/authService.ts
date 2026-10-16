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

let inMemorySession: AuthSession | null = null;

export const DEMO_PROFILES: Record<string, DbProfile> = {
  maya: {
    id: 'usr-maya-001',
    display_name: 'Maya Lin',
    age: 20,
    bio: 'Design student & analog photography enthusiast. Looking for peers to explore cozy coffee spots and talk indie games.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'editor',
    intentions: ['Friendship', 'Activity Partners'],
    communication_style: 'Deep & reflective',
    social_energy: 'Ambivert / Adaptable',
    pace_preference: 'Gradual & thoughtful',
    accessibility_preferences: 'Prefers quiet, low-sensory meeting spots with comfortable seating.',
    discovery_enabled: true,
    profile_visibility: 'standard',
    location: 'University Campus & Downtown',
    created_at: new Date('2026-01-15').toISOString(),
    updated_at: new Date().toISOString(),
  },
  rohan: {
    id: 'usr-rohan-002',
    display_name: 'Rohan Sharma',
    age: 21,
    bio: 'Engineering student interested in board games, sci-fi novels, and low-pressure conversation.',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    role: 'user',
    intentions: ['Friendship'],
    communication_style: 'Activity-focused',
    social_energy: 'Introverted / Calm',
    pace_preference: 'Gradual & thoughtful',
    accessibility_preferences: 'Prefers structured activities with clear start and end times.',
    discovery_enabled: true,
    profile_visibility: 'standard',
    location: 'Campus West Library',
    created_at: new Date('2026-01-20').toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const authListeners = new Set<(session: AuthSession) => void>();

function notifyAuthListeners(session: AuthSession) {
  authListeners.forEach(listener => {
    try {
      listener(session);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  getCachedSession(): AuthSession {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.user && parsed.profile) {
            return {
              user: parsed.user,
              profile: parsed.profile,
              isAuthenticated: true,
              isBackendConnected: this.isConfigured(),
            };
          }
        }
      }
    } catch {}

    if (inMemorySession) {
      return inMemorySession;
    }

    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      isBackendConnected: this.isConfigured(),
    };
  },

  async getSession(): Promise<AuthSession> {
    // 1. Live Supabase Authentication Session Check
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

    // 2. Local Session (Persistent across refresh)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.user && parsed.profile) {
            return {
              user: parsed.user,
              profile: parsed.profile,
              isAuthenticated: true,
              isBackendConnected: false,
            };
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    // 3. Unauthenticated Visitor (No active session)
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      isBackendConnected: this.isConfigured(),
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

    // Local check
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.profile?.id === userId) {
            return parsed.profile;
          }
        }
      }
    } catch {}

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
        let profile = await this.getCurrentProfile(data.user.id);
        if (!profile) {
          const newProfile = {
            id: data.user.id,
            display_name: displayName,
            role: 'user',
            intentions: ['Friendship'],
            discovery_enabled: true,
            profile_visibility: 'standard',
          };
          const { data: createdProfile, error: profileErr } = await supabase
            .from('profiles')
            .upsert(newProfile)
            .select()
            .single();

          if (!profileErr && createdProfile) {
            profile = createdProfile as DbProfile;
          }
        }

        const session: AuthSession = {
          user: data.user,
          profile,
          isAuthenticated: true,
          isBackendConnected: true,
        };
        notifyAuthListeners(session);
        return { user: data.user, profile, error: null };
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
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(sessionData));
      }
    } catch {}

    const session: AuthSession = {
      user: sessionData.user,
      profile: newProfile,
      isAuthenticated: true,
      isBackendConnected: false,
    };
    notifyAuthListeners(session);
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
        const session: AuthSession = {
          user: data.user,
          profile,
          isAuthenticated: true,
          isBackendConnected: true,
        };
        notifyAuthListeners(session);
        return { user: data.user, profile, error: null };
      }
    }

    // Local demonstration signin
    const demoKey = email.toLowerCase().includes('rohan') ? 'rohan' : 'maya';
    const baseProfile = DEMO_PROFILES[demoKey] || DEMO_PROFILES.maya;

    const demoUser = { id: baseProfile.id, email };
    const demoProfile: DbProfile = {
      ...baseProfile,
      display_name: baseProfile.display_name,
      role: email.includes('editor') ? 'editor' : baseProfile.role,
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(
          LOCAL_STORAGE_AUTH_KEY,
          JSON.stringify({ user: demoUser, profile: demoProfile })
        );
      }
    } catch {}

    const session: AuthSession = {
      user: demoUser,
      profile: demoProfile,
      isAuthenticated: true,
      isBackendConnected: false,
    };
    inMemorySession = session;
    notifyAuthListeners(session);
    return { user: demoUser, profile: demoProfile, error: null };
  },

  async signInAsDemo(archetypeOrId: 'maya' | 'rohan' | string = 'maya'): Promise<AuthSession> {
    const key = archetypeOrId.toLowerCase().includes('rohan') ? 'rohan' : 'maya';
    const profile = DEMO_PROFILES[key] || DEMO_PROFILES.maya;
    const sessionData = {
      user: { id: profile.id, email: `${key}@university.edu` },
      profile,
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(sessionData));
      }
    } catch {}

    const session: AuthSession = {
      user: sessionData.user,
      profile,
      isAuthenticated: true,
      isBackendConnected: false,
    };
    inMemorySession = session;
    notifyAuthListeners(session);
    return session;
  },

  async signOut(): Promise<void> {
    inMemorySession = null;
    if (this.isConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
      }
    } catch {}

    const unauthSession: AuthSession = {
      user: null,
      profile: null,
      isAuthenticated: false,
      isBackendConnected: this.isConfigured(),
    };
    notifyAuthListeners(unauthSession);
  },

  onAuthStateChange(callback: (session: AuthSession) => void) {
    authListeners.add(callback);

    let supabaseUnsub = () => {};
    if (this.isConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const profile = await this.getCurrentProfile(session.user.id);
            const authSess: AuthSession = {
              user: { id: session.user.id, email: session.user.email },
              profile,
              isAuthenticated: true,
              isBackendConnected: true,
            };
            callback(authSess);
          } else {
            const unauth: AuthSession = {
              user: null,
              profile: null,
              isAuthenticated: false,
              isBackendConnected: true,
            };
            callback(unauth);
          }
        }
      );
      supabaseUnsub = () => subscription.unsubscribe();
    }

    return () => {
      authListeners.delete(callback);
      supabaseUnsub();
    };
  },
};
