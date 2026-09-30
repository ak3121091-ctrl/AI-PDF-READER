import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = db.getDocument(id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const pages = db.getPages(id);
    const topics = db.getTopics(id);
    const summary = db.getSummary(id);

    return NextResponse.json({
      document,
      pages,
      topics,
      summary,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
