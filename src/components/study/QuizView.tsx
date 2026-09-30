'use client';

import React, { useState, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { QuizQuestion } from '@/lib/database/schema';

interface QuizResultPayload {
  success: boolean;
  score: number;
  total: number;
  percentage: number;
  strongTopics: string[];
  weakTopics: string[];
  results: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    sourcePage: number;
    topicName: string;
  }[];
}

export function QuizView() {
  const { selectedDocument, selectedDocumentId, setActiveView } = useStudy();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<QuizResultPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadQuiz = async () => {
    if (!selectedDocumentId) return;
    try {
      setLoading(true);
      setSubmitted(false);
      setScoreResult(null);
      setAnswers({});
      setCurrentIdx(0);

      const quizRes = await fetch(`/api/documents/${selectedDocumentId}/quiz`);
      const quizData = await quizRes.json();
      if (quizData.questions) {
        setQuestions(quizData.questions);
      }
    } catch (e) {
      console.error('Error loading quiz', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [selectedDocumentId]);

  const handleSelectOption = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || !selectedDocumentId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/documents/${selectedDocumentId}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.success) {
        setScoreResult(data);
        setSubmitted(true);
      }
    } catch (e) {
      console.error('Error submitting quiz', e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <span className="badge-tag">ADAPTIVE KNOWLEDGE TESTING</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(22px, 2.6vw, 32px)',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '4px',
            }}
          >
            Diagnostic Practice Quiz
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginTop: '4px' }}>
            Document: <span style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>{selectedDocument?.title || 'Selected Document'}</span>
          </p>
        </div>

        <button
          onClick={loadQuiz}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <RotateCcw size={13} />
          Reset Quiz
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
          <Sparkles size={20} className="animate-spin" />
          <span style={{ marginLeft: '10px' }}>Synthesizing diagnostic questions from document...</span>
        </div>
      ) : submitted && scoreResult ? (
        /* RESULTS & REVIEW SCREEN */
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '16px', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(195, 164, 123, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--pink-bright)',
            }}
          >
            <Award size={32} />
          </div>

          <span className="badge-tag">EXAMINATION RESULT</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '38px', fontWeight: 600, color: 'var(--text)', margin: '8px 0' }}>
            {scoreResult.score} / {scoreResult.total}{' '}
            <span style={{ fontSize: '26px', color: scoreResult.percentage >= 70 ? 'var(--pink-bright)' : '#e57a44' }}>
              ({scoreResult.percentage}%)
            </span>
          </h2>

          {/* Strengths & Weaknesses Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              margin: '28px 0',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                padding: '18px 20px',
                background: 'rgba(137, 148, 111, 0.12)',
                border: '1px solid rgba(137, 148, 111, 0.3)',
                borderRadius: '10px',
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Strong Mastery
              </div>
              {scoreResult.strongTopics.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {scoreResult.strongTopics.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text)' }}>
                      <CheckCircle2 size={15} color="var(--sage)" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>No topics mastered yet. Review key formulas.</div>
              )}
            </div>

            <div
              style={{
                padding: '18px 20px',
                background: 'rgba(229, 122, 68, 0.12)',
                border: '1px solid rgba(229, 122, 68, 0.3)',
                borderRadius: '10px',
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#e57a44', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Needs Revision
              </div>
              {scoreResult.weakTopics.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {scoreResult.weakTopics.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text)' }}>
                      <XCircle size={15} color="#e57a44" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--sage)' }}>Excellent! All tested topics answered correctly.</div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
            <button onClick={loadQuiz} className="btn-primary" style={{ padding: '10px 24px' }}>
              <RotateCcw size={15} />
              RETRY QUIZ
            </button>
            <button onClick={() => setActiveView('flashcards')} className="btn-secondary" style={{ padding: '10px 24px' }}>
              <Layers size={15} />
              REVIEW FLASHCARDS
            </button>
          </div>

          {/* Detailed Question Review */}
          <div style={{ textAlign: 'left', borderTop: '1px solid rgba(195, 164, 123, 0.2)', paddingTop: '32px' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>
              Detailed Answer Explanations & Citations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {scoreResult.results.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    background: r.isCorrect ? 'rgba(137, 148, 111, 0.08)' : 'rgba(229, 122, 68, 0.08)',
                    border: r.isCorrect ? '1px solid rgba(137, 148, 111, 0.3)' : '1px solid rgba(229, 122, 68, 0.3)',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: r.isCorrect ? 'var(--sage)' : '#e57a44' }}>
                      Question {idx + 1} • {r.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                      Page {r.sourcePage}
                    </span>
                  </div>

                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
                    {r.question}
                  </div>

                  <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                    <strong style={{ color: 'var(--muted)' }}>Your Answer: </strong>
                    <span style={{ color: r.isCorrect ? 'var(--sage)' : '#e57a44' }}>{r.userAnswer || '(None selected)'}</span>
                  </div>

                  {!r.isCorrect && (
                    <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                      <strong style={{ color: 'var(--muted)' }}>Correct Answer: </strong>
                      <span style={{ color: 'var(--sage)', fontWeight: 600 }}>{r.correctAnswer}</span>
                    </div>
                  )}

                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.6, marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                    <strong style={{ color: 'var(--pink)' }}>Explanation: </strong>
                    {r.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : currentQ ? (
        /* QUESTION CARD */
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '16px' }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--pink-bright)' }}>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'capitalize' }}>
              Topic: {currentQ.topicName}
            </span>
          </div>

          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', marginBottom: '28px' }}>
            <div
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
                height: '100%',
                background: 'var(--pink)',
                borderRadius: '2px',
                transition: 'width 250ms ease',
              }}
            />
          </div>

          {/* Question Text */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', lineHeight: 1.5, color: 'var(--text)', marginBottom: '24px' }}>
            {currentQ.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQ.id] === opt;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(195, 164, 123, 0.15)' : 'rgba(29, 26, 21, 0.6)',
                    border: isSelected ? '1.5px solid var(--pink)' : '1px solid rgba(195, 164, 123, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? '6px solid var(--pink)' : '1.5px solid rgba(195, 164, 123, 0.4)',
                      background: 'transparent',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '14.5px', color: isSelected ? 'var(--pink-bright)' : 'var(--text)', lineHeight: 1.4 }}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="btn-secondary"
              style={{ padding: '10px 18px', opacity: currentIdx === 0 ? 0.35 : 1 }}
            >
              <ArrowLeft size={15} />
              Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="btn-primary"
                style={{ padding: '10px 22px' }}
              >
                Next Question
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="btn-primary"
                style={{ padding: '10px 28px', background: 'var(--sage)', color: '#1a1815' }}
              >
                {submitting ? 'Submitting & Evaluating...' : 'Submit Answers'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          No quiz questions available for this document.
        </div>
      )}
    </div>
  );
}
