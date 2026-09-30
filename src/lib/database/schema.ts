// Relational Schema Definition for StudyForge AI
// Entities: users, documents, document_pages, document_chunks, subjects, topics,
// summaries, flashcards, quizzes, quiz_questions, quiz_attempts, pyq_documents,
// pyq_questions, study_plans, study_tasks, study_sessions, user_progress

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  studyField: string;
  dailyGoalHours: number;
  examDate?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  code?: string;
  color?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  coverUrl?: string;
  summaryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentPage {
  id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  hasImages: boolean;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  embedding?: number[];
  keywords: string[];
}

export interface Topic {
  id: string;
  documentId: string;
  name: string;
  documentImportance: number; // 0-100
  examFrequency: number; // 0-100 based on PYQs
  weightagePercentage: number;
  examYears: number[];
  status: 'to_study' | 'studying' | 'mastered';
  keyNotes: string;
}

export interface Summary {
  id: string;
  documentId: string;
  quickSummary: string;
  detailedSummary: {
    chapter: string;
    content: string;
    keyPoints: string[];
  }[];
  keyConcepts: {
    title: string;
    explanation: string;
    importance: 'high' | 'medium' | 'low';
  }[];
  formulas: {
    formula: string;
    description: string;
    variables: string[];
  }[];
  definitions: {
    term: string;
    definition: string;
  }[];
  lastMinuteRevision: string[];
  createdAt: string;
}

export interface Flashcard {
  id: string;
  documentId: string;
  topicId?: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reviewStatus: 'new' | 'learning' | 'review' | 'mastered';
  timesReviewed: number;
  lastReviewedAt?: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: 'mcq' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  sourcePage: number;
  topicName: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  documentId: string;
  title: string;
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  total: number;
  percentage: number;
  strongTopics: string[];
  weakTopics: string[];
  userAnswers: Record<string, string>;
  submittedAt: string;
}

export interface PYQDocument {
  id: string;
  documentId: string;
  year: number;
  examName: string;
  totalMarks: number;
  uploadedAt: string;
}

export interface PYQQuestion {
  id: string;
  pyqDocumentId: string;
  topicName: string;
  questionText: string;
  marks: number;
  year: number;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  examDate: string;
  dailyHours: number;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export interface StudyTask {
  id: string;
  studyPlanId: string;
  dayNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  type: 'reading' | 'practice' | 'flashcards' | 'revision';
  completed: boolean;
  documentId?: string;
  topicName?: string;
}

export interface StudySession {
  id: string;
  userId: string;
  documentId?: string;
  durationMinutes: number;
  type: 'reader' | 'quiz' | 'flashcards' | 'pyq';
  timestamp: string;
}

export interface UserProgress {
  userId: string;
  documentsCount: number;
  topicsMastered: number;
  totalTopics: number;
  averageQuizAccuracy: number;
  flashcardsReviewedCount: number;
  totalStudyMinutes: number;
  currentStreakDays: number;
  weeklyStudyHours: { day: string; hours: number }[];
  weakTopics: { name: string; documentTitle: string; accuracy: number }[];
}
