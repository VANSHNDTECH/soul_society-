import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' &&
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
