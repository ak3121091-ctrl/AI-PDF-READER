import { DocumentChunk } from '../database/schema';

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
  highlightSnippet: string;
}

export function chunkText(
  text: string,
  pageNumber: number,
  documentId: string,
  startChunkIndex: number
): DocumentChunk[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const chunks: DocumentChunk[] = [];
  let currentChunk = '';
  let chunkIdx = startChunkIndex;

  for (const para of paragraphs) {
    if ((currentChunk + ' ' + para).split(/\s+/).length > 250 && currentChunk.length > 0) {
      chunks.push({
        id: `chunk-${documentId}-p${pageNumber}-${chunkIdx}`,
        documentId,
        pageNumber,
        chunkIndex: chunkIdx++,
        text: currentChunk.trim(),
        keywords: extractKeywords(currentChunk),
      });
      currentChunk = para;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `chunk-${documentId}-p${pageNumber}-${chunkIdx}`,
      documentId,
      pageNumber,
      chunkIndex: chunkIdx++,
      text: currentChunk.trim(),
      keywords: extractKeywords(currentChunk),
    });
  }

  return chunks;
}

export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in',
    'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with',
    'this', 'these', 'those', 'then', 'than', 'into', 'which', 'or', 'so', 'can', 'if'
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
  return Array.from(new Set(words)).slice(0, 15);
}

export function vectorSearch(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 3
): SearchResult[] {
  if (!chunks.length) return [];

  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = chunks.map((chunk) => {
    let score = 0;
    const textLower = chunk.text.toLowerCase();

    for (const term of queryTerms) {
      if (textLower.includes(term)) {
        score += 3;
      }
      if (chunk.keywords.includes(term)) {
        score += 5;
      }
      // Exact word boundary match with escaped term
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
      const matches = chunk.text.match(regex);
      if (matches) {
        score += matches.length * 2;
      }
    }

    // Length normalization
    score = score / Math.sqrt(chunk.text.split(/\s+/).length + 1);

    return {
      chunk,
      score,
      highlightSnippet: createSnippet(chunk.text, queryTerms),
    };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function createSnippet(text: string, terms: string[]): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const sLower = s.toLowerCase();
    if (terms.some((t) => sLower.includes(t))) {
      return s.trim();
    }
  }
  return text.slice(0, 180) + '...';
}
