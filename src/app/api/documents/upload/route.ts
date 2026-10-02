import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { extractTextFromPdf } from '@/lib/pdf/extractor';
import { chunkText } from '@/lib/vector/search';
import { getAIProvider } from '@/lib/ai/provider';
import { Document, DocumentPage, DocumentChunk, Quiz } from '@/lib/database/schema';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subjectName = (formData.get('subject') as string) || 'General Engineering';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Support mobile Chrome where MIME type may be application/octet-stream or empty, but ends in .pdf
    const isPdf =
      (file.name && file.name.toLowerCase().endsWith('.pdf')) ||
      file.type === 'application/pdf';

    if (!isPdf) {
      return NextResponse.json({ error: 'Invalid file format. Only PDF files are supported.' }, { status: 400 });
    }

    const SERVER_MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB backend limit
    if (file.size > SERVER_MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds server upload limit (max 25 MB).' }, { status: 413 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Text extraction with explicit error handling
    let extracted;
    try {
      extracted = await extractTextFromPdf(buffer);
    } catch (pdfErr: any) {
      console.error('PDF extraction failed:', pdfErr?.message || pdfErr);
      return NextResponse.json({
        error: pdfErr?.message || 'Unable to extract text from document. Please verify the PDF is valid and contains text.',
      }, { status: 422 });
    }

    if (!extracted.text || extracted.text.trim().length === 0) {
      return NextResponse.json({
        error: 'Unable to extract text from document. Scanned documents without OCR text layers require preprocessing.',
      }, { status: 422 });
    }

    const docId = 'doc-' + Date.now();
    const cleanTitle = (file.name || 'Document')
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    const newDoc: Document = {
      id: docId,
      userId: 'user-ashutosh',
      subjectId: 'subj-1',
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      fileName: file.name,
      fileSize: file.size,
      pageCount: extracted.pageCount,
      status: 'processing',
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

    // 3. Chunks for vector indexing
    const chunks: DocumentChunk[] = [];
    let chunkCount = 0;
    for (const page of pages) {
      const pageChunks = chunkText(page.text, page.pageNumber, docId, chunkCount);
      chunks.push(...pageChunks);
      chunkCount += pageChunks.length;
    }

    // 4. Save PDF file buffer to persistent storage and save initial document
    const storagePath = db.savePdfFile(docId, buffer);
    newDoc.storagePath = storagePath;
    db.saveDocumentInitial(newDoc, pages, chunks);

    // Check if client requested legacy synchronous immediate generation
    const immediate = req.nextUrl.searchParams.get('immediate') === 'true';

    if (immediate) {
      try {
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

        db.setSummary(docId, summary);
        db.setTopics(docId, topics);
        db.setFlashcards(docId, flashcards);
        db.setQuiz(docId, quiz, quizQuestions);
        db.updateDocumentStatus(docId, 'ready');
        newDoc.status = 'ready';

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
      } catch (genErr: any) {
        console.error('Synchronous generation error:', genErr?.message || genErr);
        db.updateDocumentStatus(docId, 'ready');
      }
    }

    // Default: Fast, reliable staged response
    return NextResponse.json({
      success: true,
      stage: 'extracted',
      document: newDoc,
      stats: {
        pageCount: extracted.pageCount,
        chunksCount: chunks.length,
      },
      textSnippet: extracted.text.slice(0, 18000),
    });
  } catch (err: any) {
    console.error('Document upload error:', err?.message || err);
    return NextResponse.json({
      error: err.message || 'An unexpected error occurred during PDF processing.',
    }, { status: 500 });
  }
}
