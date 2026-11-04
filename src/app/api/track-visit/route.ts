import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Visit } from '@/models/Visit';
import { supabaseDb } from '@/lib/supabase/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = body?.path || '/';

    // 1. Log to Supabase
    await supabaseDb.visits.track(path).catch((err) => {
      console.warn('Supabase visit track notice:', err);
    });

    // 2. Also log to MongoDB for dual-sync continuity
    try {
      await connectDB();
      await Visit.create({ path });
    } catch {
      // Non-fatal if Mongo is offline
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track visit error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
