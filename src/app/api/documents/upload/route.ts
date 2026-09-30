import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { extractTextFromPdf } from '@/lib/pdf/extractor';
import { chunkText } from '@/lib/vector/search';
import { getAIProvider } from '@/lib/ai/provider';
import { Document, DocumentPage, DocumentChunk, Quiz } from '@/lib/database/schema';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subjectName = (formData.get('subject') as string) || 'General Engineering';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file format. Only PDF files are supported.' }, { status: 400 });
    }

    const maxSize = 25 * 1024 * 1024; // 25 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 25MB.' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Text extraction
    const extracted = await extractTextFromPdf(buffer);
    if (!extracted.text || extracted.text.trim().length === 0) {
      return NextResponse.json({
        error: 'Unable to extract text from document. Scanned documents without OCR text layers require preprocessing.',
      }, { status: 422 });
    }

    const docId = 'doc-' + Date.now();
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const newDoc: Document = {
      id: docId,
      userId: 'user-ashutosh',
      subjectId: 'subj-1',
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      fileName: file.name,
      fileSize: file.size,
      pageCount: extracted.pageCount,
      status: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Pages
    const pages: DocumentPage[] = extracted.pages.map((p) => ({
      id: `p-${docId}-${p.pageNumber}`,
      documentId: docId,
      pageNumber: p.pageNumber,
      text: p.text,
      hasImages: false,
    }));

    // 3. Chunks
    const chunks: DocumentChunk[] = [];
    let chunkCount = 0;
    for (const page of pages) {
      const pageChunks = chunkText(page.text, page.pageNumber, docId, chunkCount);
      chunks.push(...pageChunks);
      chunkCount += pageChunks.length;
    }

    // 4. AI Analysis
    const ai = getAIProvider();
    const [summary, topics, flashcards] = await Promise.all([
      ai.generateSummary(docId, extracted.text, pages),
      ai.generateTopics(docId, extracted.text),
      ai.generateFlashcards(docId, extracted.text),
    ]);

    const quizId = `quiz-${docId}`;
    const quizQuestions = await ai.generateQuiz(quizId, extracted.text, 5);
    const quiz: Quiz = {
      id: quizId,
      documentId: docId,
      title: `${newDoc.title} Diagnostic Quiz`,
      totalQuestions: quizQuestions.length,
      difficulty: 'medium',
      createdAt: new Date().toISOString(),
    };

    // 5. Save to database
    db.createDocument(newDoc, pages, chunks, summary, topics, flashcards, quiz, quizQuestions);

    return NextResponse.json({
      success: true,
      document: newDoc,
      stats: {
        pageCount: extracted.pageCount,
        chunksCount: chunks.length,
        topicsCount: topics.length,
        flashcardsCount: flashcards.length,
        quizQuestionsCount: quizQuestions.length,
      },
    });
  } catch (err: any) {
    console.error('Document upload error:', err);
    return NextResponse.json({
      error: err.message || 'An unexpected error occurred during PDF processing.',
    }, { status: 500 });
  }
}
