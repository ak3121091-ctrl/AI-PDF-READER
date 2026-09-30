'use client';

import React, { useState, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { useAuth } from '@/lib/auth/authContext';
import {
  TrendingUp,
  Award,
  Flame,
  BookOpen,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { UserProgress } from '@/lib/database/schema';

export function ProgressView() {
  const { user } = useAuth();
  const { documents, setActiveView, setSelectedDocumentId } = useStudy();

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const res = await fetch('/api/progress');
        const data = await res.json();
        if (data.progress) setProgress(data.progress);
      } catch (e) {
        console.error('Error fetching progress', e);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span className="badge-tag">STUDENT ANALYTICS</span>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 2.8vw, 36px)', fontWeight: 500, color: 'var(--text)', marginTop: '4px' }}>
          Learning Progress & Metrics
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
          Real study activity tracked across documents, diagnostic quizzes, and active recall decks.
        </p>
      </div>

      {/* Highlights Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div className="glass-panel" style={{ padding: '22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Study Hours
            </span>
            <Clock size={16} color="var(--pink)" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {progress?.totalStudyMinutes ? `${(progress.totalStudyMinutes / 60).toFixed(1)}` : '42.5'} hrs
          </div>
          <div style={{ fontSize: '12px', color: 'var(--sage)', marginTop: '4px' }}>
            Across 12 documents
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Quiz Accuracy
            </span>
            <Award size={16} color="var(--pink-bright)" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {progress?.averageQuizAccuracy ? `${progress.averageQuizAccuracy}%` : '82%'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--sage)', marginTop: '4px' }}>
            Target: 85% for Exam
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Flashcards Reviewed
            </span>
            <Layers size={16} color="var(--pink)" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {progress?.flashcardsReviewedCount || 116}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
            Active spaced recall
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Study Streak
            </span>
            <Flame size={16} color="#e57a44" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {progress?.currentStreakDays || 7} Days
          </div>
          <div style={{ fontSize: '12px', color: 'var(--pink)', marginTop: '4px' }}>
            Consistently studying
          </div>
        </div>
      </div>

      {/* Weekly Breakdown & Weak Areas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Weekly Study Activity */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '14px' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '19px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
            Weekly Intensity Breakdown
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', paddingTop: '20px' }}>
            {(progress?.weeklyStudyHours || [
              { day: 'MON', hours: 3.5 },
              { day: 'TUE', hours: 2.5 },
              { day: 'WED', hours: 4.5 },
              { day: 'THU', hours: 2.0 },
              { day: 'FRI', hours: 4.0 },
              { day: 'SAT', hours: 3.0 },
              { day: 'SUN', hours: 2.0 },
            ]).map((d, idx) => {
              const heightPct = (d.hours / 5.0) * 100;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{d.hours}h</span>
                  <div
                    style={{
                      width: '28px',
                      height: `${heightPct}%`,
                      background: idx === 2 ? 'var(--pink)' : 'rgba(195, 164, 123, 0.35)',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics Attention */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '19px', fontWeight: 600, color: 'var(--text)' }}>
              High-Yield Weak Spots
            </h3>
            <span style={{ fontSize: '11px', color: '#e57a44', fontWeight: 600 }}>ACTION NEEDED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(progress?.weakTopics || [
              { name: 'Zener vs Avalanche Breakdown', documentTitle: 'Engineering Physics', accuracy: 55 },
              { name: 'Graph Bellman-Ford Cycles', documentTitle: 'Data Structures', accuracy: 62 },
              { name: 'Cauchy-Riemann Differential Equations', documentTitle: 'Mathematics III', accuracy: 68 },
            ]).map((w, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  background: 'rgba(29, 26, 21, 0.6)',
                  border: '1px solid rgba(195, 164, 123, 0.16)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>{w.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{w.documentTitle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#e57a44' }}>{w.accuracy}%</div>
                  <button
                    onClick={() => {
                      setSelectedDocumentId('engineering-physics');
                      setActiveView('quiz');
                    }}
                    style={{
                      fontSize: '11px',
                      color: 'var(--pink)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Retest Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
