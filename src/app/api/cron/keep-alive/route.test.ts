import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { keepAliveMock } = vi.hoisted(() => {
  return {
    keepAliveMock: {
      executeSupabaseKeepAlive: vi.fn(),
    },
  };
});

vi.mock('@/lib/supabase/keep-alive', () => ({
  executeSupabaseKeepAlive: keepAliveMock.executeSupabaseKeepAlive,
}));

import { GET, POST } from './route';

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  vi.resetAllMocks();
  process.env = { ...ORIGINAL_ENV };
  keepAliveMock.executeSupabaseKeepAlive.mockResolvedValue({
    success: true,
    triggeredBy: 'api_route',
    databaseStatus: 'active',
    responseTimeMs: 42,
    daysUntilAutoPause: 6.0,
    timestamp: new Date().toISOString(),
  });
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe('/api/cron/keep-alive route', () => {
  it('allows open execution in non-production mode without CRON_SECRET', async () => {
    delete process.env.CRON_SECRET;
    (process.env as any).NODE_ENV = 'test';

    const req = new NextRequest('http://localhost/api/cron/keep-alive');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(keepAliveMock.executeSupabaseKeepAlive).toHaveBeenCalledWith('api_route', expect.any(Object));
  });

  it('rejects unauthorized requests in production when secret is set and header is missing', async () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.CRON_SECRET = 'ultra-secret-key-123';

    const req = new NextRequest('http://localhost/api/cron/keep-alive');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toMatch(/Unauthorized cron request/i);
    expect(keepAliveMock.executeSupabaseKeepAlive).not.toHaveBeenCalled();
  });

  it('authorizes production requests with matching Bearer token in headers', async () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.CRON_SECRET = 'ultra-secret-key-123';

    const req = new NextRequest('http://localhost/api/cron/keep-alive?source=vercel_cron', {
      headers: {
        authorization: 'Bearer ultra-secret-key-123',
      },
    });

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(keepAliveMock.executeSupabaseKeepAlive).toHaveBeenCalledWith('vercel_cron', expect.any(Object));
  });

  it('authorizes production requests with matching ?key query parameter', async () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.CRON_SECRET = 'ultra-secret-key-123';

    const req = new NextRequest('http://localhost/api/cron/keep-alive?source=github_action&key=ultra-secret-key-123');

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(keepAliveMock.executeSupabaseKeepAlive).toHaveBeenCalledWith('github_action', expect.any(Object));
  });

  it('returns status 500 when keep-alive execution reports an error', async () => {
    delete process.env.CRON_SECRET;
    (process.env as any).NODE_ENV = 'test';

    keepAliveMock.executeSupabaseKeepAlive.mockResolvedValue({
      success: false,
      triggeredBy: 'api_route',
      databaseStatus: 'warning',
      message: 'Failed to ping Supabase REST endpoint',
      responseTimeMs: 500,
      daysUntilAutoPause: 1.0,
      timestamp: new Date().toISOString(),
    });

    const req = new NextRequest('http://localhost/api/cron/keep-alive');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toMatch(/Failed to ping/);
  });

  it('POST method forwards directly to the GET handler', async () => {
    delete process.env.CRON_SECRET;
    (process.env as any).NODE_ENV = 'test';

    const req = new NextRequest('http://localhost/api/cron/keep-alive', { method: 'POST' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
