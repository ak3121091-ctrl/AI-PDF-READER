import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const flashcards = db.getFlashcards(id);
    return NextResponse.json({ flashcards });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const targetCardId = body.flashcardId || body.cardId;
    const rating = body.rating;

    if (!targetCardId || !rating) {
      return NextResponse.json({ error: 'flashcardId and rating are required' }, { status: 400 });
    }

    const updatedCard = db.updateFlashcardReview(id, targetCardId, rating);
    if (!updatedCard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, flashcard: updatedCard, card: updatedCard });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
