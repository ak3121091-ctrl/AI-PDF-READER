import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';

export async function GET(req: NextRequest) {
  try {
    const progress = db.getUserProgress('user-ashutosh');
    return NextResponse.json({ progress });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
