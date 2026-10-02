import { GoogleGenerativeAI } from '@google/generative-ai';
import { DocumentChunk, Summary, Topic, QuizQuestion, Flashcard } from '../database/schema';

export interface AIProvider {
  name: string;
  answerQuestion(
    query: string,
    contextChunks: DocumentChunk[],
    documentTitle: string
  ): Promise<{ answer: string; sources: number[] }>;
  generateSummary(documentId: string, fullText: string, pages: { pageNumber: number; text: string }[]): Promise<Summary>;
  generateTopics(documentId: string, fullText: string): Promise<Topic[]>;
  generateQuiz(quizId: string, fullText: string, count?: number): Promise<QuizQuestion[]>;
  generateFlashcards(documentId: string, fullText: string): Promise<Flashcard[]>;
}

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async answerQuestion(
    query: string,
    contextChunks: DocumentChunk[],
    documentTitle: string
  ): Promise<{ answer: string; sources: number[] }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const sources = Array.from(new Set(contextChunks.map((c) => c.pageNumber))).sort((a, b) => a - b);

    const contextText = contextChunks
      .map((c) => `[Page ${c.pageNumber}]:\n${c.text}`)
      .join('\n\n---\n\n');

    const prompt = `You are StudyForge AI, a premium academic learning assistant.
You are helping a university student understand their study document: "${documentTitle}".
Use the following extracted document excerpts as your primary ground truth knowledge:

${contextText}

STUDENT QUESTION: "${query}"

INSTRUCTIONS:
1. Provide a clear, academically rigorous, and pedagogical answer strictly based on the document content.
2. Directly reference relevant page numbers when citing facts or formulas (e.g., "According to Page 3...").
3. Use formatted markdown with bold highlights, bullet points, and clean mathematical notation where appropriate.
4. If the exact answer is partially outside the provided pages, clearly state what the document says and provide supplementary academic context.
5. End with a short "Exam Tip" or "Key Takeaway".`;

    try {
      const result = await model.generateContent(prompt);
      return {
        answer: result.response.text(),
        sources: sources.length > 0 ? sources : [1],
      };
    } catch (e) {
      console.warn('Gemini chat failed, using fallback engine:', e);
      const fallback = new AcademicIntelligenceProvider();
      return fallback.answerQuestion(query, contextChunks, documentTitle);
    }
  }

  async generateSummary(
    documentId: string,
    fullText: string,
    pages: { pageNumber: number; text: string }[]
  ): Promise<Summary> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze this academic document and output a structured JSON summary matching this schema:
{
  "quickSummary": "2-3 paragraph executive summary strictly based on the text",
  "detailedSummary": [
    { "chapter": "Chapter/Module name from document", "content": "Explanation", "keyPoints": ["point 1", "point 2"] }
  ],
  "keyConcepts": [
    { "title": "Concept name", "explanation": "Detailed explanation from document", "importance": "high"|"medium"|"low" }
  ],
  "formulas": [
    { "formula": "LaTeX or clean text formula found in document", "description": "Formula purpose", "variables": ["var 1", "var 2"] }
  ],
  "definitions": [
    { "term": "Term from document", "definition": "Academic definition from document" }
  ],
  "lastMinuteRevision": [
    "High-yield bullet point 1",
    "High-yield bullet point 2"
  ]
}

Document sample text:
${fullText.slice(0, 15000)}

