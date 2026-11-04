import { describe, it, expect } from 'vitest';
import { executeSupabaseKeepAlive } from './keep-alive';

describe('Supabase Keep-Alive Engine', () => {
  it('executes keep-alive ping and returns health telemetry', async () => {
    const result = await executeSupabaseKeepAlive('api_route', { test: true });

    expect(result.success).toBe(true);
    expect(result.triggeredBy).toBe('api_route');
    expect(typeof result.responseTimeMs).toBe('number');
    expect(typeof result.daysUntilAutoPause).toBe('number');
    expect(result.daysUntilAutoPause).toBeGreaterThanOrEqual(0);
    expect(['active', 'unconfigured', 'warning']).toContain(result.databaseStatus);
  });

  it('records trigger source correctly', async () => {
    const result = await executeSupabaseKeepAlive('github_action');
    expect(result.triggeredBy).toBe('github_action');
    expect(result.message).toBeDefined();
  });
});
