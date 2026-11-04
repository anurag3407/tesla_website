import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

const isConfigured = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('placeholder-project') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('placeholder-anon-key')
);

let cachedClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

/**
 * Standard public Supabase client (Client-side & public server queries).
 * Uses anon key and adheres to Row Level Security (RLS).
 */
export function getSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  cachedClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return cachedClient;
}

/**
 * Privileged Supabase Admin client (Server-side ONLY).
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS for administrative operations,
 * automated cron jobs, and background keep-alive pings.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;

  cachedAdminClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseServiceRoleKey || supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return cachedAdminClient;
}

export const supabase = getSupabase();
export const supabaseAdmin = getSupabaseAdmin();
export const isSupabaseConfigured = isConfigured;