Respond with ONLY valid JSON.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON object found in response');
      const parsed = JSON.parse(match[0]);

      return {
        id: `sum-${documentId}`,
        documentId,
        quickSummary: parsed.quickSummary || 'Comprehensive overview of key concepts.',
        detailedSummary: parsed.detailedSummary || [],
        keyConcepts: parsed.keyConcepts || [],
        formulas: parsed.formulas || [],
        definitions: parsed.definitions || [],
        lastMinuteRevision: parsed.lastMinuteRevision || [],
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Gemini summary parsing failed, using academic intelligence fallback:', e);
      const fallback = new AcademicIntelligenceProvider();
      return fallback.generateSummary(documentId, fullText, pages);
    }
  }

  async generateTopics(documentId: string, fullText: string): Promise<Topic[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze this academic document and identify 3 to 6 major topics, units, or modules covered in the text.
Output a JSON array matching this schema:
[
  {
    "name": "Topic Name from text",
    "documentImportance": 85,
    "examFrequency": 80,
    "weightagePercentage": 25,
    "examYears": [2024, 2025],
    "status": "studying",
    "keyNotes": "Concise high-yield summary of this topic from the text"
  }
]

Document sample text:
${fullText.slice(0, 15000)}

Respond with ONLY valid JSON.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array found');
      const parsed = JSON.parse(match[0]);
      return parsed.map((item: any, idx: number) => ({
        id: `top-${documentId}-${idx + 1}`,
        documentId,
        name: item.name || `Topic ${idx + 1}`,
        documentImportance: item.documentImportance || 80,
        examFrequency: item.examFrequency || 75,
        weightagePercentage: item.weightagePercentage || 25,
        examYears: item.examYears || [2024, 2025],
        status: item.status || (idx === 0 ? 'studying' : 'to_study'),
        keyNotes: item.keyNotes || 'Key concept from study material.',
      }));
    } catch (e) {
      console.warn('Gemini topics failed, using fallback:', e);
      const fallback = new AcademicIntelligenceProvider();
      return fallback.generateTopics(documentId, fullText);
    }
  }

  async generateQuiz(quizId: string, fullText: string, count = 5): Promise<QuizQuestion[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate ${count} academic quiz questions strictly derived from this document's text.
Output a JSON array matching this schema:
[
  {
    "question": "Question text based on a specific fact or concept in the document",
    "type": "mcq",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Clear explanation citing the document context",
    "sourcePage": 1,
    "topicName": "Topic name",
    "difficulty": "medium"
  }
]

Document sample text:
${fullText.slice(0, 15000)}

Respond with ONLY valid JSON.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array found');
      const parsed = JSON.parse(match[0]);
      return parsed.slice(0, count).map((item: any, idx: number) => ({
        id: `q-${quizId}-${idx + 1}`,
        quizId,
        question: item.question,
        type: item.type === 'true_false' ? 'true_false' : 'mcq',
        options: item.options || [],
        correctAnswer: item.correctAnswer,
        explanation: item.explanation || 'Verified from document context.',
        sourcePage: item.sourcePage || 1,
        topicName: item.topicName || 'Core Concept',
        difficulty: item.difficulty || 'medium',
      }));
    } catch (e) {
      console.warn('Gemini quiz generation failed, using fallback:', e);
      const fallback = new AcademicIntelligenceProvider();
      return fallback.generateQuiz(quizId, fullText, count);
    }
  }

  async generateFlashcards(documentId: string, fullText: string): Promise<Flashcard[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate 4 to 8 academic flashcards strictly based on core definitions, formulas, or theorems in this document text.
Output a JSON array matching this schema:
[
  {
    "front": "Prompt or Question (e.g. What is ...?)",
    "back": "Detailed answer explaining the concept according to the text",
    "category": "Subject category",
    "difficulty": "medium",
    "reviewStatus": "learning",
    "timesReviewed": 0
  }
]

Document sample text:
${fullText.slice(0, 15000)}

Respond with ONLY valid JSON.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array found');
      const parsed = JSON.parse(match[0]);
      return parsed.map((item: any, idx: number) => ({
        id: `fc-${documentId}-${idx + 1}`,
        documentId,
        front: item.front,
        back: item.back,
        category: item.category || 'General',
        difficulty: item.difficulty || 'medium',
        reviewStatus: 'learning' as const,
        timesReviewed: 0,
      }));
    } catch (e) {
      console.warn('Gemini flashcard generation failed, using fallback:', e);
      const fallback = new AcademicIntelligenceProvider();
      return fallback.generateFlashcards(documentId, fullText);
    }
  }
}

