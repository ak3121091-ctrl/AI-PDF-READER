import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { QuizAttempt } from '@/lib/database/schema';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = db.getQuiz(id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    const questions = db.getQuizQuestions(quiz.id);
    // Don't leak answers in initial quiz fetch
    const safeQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options,
      topicName: q.topicName,
      difficulty: q.difficulty,
    }));

    return NextResponse.json({
      quiz,
      questions: safeQuestions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
    const { answers } = body as { answers: Record<string, string> };

    const quiz = db.getQuiz(id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const questions = db.getQuizQuestions(quiz.id);
    let correctCount = 0;
    const strongTopics = new Set<string>();
    const weakTopics = new Set<string>();

    const reviewItems = questions.map((q) => {
      const userAnswer = answers?.[q.id] || '';
      const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) {
        correctCount++;
        strongTopics.add(q.topicName);
      } else {
        weakTopics.add(q.topicName);
      }

      return {
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        sourcePage: q.sourcePage,
        topicName: q.topicName,
      };
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const attempt: QuizAttempt = {
      id: 'attempt-' + Date.now(),
      quizId: quiz.id,
      userId: 'user-ashutosh',
      score: correctCount,
      total,
      percentage,
      strongTopics: Array.from(strongTopics),
      weakTopics: Array.from(weakTopics).filter((t) => !strongTopics.has(t)),
      userAnswers: answers || {},
      submittedAt: new Date().toISOString(),
    };

    db.saveQuizAttempt(attempt);

    return NextResponse.json({
      success: true,
      score: correctCount,
      total,
      percentage,
      strongTopics: attempt.strongTopics,
      weakTopics: attempt.weakTopics,
      results: reviewItems,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
