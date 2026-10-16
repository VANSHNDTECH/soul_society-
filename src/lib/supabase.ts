import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe fallback across browser (import.meta.env) and Node.js test runners
const globalObj = typeof globalThis !== 'undefined' ? (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }) : undefined;
const nodeEnv = globalObj?.process?.env;
const env = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env 
  : (nodeEnv || {}) as Record<string, string | undefined>;

const supabaseUrl = env?.VITE_SUPABASE_URL;
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Validates real database connectivity with a lightweight ping
 */
export const checkDatabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
  databaseName?: string;
}> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured in .env.local. Running in local demonstration mode.',
    };
  }

  try {
    const { error } = await supabase
      .from('interests')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return {
        connected: false,
        message: `Database connection error: ${error.message} (Code ${error.code})`,
      };
    }

    return {
      connected: true,
      message: 'Successfully connected to live Supabase PostgreSQL database.',
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to connect to database: ${err?.message || 'Unknown network error'}`,
    };
  }
};
