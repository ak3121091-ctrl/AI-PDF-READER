'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { useStudy } from '@/contexts/StudyContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Flame,
  UploadCloud,
  Layers,
  ArrowRight,
  BrainCircuit,
  FileCheck,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { StudyTask, UserProgress } from '@/lib/database/schema';

export function DashboardView() {
  const { user } = useAuth();
  const {
    documents,
    setSelectedDocumentId,
    setActiveView,
    setIsUploadOpen,
  } = useStudy();

  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planRes, progRes] = await Promise.all([
        fetch('/api/study-plan'),
        fetch('/api/progress'),
      ]);

      const planData = await planRes.json();
      const progData = await progRes.json();

      if (planData.tasks) setTasks(planData.tasks);
      if (progData.progress) setProgress(progData.progress);
    } catch (e) {
      console.error('Error fetching dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    try {
      await fetch('/api/study-plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
    } catch (e) {
      console.error('Error updating task status', e);
    }
  };

  const handleOpenDoc = (docId: string, view: 'reader' | 'summary' | 'quiz' | 'flashcards' = 'reader') => {
    setSelectedDocumentId(docId);
    setActiveView(view);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span className="badge-tag">STUDYFORGE AI WORKSPACE</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(28px, 3.2vw, 42px)',
              fontWeight: 500,
              lineHeight: 1.15,
              color: 'var(--text)',
              marginTop: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            Good morning, {user?.name || 'Ashutosh'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>
            Turn your study notes into mastery. Select any document or upload a new PDF to generate insights.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '13px' }}
        >
          <UploadCloud size={16} />
          UPLOAD PDF
        </button>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px 22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Your Documents
            </span>
            <BookOpen size={16} color="var(--pink)" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {documents.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--sage)', marginTop: '4px' }}>
            {documents.length > 0 ? `${documents.length} document${documents.length === 1 ? '' : 's'} in library` : 'No documents uploaded yet'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Important Topics
            </span>
            <Layers size={16} color="var(--pink-bright)" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {progress ? progress.topicsMastered : 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
            Topics mastered
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quiz Accuracy
            </span>
            <Award size={16} color="var(--pink)" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {progress ? `${progress.averageQuizAccuracy}%` : '0%'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--sage)', marginTop: '4px' }}>
            {progress && progress.averageQuizAccuracy > 0 ? 'Verified quiz performance' : 'Take quizzes to track score'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Study Streak
            </span>
            <Flame size={16} color="#e57a44" />
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--text)', marginTop: '8px' }}>
            {progress ? progress.currentStreakDays : 0} Day{progress?.currentStreakDays === 1 ? '' : 's'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--pink)', marginTop: '4px' }}>
            {progress && progress.totalStudyMinutes > 0 ? `${(progress.totalStudyMinutes / 60).toFixed(1)}h total study time` : 'Start your study streak'}
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Documents & Today's Plan */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          marginBottom: '36px',
        }}
      >
        {/* RECENT DOCUMENTS */}
        <div className="glass-panel" style={{ padding: '26px 28px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>
              Recent Documents
            </h2>
            <button
              onClick={() => setActiveView('documents')}
              style={{
                fontSize: '12px',
                color: 'var(--pink)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              View All ({documents.length}) →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                style={{
                  padding: '16px',
                  background: 'rgba(29, 26, 21, 0.6)',
                  border: '1px solid rgba(195, 164, 123, 0.16)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'border-color 160ms ease, background 160ms ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
                  <h3
                    onClick={() => handleOpenDoc(doc.id, 'reader')}
                    style={{
                      fontSize: '14.5px',
                      fontWeight: 600,
                      color: 'var(--text)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                    }}
                    title={doc.title}
                  >
                    {doc.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                    <span>{doc.pageCount} Pages</span>
                    <span>•</span>
                    <span>{(doc.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenDoc(doc.id, 'reader')}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '6px' }}
                    title="Open Document Reader"
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleOpenDoc(doc.id, 'quiz')}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '6px' }}
                    title="Take AI Quiz"
                  >
                    Quiz
                  </button>
                  <button
                    onClick={() => handleOpenDoc(doc.id, 'flashcards')}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '6px' }}
                    title="Review Flashcards"
                  >
                    Cards
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY'S STUDY PLAN */}
        <div className="glass-panel" style={{ padding: '26px 28px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span className="badge-tag">SCHEDULE</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginTop: '2px' }}>
                Today's Study Plan
              </h2>
            </div>
            <button
              onClick={() => setActiveView('study-plan')}
              style={{
                fontSize: '12px',
                color: 'var(--pink)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Full Plan →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                style={{
                  padding: '14px 16px',
                  background: task.completed ? 'rgba(137, 148, 111, 0.08)' : 'rgba(29, 26, 21, 0.6)',
                  border: task.completed
                    ? '1px solid rgba(137, 148, 111, 0.3)'
                    : '1px solid rgba(195, 164, 123, 0.16)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: task.completed ? '1px solid var(--sage)' : '1px solid rgba(195, 164, 123, 0.4)',
                    background: task.completed ? 'var(--sage)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {task.completed && <CheckCircle2 size={14} color="#1d1a15" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: task.completed ? 'var(--muted)' : 'var(--text)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    {task.durationMinutes} min • {task.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics & Weak Spots Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Weekly Study Activity */}
        <div className="glass-panel" style={{ padding: '26px 28px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
              Weekly Study Intensity
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--pink)' }}>18.5 hrs Total</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '20px' }}>
            {[
              { day: 'MON', hrs: 3.5 },
              { day: 'TUE', hrs: 2.5 },
              { day: 'WED', hrs: 4.5 },
              { day: 'THU', hrs: 2.0 },
              { day: 'FRI', hrs: 4.0 },
              { day: 'SAT', hrs: 3.0 },
              { day: 'SUN', hrs: 2.0 },
            ].map((d, idx) => {
              const heightPct = (d.hrs / 5.0) * 100;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--muted)' }}>{d.hrs}h</span>
                  <div
                    style={{
                      width: '28px',
                      height: `${heightPct}%`,
                      background: idx === 2 ? 'var(--pink)' : 'rgba(195, 164, 123, 0.35)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 400ms ease',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Needs Revision Focus */}
        <div className="glass-panel" style={{ padding: '26px 28px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
              Weak Topics to Revise
            </h3>
            <span style={{ fontSize: '12px', color: '#e57a44' }}>Priority Focus</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Zener vs Avalanche Breakdown', doc: 'Engineering Physics', acc: '55%' },
              { name: 'Graph Bellman-Ford Cycles', doc: 'Data Structures', acc: '62%' },
              { name: 'Cauchy-Riemann Equations', doc: 'Mathematics III', acc: '68%' },
            ].map((topic, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  background: 'rgba(29, 26, 21, 0.5)',
                  border: '1px solid rgba(195, 164, 123, 0.14)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{topic.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{topic.doc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#e57a44' }}>{topic.acc}</span>
                  <button
                    onClick={() => {
                      setSelectedDocumentId('engineering-physics');
                      setActiveView('quiz');
                    }}
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      color: 'var(--pink)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '2px',
                    }}
                  >
                    Retest →
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
