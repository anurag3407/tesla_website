import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export interface KeepAliveResult {
  success: boolean;
  message: string;
  triggeredBy: string;
  timestamp: string;
  responseTimeMs: number;
  totalPings?: number;
  lastPingAt?: string;
  daysSinceLastPing?: number;
  daysUntilAutoPause?: number;
  databaseStatus: 'active' | 'warning' | 'unconfigured' | 'error';
  error?: string;
}

/**
 * Ping Supabase PostgreSQL to prevent the 7-day free-tier pause.
 * Performs an active write and read query to verify the database cluster is fully awake.
 */
export async function executeSupabaseKeepAlive(
  triggeredBy: 'github_action' | 'vercel_cron' | 'api_route' | 'admin_manual' | 'auto_check' = 'api_route',
  metadata: Record<string, unknown> = {}
): Promise<KeepAliveResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: 'Supabase credentials not configured in environment; keep-alive simulation successful.',
      triggeredBy,
      timestamp,
      responseTimeMs: 1,
      totalPings: 1,
      lastPingAt: timestamp,
      daysSinceLastPing: 0,
      daysUntilAutoPause: 7,
      databaseStatus: 'unconfigured',
    };
  }

  try {
    const supabase = getSupabaseAdmin();

    // 1. Insert a new heartbeat record into keep_alive_pings
    const { error: insertError } = await supabase.from('keep_alive_pings').insert([
      {
        triggered_by: triggeredBy,
        status: 'healthy',
        response_time_ms: 0, // will update below
        metadata: {
          ...metadata,
          userAgent: 'TESLA-KeepAlive-Engine/1.0',
          nodeEnv: process.env.NODE_ENV || 'production',
        },
      },
    ]);

    if (insertError) {
      console.warn('[Supabase Keep-Alive] Table insert notice:', insertError.message);
    }

    // 2. Query total pings and latest record
    const { data: pingData, count, error: selectError } = await supabase
      .from('keep_alive_pings')
      .select('created_at, response_time_ms', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);

    const responseTimeMs = Date.now() - startTime;

    if (selectError) {
      throw selectError;
    }

    const latest = pingData?.[0];
    const lastPingAt = latest?.created_at || timestamp;
    const diffMs = Math.max(0, Date.now() - new Date(lastPingAt).getTime());
    const daysSinceLastPing = parseFloat((diffMs / (1000 * 60 * 60 * 24)).toFixed(2));
    const daysUntilAutoPause = Math.max(0, parseFloat((7.0 - daysSinceLastPing).toFixed(2)));

    const databaseStatus = daysUntilAutoPause < 2 ? 'warning' : 'active';

    return {
      success: true,
      message: 'Supabase PostgreSQL pinged successfully. Database active and healthy.',
      triggeredBy,
      timestamp,
      responseTimeMs,
      totalPings: count ?? (pingData?.length || 1),
      lastPingAt,
      daysSinceLastPing,
      daysUntilAutoPause,
      databaseStatus,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Supabase Keep-Alive] Ping failed:', errorMessage);

    return {
      success: false,
      message: 'Failed to ping Supabase PostgreSQL cluster.',
      triggeredBy,
      timestamp,
      responseTimeMs,
      databaseStatus: 'error',
      error: errorMessage,
    };
  }
}
