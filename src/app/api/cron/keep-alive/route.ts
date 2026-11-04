import { NextRequest, NextResponse } from 'next/server';
import { executeSupabaseKeepAlive } from '@/lib/supabase/keep-alive';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || process.env.NODE_ENV !== 'production') {
    return true; // Allow open in local development or if no secret is configured
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${secret}`) {
    return true;
  }

  const queryKey = request.nextUrl.searchParams.get('key');
  if (queryKey && queryKey === secret) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized cron request. Provide Bearer CRON_SECRET.' },
      { status: 401 }
    );
  }

  const triggeredBy = request.nextUrl.searchParams.get('source') as
    | 'vercel_cron'
    | 'github_action'
    | 'api_route' || 'api_route';

  const result = await executeSupabaseKeepAlive(triggeredBy, {
    url: request.url,
    ip: request.headers.get('x-forwarded-for') || 'unknown',
  });

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
