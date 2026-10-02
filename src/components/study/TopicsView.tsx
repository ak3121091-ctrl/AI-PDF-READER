'use client';

import React, { useState, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Award,
} from 'lucide-react';
import { Topic } from '@/lib/database/schema';

export function TopicsView() {
  const { selectedDocument, selectedDocumentId, setActiveView } = useStudy();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      if (!selectedDocumentId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/documents/${selectedDocumentId}/topics`);
        const data = await res.json();
        if (data.topics) setTopics(data.topics);
      } catch (e) {
        console.error('Failed loading topics', e);
      } finally {
        setLoading(false);
      }
    }
    loadTopics();
  }, [selectedDocumentId]);

  const getPriorityCategory = (importance: number, frequency: number) => {
    const combined = (importance + frequency) / 2;
    if (combined >= 85) return { label: 'VERY IMPORTANT', color: '#e57a44', tagClass: 'very-important' };
    if (combined >= 65) return { label: 'IMPORTANT', color: 'var(--pink)', tagClass: 'important' };
    return { label: 'REVIEW', color: 'var(--sage)', tagClass: 'review' };
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <span className="badge-tag">EXAMINATION WEIGHTAGE & FREQUENCY</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '4px',
            }}
          >
            Important Topics & Exam Priority
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            Document: <span style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>{selectedDocument?.title || 'Selected Document'}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveView('pyq')}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <Calendar size={14} />
            View PYQ Papers
          </button>
          <button
            onClick={() => setActiveView('quiz')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Award size={14} />
            Practice Quiz
          </button>
        </div>
      </div>

      {/* Critical Methodology Notice */}
      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(195, 164, 123, 0.08)',
          border: '1px solid rgba(195, 164, 123, 0.22)',
          borderRadius: '10px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          color: 'var(--muted)',
          lineHeight: 1.55,
        }}
      >
        <HelpCircle size={18} color="var(--pink)" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: 'var(--pink-bright)' }}>Academic Methodology:</strong> Document Importance reflects theoretical depth and textbook emphasis. Exam Frequency is calculated strictly from verified semester questions in uploaded question papers.
        </span>
      </div>

      {/* Topics Ranking */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
          <Sparkles size={20} className="animate-spin" />
          <span style={{ marginLeft: '10px' }}>Analyzing topic frequencies and syllabus coverage...</span>
        </div>
      ) : topics.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topics.map((t, idx) => {
            const priority = getPriorityCategory(t.documentImportance, t.examFrequency);
            return (
              <div
                key={t.id}
                className="glass-panel"
                style={{
                  padding: '24px 28px',
                  borderRadius: '14px',
                  border: '1px solid rgba(195, 164, 123, 0.2)',
                  transition: 'border-color 160ms ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '13px',
                        color: 'var(--muted)',
                        fontWeight: 600,
                      }}
                    >
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: 'var(--text)',
                        margin: 0,
                      }}
                    >
                      {t.name}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: priority.color,
                        background: 'rgba(20, 18, 14, 0.6)',
                        border: `1px solid ${priority.color}`,
                        padding: '4px 10px',
                        borderRadius: '20px',
                      }}
                    >
                      {priority.label}
                    </span>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: t.status === 'mastered' ? 'var(--sage)' : '#e57a44',
                        background: t.status === 'mastered' ? 'rgba(137, 148, 111, 0.12)' : 'rgba(229, 122, 68, 0.12)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                      }}
                    >
                      {t.status === 'mastered' ? 'Mastered' : 'Needs Review'}
                    </span>
                  </div>
                </div>

                {/* Dual Comparison Bars */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                    margin: '18px 0',
                    padding: '16px',
                    background: 'rgba(20, 18, 14, 0.5)',
                    borderRadius: '10px',
                  }}
                >
                  {/* DOCUMENT IMPORTANCE BAR */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--muted)', fontWeight: 600 }}>DOCUMENT IMPORTANCE</span>
                      <span style={{ color: 'var(--pink-bright)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                        {t.documentImportance}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${t.documentImportance}%`,
                          height: '100%',
                          background: 'var(--pink)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                      {t.weightagePercentage}% estimated syllabus weightage
                    </div>
                  </div>

                  {/* EXAM REPETITION FREQUENCY */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--muted)', fontWeight: 600 }}>PYQ FREQUENCY</span>
                      <span style={{ color: '#e57a44', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                        {t.examFrequency}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${t.examFrequency}%`,
                          height: '100%',
                          background: '#e57a44',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                      Appeared in {t.examYears.join(', ')} papers
                    </div>
                  </div>
                </div>

                {/* Key Study Notes */}
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--pink)' }}>Preparation Advice: </strong>
                  {t.keyNotes}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          No topics extracted for this document yet.
        </div>
      )}
    </div>
  );
}
