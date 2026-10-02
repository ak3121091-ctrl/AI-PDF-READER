import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { getAIProvider } from '@/lib/ai/provider';
import { Document, DocumentPage, DocumentChunk, Quiz } from '@/lib/database/schema';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { step = 'all', textSnippet, title } = body as {
      step?: 'summary-topics' | 'cards-quiz' | 'all';
      textSnippet?: string;
      title?: string;
    };

    let doc = db.getDocument(id);
    let fullText = '';
    let pages = db.getPages(id);

    // If doc not found in container memory (e.g. multi-instance serverless routing)
    if (!doc) {
      if (!textSnippet || textSnippet.trim().length === 0) {
        return NextResponse.json({ error: 'Document not found or session expired.' }, { status: 404 });
      }

      const cleanTitle = (title || 'Study Document').trim();
      doc = {
        id,
        userId: 'user-ashutosh',
        subjectId: 'subj-1',
        title: cleanTitle,
        fileName: `${id}.pdf`,
        fileSize: 1024,
        pageCount: 1,
        status: 'processing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const syntheticPages: DocumentPage[] = [
        {
          id: `p-${id}-1`,
          documentId: id,
          pageNumber: 1,
          text: textSnippet,
          hasImages: false,
        },
      ];

      const syntheticChunks: DocumentChunk[] = [
        {
          id: `c-${id}-1`,
          documentId: id,
          pageNumber: 1,
          chunkIndex: 0,
          text: textSnippet,
          keywords: [],
        },
      ];

      db.saveDocumentInitial(doc, syntheticPages, syntheticChunks);
      fullText = textSnippet;
      pages = syntheticPages;
    } else {
      fullText = pages.map((p) => p.text).join('\n\n').trim();
      if (!fullText && textSnippet) {
        fullText = textSnippet;
      }
    }

    if (!fullText) {
      return NextResponse.json({ error: 'Document has no text content to analyze.' }, { status: 422 });
    }

    const ai = getAIProvider();

    if (step === 'summary-topics') {
      const [summary, topics] = await Promise.all([
        ai.generateSummary(id, fullText, pages),
        ai.generateTopics(id, fullText),
      ]);

      db.setSummary(id, summary);
      db.setTopics(id, topics);

      return NextResponse.json({
        success: true,
        step: 'summary-topics',
        documentId: id,
        topicsCount: topics.length,
      });
    }

    if (step === 'cards-quiz') {
      const quizId = `quiz-${id}`;
      const [flashcards, quizQuestions] = await Promise.all([
        ai.generateFlashcards(id, fullText),
        ai.generateQuiz(quizId, fullText, 5),
      ]);

      const quiz: Quiz = {
        id: quizId,
        documentId: id,
        title: `${doc.title} Diagnostic Quiz`,
        totalQuestions: quizQuestions.length,
        difficulty: 'medium',
        createdAt: new Date().toISOString(),
      };

      db.setFlashcards(id, flashcards);
      db.setQuiz(id, quiz, quizQuestions);
      db.updateDocumentStatus(id, 'ready');

      return NextResponse.json({
        success: true,
        step: 'cards-quiz',
        documentId: id,
        flashcardsCount: flashcards.length,
        quizQuestionsCount: quizQuestions.length,
      });
    }

    // Default 'all'
    const quizId = `quiz-${id}`;
    const [summary, topics, flashcards] = await Promise.all([
      ai.generateSummary(id, fullText, pages),
      ai.generateTopics(id, fullText),
      ai.generateFlashcards(id, fullText),
    ]);

    const quizQuestions = await ai.generateQuiz(quizId, fullText, 5);
    const quiz: Quiz = {
      id: quizId,
      documentId: id,
      title: `${doc.title} Diagnostic Quiz`,
      totalQuestions: quizQuestions.length,
      difficulty: 'medium',
      createdAt: new Date().toISOString(),
    };

    db.setSummary(id, summary);
    db.setTopics(id, topics);
    db.setFlashcards(id, flashcards);
    db.setQuiz(id, quiz, quizQuestions);
    db.updateDocumentStatus(id, 'ready');

    return NextResponse.json({
      success: true,
      step: 'all',
      documentId: id,
      document: doc,
      stats: {
        topicsCount: topics.length,
        flashcardsCount: flashcards.length,
        quizQuestionsCount: quizQuestions.length,
      },
    });
  } catch (err: any) {
    console.error('AI generation error:', err?.message || err);
    return NextResponse.json({
      error: err.message || 'An unexpected error occurred during AI study generation.',
    }, { status: 500 });
  }
}
