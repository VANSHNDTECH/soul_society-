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
  isDemoSession?: boolean;
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

/**
 * Checks if a profile has satisfied all mandatory fields required
 * to enter the platform (name, intentions, bio, communication style, and pace).
 */
export function isProfileComplete(profile: DbProfile | null | undefined): boolean {
  if (!profile) return false;
  const hasName = typeof profile.display_name === 'string' && profile.display_name.trim().length > 0;
  const hasIntentions = Array.isArray(profile.intentions) && profile.intentions.length > 0;
  const hasStyle = typeof profile.communication_style === 'string' && profile.communication_style.trim().length > 0;
  const hasPace = typeof profile.pace_preference === 'string' && profile.pace_preference.trim().length > 0;
  const hasBio = typeof profile.bio === 'string' && profile.bio.trim().length > 0;
  return hasName && hasIntentions && hasStyle && hasPace && hasBio;
}

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
              isDemoSession: Boolean(parsed.isDemoSession),
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
      isDemoSession: false,
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
            isDemoSession: false,
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
          isDemoSession: false,
        };
      } catch (err) {
        console.error('Error fetching Supabase auth session:', err);
      }
    }

    // 2. Local Session (Persistent across refresh only if user explicitly signed in)
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
              isDemoSession: Boolean(parsed.isDemoSession),
            };
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    if (inMemorySession) {
      return inMemorySession;
    }

    // 3. Unauthenticated Visitor (No active session)
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      isBackendConnected: this.isConfigured(),
      isDemoSession: false,
    };
  },

  async getCurrentProfile(userId: string): Promise<DbProfile | null> {
    if (this.isConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          // If no row found (e.g. PGRST116), return null gracefully
          return null;
        }
        return data as DbProfile;
      } catch (err) {
        console.error('Error loading user profile:', err);
        return null;
      }
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

    if (inMemorySession?.profile?.id === userId) {
      return inMemorySession.profile;
    }

    return null;
  },

  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<{
    user: any;
    profile: DbProfile | null;
    requiresEmailVerification: boolean;
    error: string | null;
  }> {
    if (!email || !email.includes('@')) {
      return { user: null, profile: null, requiresEmailVerification: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { user: null, profile: null, requiresEmailVerification: false, error: 'Password must be at least 6 characters.' };
    }
    if (!displayName || displayName.trim().length === 0) {
      return { user: null, profile: null, requiresEmailVerification: false, error: 'Please enter a display name.' };
    }

    if (this.isConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName.trim(),
            },
          },
        });

        if (error) {
          return { user: null, profile: null, requiresEmailVerification: false, error: error.message };
        }

        if (data.user) {
          // If email confirmation is enabled, Supabase returns a user but session is null
          const requiresEmailVerification = !data.session;

          let profile: DbProfile | null = null;
          if (!requiresEmailVerification) {
            profile = await this.getCurrentProfile(data.user.id);
            if (!profile) {
              // Create initial baseline row with incomplete fields so user proceeds to /profile-setup
              const newProfile: Partial<DbProfile> = {
                id: data.user.id,
                display_name: displayName.trim(),
                role: 'user',
                intentions: [],
                discovery_enabled: true,
                profile_visibility: 'standard',
              };
              const { data: createdProfile } = await supabase
                .from('profiles')
                .upsert(newProfile)
                .select()
                .single();

              if (createdProfile) {
                profile = createdProfile as DbProfile;
              }
            }

            const session: AuthSession = {
              user: data.user,
              profile,
              isAuthenticated: true,
              isBackendConnected: true,
              isDemoSession: false,
            };
            notifyAuthListeners(session);
          }

          return {
            user: data.user,
            profile,
            requiresEmailVerification,
            error: null,
          };
        }
      } catch (err: any) {
        return { user: null, profile: null, requiresEmailVerification: false, error: err.message || 'Error during sign up.' };
      }
    }

    // Local registration fallback (when Supabase is unconfigured)
    const newId = `usr-${Date.now().toString(36)}`;
    // New account starts with incomplete profile so profile-completion flow is required
    const newProfile: DbProfile = {
      id: newId,
      display_name: displayName.trim(),
      role: 'user',
      intentions: [], // Empty intentions: triggers profile completion gate!
      discovery_enabled: true,
      profile_visibility: 'standard',
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const sessionData = {
      user: { id: newId, email },
      profile: newProfile,
      isDemoSession: false,
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
      isDemoSession: false,
    };
    inMemorySession = session;
    notifyAuthListeners(session);
    return { user: sessionData.user, profile: newProfile, requiresEmailVerification: false, error: null };
  },

  async signIn(email: string, password: string): Promise<{
    user: any;
    profile: DbProfile | null;
    error: string | null;
  }> {
    if (!email || !password) {
      return { user: null, profile: null, error: 'Please enter both email and password.' };
    }

    if (this.isConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
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
            isDemoSession: false,
          };
          notifyAuthListeners(session);
          return { user: data.user, profile, error: null };
        }
      } catch (err: any) {
        return { user: null, profile: null, error: err.message || 'Failed to sign in.' };
      }
    }

    // Local Demonstration authentication (when Supabase is unconfigured)
    // Validate whether credentials match known evaluation personas
    const normalizedEmail = email.trim().toLowerCase();
    const isMaya = normalizedEmail.includes('maya');
    const isRohan = normalizedEmail.includes('rohan');
    const isEditor = normalizedEmail.includes('editor');

    if (!isMaya && !isRohan && !isEditor) {
      return {
        user: null,
        profile: null,
        error: 'Invalid credentials. Note: Cloud database is not configured. For evaluation, use "Evaluation & Demo Access" below or configure .env.local.',
      };
    }

    const demoKey = isRohan ? 'rohan' : 'maya';
    const baseProfile = DEMO_PROFILES[demoKey] || DEMO_PROFILES.maya;

    const demoUser = { id: baseProfile.id, email: normalizedEmail };
    const demoProfile: DbProfile = {
      ...baseProfile,
      role: isEditor ? 'editor' : baseProfile.role,
    };

    const sessionData = {
      user: demoUser,
      profile: demoProfile,
      isDemoSession: true,
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(sessionData));
      }
    } catch {}

    const session: AuthSession = {
      user: demoUser,
      profile: demoProfile,
      isAuthenticated: true,
      isBackendConnected: false,
      isDemoSession: true,
    };
    inMemorySession = session;
    notifyAuthListeners(session);
    return { user: demoUser, profile: demoProfile, error: null };
  },

  async resetPassword(email: string): Promise<{ error: string | null; message: string }> {
    const trimmed = email ? email.trim() : '';
    if (!trimmed || !trimmed.includes('@')) {
      return { error: 'Please enter a valid email address.', message: '' };
    }

    if (this.isConfigured() && supabase) {
      try {
        const redirectUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined;

        const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
          redirectTo: redirectUrl,
        });

        if (error) {
          return { error: error.message, message: '' };
        }

        return {
          error: null,
          message: 'Password reset instructions have been sent to your email address.',
        };
      } catch (err: any) {
        return { error: err.message || 'Failed to send password reset request.', message: '' };
      }
    }

    // Demonstration feedback
    return {
      error: null,
      message: `[Demonstration Mode] Password reset simulated for ${trimmed}. In production with Supabase configured, a recovery email is sent.`,
    };
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (!newPassword || newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    if (this.isConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { error: error.message };
        return { error: null };
      } catch (err: any) {
        return { error: err.message || 'Failed to update password.' };
      }
    }

    return { error: null };
  },

  async saveCompletedProfile(
    userId: string,
    updates: Partial<DbProfile> & { display_name: string; intentions: string[] }
  ): Promise<{ profile: DbProfile | null; error: string | null }> {
    if (!userId) {
      return { profile: null, error: 'User ID is required to save profile.' };
    }
    if (!updates.display_name?.trim()) {
      return { profile: null, error: 'Display name is required.' };
    }
    if (!updates.intentions || updates.intentions.length === 0) {
      return { profile: null, error: 'At least one intention must be selected.' };
    }

    if (this.isConfigured() && supabase) {
      try {
        const payload = {
          id: userId,
          display_name: updates.display_name.trim(),
          age: updates.age || null,
          bio: updates.bio || '',
          avatar_url: updates.avatar_url || null,
          role: updates.role || 'user',
          intentions: updates.intentions,
          communication_style: updates.communication_style || null,
          social_energy: updates.social_energy || null,
          pace_preference: updates.pace_preference || null,
          accessibility_preferences: updates.accessibility_preferences || null,
          discovery_enabled: updates.discovery_enabled ?? true,
          profile_visibility: updates.profile_visibility || 'standard',
          location: updates.location || null,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('profiles')
          .upsert(payload)
          .select()
          .single();

        if (error) {
          return { profile: null, error: error.message };
        }

        const savedProfile = data as DbProfile;
        // Update active session with the newly completed profile
        const currentSession = await this.getSession();
        const updatedSession: AuthSession = {
          ...currentSession,
          profile: savedProfile,
          isAuthenticated: true,
          isBackendConnected: true,
        };
        notifyAuthListeners(updatedSession);
        return { profile: savedProfile, error: null };
      } catch (err: any) {
        return { profile: null, error: err.message || 'Failed to save completed profile.' };
      }
    }

    // Local demonstration saving
    const existing = inMemorySession?.profile || DEMO_PROFILES.maya;
    const merged: DbProfile = {
      ...existing,
      id: userId,
      display_name: updates.display_name.trim(),
      age: updates.age ?? existing.age,
      bio: updates.bio ?? existing.bio,
      avatar_url: updates.avatar_url ?? existing.avatar_url,
      intentions: updates.intentions,
      communication_style: updates.communication_style ?? existing.communication_style,
      social_energy: updates.social_energy ?? existing.social_energy,
      pace_preference: updates.pace_preference ?? existing.pace_preference,
      discovery_enabled: updates.discovery_enabled ?? existing.discovery_enabled,
      profile_visibility: updates.profile_visibility ?? existing.profile_visibility,
      location: updates.location ?? existing.location,
      updated_at: new Date().toISOString(),
    };

    const sessionData = {
      user: { id: userId, email: inMemorySession?.user?.email || 'user@university.edu' },
      profile: merged,
      isDemoSession: inMemorySession?.isDemoSession ?? true,
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(sessionData));
      }
    } catch {}

    const session: AuthSession = {
      user: sessionData.user,
      profile: merged,
      isAuthenticated: true,
      isBackendConnected: false,
      isDemoSession: sessionData.isDemoSession,
    };
    inMemorySession = session;
    notifyAuthListeners(session);
    return { profile: merged, error: null };
  },

  async signInAsDemo(archetypeOrId: 'maya' | 'rohan' | string = 'maya'): Promise<AuthSession> {
    const key = archetypeOrId.toLowerCase().includes('rohan') ? 'rohan' : 'maya';
    const profile = DEMO_PROFILES[key] || DEMO_PROFILES.maya;
    const sessionData = {
      user: { id: profile.id, email: `${key}@university.edu` },
      profile,
      isDemoSession: true,
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
      isDemoSession: true,
    };
    inMemorySession = session;
    notifyAuthListeners(session);
    return session;
  },

  async signOut(): Promise<void> {
    inMemorySession = null;
    if (this.isConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out warning:', e);
      }
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
        localStorage.removeItem('commonground_current_user_v3');
        localStorage.removeItem('commonground_introductions_v3');
        localStorage.removeItem('commonground_connections_v3');
        localStorage.removeItem('commonground_messages_v3');
      }
    } catch {}

    const unauthSession: AuthSession = {
      user: null,
      profile: null,
      isAuthenticated: false,
      isBackendConnected: this.isConfigured(),
      isDemoSession: false,
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
              isDemoSession: false,
            };
            callback(authSess);
          } else {
            const unauth: AuthSession = {
              user: null,
              profile: null,
              isAuthenticated: false,
              isBackendConnected: true,
              isDemoSession: false,
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
