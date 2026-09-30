import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topics = db.getTopics(id);
    return NextResponse.json({ topics });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