// -------------------------------------------------------------
// TEXT ANALYSIS HELPERS FOR ACADEMIC INTELLIGENCE ENGINE
// -------------------------------------------------------------

function extractSentences(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+(?=[A-Z0-9])|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 350 && !s.startsWith('http'));
}

function extractDefinitionsFromText(text: string): { term: string; definition: string }[] {
  const definitions: { term: string; definition: string }[] = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Pattern 1: "Term: Definition" or "Term — Definition"
  for (const line of lines) {
    const match = line.match(/^([A-Z][A-Za-z0-9\s\-]{2,35})\s*[:–—]\s*(.{20,})$/);
    if (match) {
      const term = match[1].trim();
      const def = match[2].trim();
      if (!definitions.some((d) => d.term.toLowerCase() === term.toLowerCase())) {
        definitions.push({ term, definition: def });
        if (definitions.length >= 8) break;
      }
    }
  }

  // Pattern 2: "Term is defined as..." or "Term refers to..." or "Term is an?..."
  if (definitions.length < 5) {
    const isMatches = text.matchAll(/([A-Z][A-Za-z0-9\s\-]{2,30})\s+(?:is defined as|refers to|is an?|represents)\s+([^.?!;]{20,}[.?!])/g);
    for (const match of isMatches) {
      const term = match[1].trim();
      const def = match[0].trim();
      if (!definitions.some((d) => d.term.toLowerCase() === term.toLowerCase())) {
        definitions.push({ term, definition: def });
        if (definitions.length >= 8) break;
      }
    }
  }

  return definitions;
}

function extractFormulasFromText(text: string): { formula: string; description: string; variables: string[] }[] {
  const formulas: { formula: string; description: string; variables: string[] }[] = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Check for mathematical or equation lines containing =, \approx, +, -, *, /, ^, or \sum
    if ((line.includes('=') || line.includes('≈') || line.includes('≤') || line.includes('≥')) &&
        line.length > 5 && line.length < 160 && !line.startsWith('http') && !line.includes('==')) {
      const parts = line.split(/[=≈≤≥]/);
      const leftPart = parts[0]?.trim() || 'Expression';
      formulas.push({
        formula: line,
        description: `Mathematical expression for ${leftPart}`,
        variables: ['Parameters as defined in document context'],
      });
      if (formulas.length >= 5) break;
    }
  }

  return formulas;
}

export class AcademicIntelligenceProvider implements AIProvider {
  name = 'StudyForge Engine';

  async answerQuestion(
    query: string,
    contextChunks: DocumentChunk[],
    documentTitle: string
  ): Promise<{ answer: string; sources: number[] }> {
    const rawSources = Array.from(new Set(contextChunks.map((c) => c.pageNumber))).sort((a, b) => a - b);
    const sources = rawSources.length > 0 ? rawSources : [1];
    const primaryChunk = contextChunks[0] || {
      text: `Context extracted from study notes for ${documentTitle}.`,
      pageNumber: 1,
    };

    const queryLower = query.toLowerCase();
    const queryTerms = queryLower
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    // Score sentences in contextChunks based on query overlap
    const scoredSentences: { sentence: string; score: number; page: number }[] = [];
    for (const chunk of contextChunks) {
      const sentences = extractSentences(chunk.text);
      for (const sent of sentences) {
        const sentLower = sent.toLowerCase();
        let score = 0;
        for (const term of queryTerms) {
          if (sentLower.includes(term)) score += 3;
        }
        if (score > 0) {
          scoredSentences.push({ sentence: sent, score, page: chunk.pageNumber });
        }
      }
    }

    scoredSentences.sort((a, b) => b.score - a.score);
    const topSentences = scoredSentences.slice(0, 3);

    let responseBody = '';

    if (topSentences.length > 0) {
      responseBody = `### Direct Answer from Document Context\n\n` +
        `Based on **${documentTitle}** (referenced on **Page ${sources.join(', Page ')}**):\n\n` +
        topSentences.map((s) => `> "${s.sentence}" *(Source: Page ${s.page})*`).join('\n\n') +
        `\n\n#### Key Conceptual Synthesis:\n` +
        `- **Core Takeaway:** The retrieved excerpts address **"${query}"** by establishing the fundamental principles and operational constraints relevant to this subject.\n` +
        `- **Academic Relevance:** Review the surrounding explanations on **Page ${sources.join(', Page ')}** to understand the complete derivations and contextual applications.\n\n` +
        `> **Exam Tip:** When answering questions on this topic in examinations, define the underlying terms, sketch any related diagrams, and state all governing assumptions clearly.`;
    } else {
      // Fallback response using actual chunk text rather than fabricated diode physics
      const snippet = primaryChunk.text.slice(0, 450).trim();
      responseBody = `### Analysis from Document Excerpts\n\n` +
        `According to **Page ${primaryChunk.pageNumber}** of **${documentTitle}**:\n\n` +
        `> "${snippet}..."\n\n` +
        `#### Relevant Information:\n` +
        `The document excerpt discusses the concepts outlined above. While your specific query *" ${query} "* may require reviewing adjacent sections, the indexed excerpts establish the foundational framework for this subject.\n\n` +
        `> **Key Takeaway:** Consult **Page ${sources.join(', Page ')}** for comprehensive coverage and related problem sets.`;
    }

    return {
      answer: responseBody,
      sources,
    };
  }

