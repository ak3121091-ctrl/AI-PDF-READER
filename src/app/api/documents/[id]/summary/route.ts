import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const summary = db.getSummary(id);
    if (!summary) {
      return NextResponse.json({ error: 'Summary not found' }, { status: 404 });
    }
    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
