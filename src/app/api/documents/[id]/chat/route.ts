import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { vectorSearch } from '@/lib/vector/search';
import { getAIProvider } from '@/lib/ai/provider';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const document = db.getDocument(id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const chunks = db.getChunks(id);
    // Perform vector/semantic search across chunks
    const searchResults = vectorSearch(question, chunks, 3);
    const relevantChunks = searchResults.length > 0
      ? searchResults.map((r) => r.chunk)
      : chunks.slice(0, 2);

    const ai = getAIProvider();
    const result = await ai.answerQuestion(question, relevantChunks, document.title);

    return NextResponse.json({
      answer: result.answer,
      sources: result.sources,
      citations: searchResults.map((r) => ({
        pageNumber: r.chunk.pageNumber,
        snippet: r.highlightSnippet,
        score: Math.round(r.score * 10) / 10,
      })),
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