  async generateSummary(
    documentId: string,
    fullText: string,
    pages: { pageNumber: number; text: string }[]
  ): Promise<Summary> {
    const sentences = extractSentences(fullText);
    const definitions = extractDefinitionsFromText(fullText);
    const formulas = extractFormulasFromText(fullText);

    // Generate quick summary from the first 3 substantial sentences
    const introSentences = sentences.slice(0, 3);
    const quickSummary = introSentences.length > 0
      ? introSentences.join(' ')
      : 'This study document covers foundational theoretical principles, structured derivations, and practical applications.';

    // Generate key concepts from extracted definitions or prominent sentences
    const keyConcepts = definitions.slice(0, 4).map((d, idx) => ({
      title: d.term,
      explanation: d.definition,
      importance: (idx === 0 ? 'high' : idx === 1 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
    }));

    if (keyConcepts.length === 0 && sentences.length > 0) {
      keyConcepts.push({
        title: 'Core Foundation & Principles',
        explanation: sentences[0] || 'Foundational concepts established in the study material.',
        importance: 'high',
      });
      if (sentences.length > 1) {
        keyConcepts.push({
          title: 'Analytical Modeling & Framework',
          explanation: sentences[1] || 'Analytical relationships and governing laws.',
          importance: 'high',
        });
      }
    }

    // Detailed summary per page (first 4 pages)
    const detailedSummary = pages.slice(0, 4).map((p, idx) => {
      const pageSentences = extractSentences(p.text);
      return {
        chapter: `Module ${idx + 1}: Overview (Page ${p.pageNumber})`,
        content: pageSentences.slice(0, 2).join(' ') || (p.text.slice(0, 220) + '...'),
        keyPoints: pageSentences.slice(0, 3).length > 0
          ? pageSentences.slice(0, 3)
          : ['Directly relevant to syllabus requirements.', 'Review accompanying diagrams and definitions.'],
      };
    });

    // Last minute revision bullet points from key sentences
    const lastMinuteRevision = sentences.slice(3, 7).length > 0
      ? sentences.slice(3, 7)
      : [
          'Review all core definitions and governing assumptions.',
          'Verify boundary conditions for analytical derivations.',
          'Practice previous year examination numericals.',
        ];

    return {
      id: `sum-${documentId}`,
      documentId,
      quickSummary,
      detailedSummary,
      keyConcepts,
      formulas: formulas.length > 0 ? formulas : [
        {
          formula: 'Theoretical Formulation',
          description: 'Primary governing relationship defined in text',
          variables: ['Standard notations as defined in the document'],
        },
      ],
      definitions: definitions.length > 0 ? definitions : [
        {
          term: 'Fundamental Principle',
          definition: sentences[0] || 'Key principle covered in the study document.',
        },
      ],
      lastMinuteRevision,
      createdAt: new Date().toISOString(),
    };
  }

  async generateTopics(documentId: string, fullText: string): Promise<Topic[]> {
    const topics: Topic[] = [];
    const lines = fullText.split('\n').map((l) => l.trim()).filter(Boolean);

    // Look for module/chapter/unit or numbered lines
    for (const line of lines) {
      const headingMatch = line.match(/^(?:Module|Chapter|Unit|Section|\d+\.)\s*[:\d\.\-]*\s*([A-Za-z0-9\s\-&,]{4,60})/i);
      if (headingMatch && headingMatch[1].trim().length > 4) {
        const name = headingMatch[1].trim();
        if (!topics.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
          topics.push({
            id: `top-${documentId}-${topics.length + 1}`,
            documentId,
            name,
            documentImportance: Math.max(65, 95 - topics.length * 8),
            examFrequency: Math.max(60, 90 - topics.length * 7),
            weightagePercentage: Math.max(15, Math.round(100 / (topics.length + 1))),
            examYears: [2024, 2025],
            status: topics.length === 0 ? 'studying' : 'to_study',
            keyNotes: `Comprehensive review of ${name}. High probability exam topic.`,
          });
          if (topics.length >= 5) break;
        }
      }
    }

    // If no explicit heading matches, extract terms from definitions
    if (topics.length < 2) {
      const definitions = extractDefinitionsFromText(fullText);
      definitions.slice(0, 4).forEach((d, idx) => {
        topics.push({
          id: `top-${documentId}-${topics.length + 1}`,
          documentId,
          name: d.term,
          documentImportance: 90 - idx * 8,
          examFrequency: 85 - idx * 7,
          weightagePercentage: 25,
          examYears: [2024, 2025],
          status: idx === 0 ? 'studying' : 'to_study',
          keyNotes: d.definition.slice(0, 100) + '...',
        });
      });
    }

    // If still empty, fall back to core structural sections
    if (topics.length === 0) {
      topics.push(
        {
          id: `top-${documentId}-1`,
          documentId,
          name: 'Core Theory & Physical Principles',
          documentImportance: 95,
          examFrequency: 90,
          weightagePercentage: 35,
          examYears: [2024, 2025],
          status: 'studying',
          keyNotes: 'Fundamental theory and basic principles introduced in the study material.',
        },
        {
          id: `top-${documentId}-2`,
          documentId,
          name: 'Mathematical Derivations & Relations',
          documentImportance: 85,
          examFrequency: 80,
          weightagePercentage: 35,
          examYears: [2024, 2025],
          status: 'to_study',
          keyNotes: 'Analytical expressions, formulas, and proofs.',
        },
        {
          id: `top-${documentId}-3`,
          documentId,
          name: 'Engineering Applications & Systems',
          documentImportance: 70,
          examFrequency: 65,
          weightagePercentage: 30,
          examYears: [2024, 2025],
          status: 'to_study',
          keyNotes: 'Applied mechanisms, problem-solving, and examination case studies.',
        }
      );
    }

    return topics;
  }

  async generateQuiz(quizId: string, fullText: string, count = 5): Promise<QuizQuestion[]> {
    const sentences = extractSentences(fullText);
    const definitions = extractDefinitionsFromText(fullText);
    const questions: QuizQuestion[] = [];

    // Question 1..N from definitions
    for (let i = 0; i < definitions.length && questions.length < count; i++) {
      const def = definitions[i];
      const otherDefs = definitions
        .filter((_, idx) => idx !== i)
        .map((d) => d.definition)
        .slice(0, 3);

      const options = [def.definition, ...otherDefs];
      if (options.length < 4) {
        options.push('None of the mentioned alternatives');
        options.push('Applies only at absolute zero temperature');
        options.push('Indicates non-linear capacitive displacement');
      }
      const shuffledOptions = options.slice(0, 4).sort(() => 0.5 - Math.random());

      questions.push({
        id: `q-${quizId}-${questions.length + 1}`,
        quizId,
        question: `According to the document, what is the definition or role of "${def.term}"?`,
        type: 'mcq',
        options: shuffledOptions,
        correctAnswer: def.definition,
        explanation: `As stated in the text: ${def.definition}`,
        sourcePage: Math.min(1 + Math.floor(i / 2), 5),
        topicName: def.term,
        difficulty: i === 0 ? 'easy' : 'medium',
      });
    }

    // Question from statements (True/False or factual MCQ)
    for (let i = 0; i < sentences.length && questions.length < count; i++) {
      const sent = sentences[i];
      if (sent.length > 40 && sent.length < 200) {
        questions.push({
          id: `q-${quizId}-${questions.length + 1}`,
          quizId,
          question: `True or False: According to the study material, "${sent}"`,
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: `Directly supported by the document text: "${sent}"`,
          sourcePage: Math.min(1 + Math.floor(i / 3), 5),
          topicName: 'Core Principles',
          difficulty: 'medium',
        });
      }
    }

    // If still needed, fill with conceptual questions
    while (questions.length < count) {
      const idx = questions.length + 1;
      questions.push({
        id: `q-${quizId}-${idx}`,
        quizId,
        question: `Which approach is emphasized in the study document for problem solving in this unit?`,
        type: 'mcq',
        options: [
          'Systematic analysis of boundary conditions and governing equations',
          'Relying solely on empirical estimates without derivation',
          'Ignoring environmental parameter variations',
          'Omitting dimensional consistency checks',
        ],
        correctAnswer: 'Systematic analysis of boundary conditions and governing equations',
        explanation: 'The academic material emphasizes rigorous analytical proofs with clearly stated boundary conditions.',
        sourcePage: 1,
        topicName: 'Analytical Methods',
        difficulty: 'easy',
      });
    }

    return questions.slice(0, count);
  }

  async generateFlashcards(documentId: string, fullText: string): Promise<Flashcard[]> {
    const definitions = extractDefinitionsFromText(fullText);
    const sentences = extractSentences(fullText);
    const flashcards: Flashcard[] = [];

    // Flashcards from definitions
    for (let i = 0; i < definitions.length && flashcards.length < 6; i++) {
      const def = definitions[i];
      flashcards.push({
        id: `fc-${documentId}-${flashcards.length + 1}`,
        documentId,
        front: `Define and state the key principles of: ${def.term}`,
        back: def.definition,
        category: def.term,
        difficulty: i % 2 === 0 ? 'medium' : 'hard',
        reviewStatus: 'learning',
        timesReviewed: 0,
      });
    }

    // Flashcards from key sentences
    for (let i = 0; i < sentences.length && flashcards.length < 6; i++) {
      const sent = sentences[i];
      if (sent.length > 50 && sent.length < 220) {
        flashcards.push({
          id: `fc-${documentId}-${flashcards.length + 1}`,
          documentId,
          front: `What is the significance of the following concept in this subject?\n"${sent.slice(0, 80)}..."`,
          back: sent,
          category: 'Key Concept',
          difficulty: 'medium',
          reviewStatus: 'learning',
          timesReviewed: 0,
        });
      }
    }

    // Fallback if text was minimal
    if (flashcards.length === 0) {
      flashcards.push({
        id: `fc-${documentId}-1`,
        documentId,
        front: 'What are the foundational principles covered in this study document?',
        back: fullText.slice(0, 200) || 'Core principles and definitions as set out in the syllabus.',
        category: 'Core Concepts',
        difficulty: 'easy',
        reviewStatus: 'learning',
        timesReviewed: 0,
      });
    }

    return flashcards;
  }
}

export function getAIProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    return new GeminiProvider(apiKey.trim());
  }
  return new AcademicIntelligenceProvider();
}
