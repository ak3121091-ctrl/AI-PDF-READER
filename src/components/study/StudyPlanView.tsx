'use client';

import React, { useState, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  Award,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { StudyPlan, StudyTask } from '@/lib/database/schema';

export function StudyPlanView() {
  const { setActiveView, setSelectedDocumentId } = useStudy();

  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [examDate, setExamDate] = useState('2026-12-15');
  const [dailyHours, setDailyHours] = useState('3.5');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/study-plan');
      const data = await res.json();
      if (data.plan) setPlan(data.plan);
      if (data.tasks) setTasks(data.tasks);
    } catch (e) {
      console.error('Error fetching study plan', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
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
      console.error('Error updating task', e);
    }
  };

  const handleGenerateCustomPlan = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examDate,
          dailyHours: Number(dailyHours),
          currentLevel: level,
        }),
      });
      const data = await res.json();
      if (data.plan) setPlan(data.plan);
      if (data.tasks) setTasks(data.tasks);
    } catch (e) {
      console.error('Error generating plan', e);
    } finally {
      setGenerating(false);
    }
  };

  // Group tasks by Day
  const groupedTasks: Record<number, StudyTask[]> = {};
  tasks.forEach((t) => {
    if (!groupedTasks[t.dayNumber]) groupedTasks[t.dayNumber] = [];
    groupedTasks[t.dayNumber].push(t);
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span className="badge-tag">TARGETED REVISION ENGINE</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '4px',
            }}
          >
            Personalized Study Planner
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            Adaptive preparation schedule structured around document topics and quiz accuracy.
          </p>
        </div>

        {/* Plan Summary Stat Badge */}
        <div
          className="glass-panel"
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Overall Progress</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--pink-bright)', fontFamily: 'var(--mono)' }}>
              {completedCount} / {tasks.length} ({progressPct}%)
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(195, 164, 123, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pink)' }}>
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* Plan Configuration Card */}
      <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '14px', marginBottom: '32px' }}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 600, color: 'var(--pink-bright)', marginBottom: '16px' }}>
          Customize Your Schedule Parameters
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>
              Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(20, 18, 14, 0.8)',
                border: '1px solid rgba(195, 164, 123, 0.25)',
                color: 'var(--text)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>
              Daily Study Capacity (Hours)
            </label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(20, 18, 14, 0.8)',
                border: '1px solid rgba(195, 164, 123, 0.25)',
                color: 'var(--text)',
                fontSize: '13px',
              }}
            >
              <option value="1.5">1.5 hours / day</option>
              <option value="2.5">2.5 hours / day</option>
              <option value="3.5">3.5 hours / day</option>
              <option value="5.0">5.0 hours (Intensive)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>
              Current Preparation Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(20, 18, 14, 0.8)',
                border: '1px solid rgba(195, 164, 123, 0.25)',
                color: 'var(--text)',
                fontSize: '13px',
              }}
            >
              <option value="beginner">Beginner (Foundations first)</option>
              <option value="intermediate">Intermediate (Standard syllabus)</option>
              <option value="advanced">Advanced (Exam derivations & PYQs)</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleGenerateCustomPlan}
              disabled={generating}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
            >
              <Sparkles size={15} />
              {generating ? 'Regenerating...' : 'Regenerate Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Breakdown Stream */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
          <Sparkles size={20} className="animate-spin" />
          <span style={{ marginLeft: '10px' }}>Loading targeted study plan...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {Object.entries(groupedTasks).map(([dayStr, dayTasks]) => {
            const dayNum = Number(dayStr);
            const isToday = dayNum === 1;
            const dayCompleted = dayTasks.every((t) => t.completed);

            return (
              <div key={dayNum} className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: isToday ? 'var(--pink)' : 'rgba(195, 164, 123, 0.15)',
                        color: isToday ? 'var(--ink-deep)' : 'var(--pink-bright)',
                      }}
                    >
                      {isToday ? 'DAY 01 • TODAY' : `DAY 0${dayNum}`}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      Total Study: {dayTasks.reduce((acc, t) => acc + t.durationMinutes, 0)} minutes
                    </span>
                  </div>

                  {dayCompleted && (
                    <span style={{ fontSize: '12px', color: 'var(--sage)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTask(t.id)}
                      style={{
                        padding: '16px 18px',
                        background: t.completed ? 'rgba(137, 148, 111, 0.08)' : 'rgba(29, 26, 21, 0.6)',
                        border: t.completed ? '1px solid rgba(137, 148, 111, 0.3)' : '1px solid rgba(195, 164, 123, 0.16)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        transition: 'all 160ms ease',
                      }}
                    >
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '5px',
                          border: t.completed ? '1px solid var(--sage)' : '1.5px solid rgba(195, 164, 123, 0.4)',
                          background: t.completed ? 'var(--sage)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {t.completed && <CheckCircle2 size={15} color="#1d1a15" />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '14.5px',
                            fontWeight: 600,
                            color: t.completed ? 'var(--muted)' : 'var(--text)',
                            textDecoration: t.completed ? 'line-through' : 'none',
                          }}
                        >
                          {t.title}
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                          {t.description}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--pink-bright)' }}>
                          {t.durationMinutes} min
                        </span>
                        {t.documentId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDocumentId(t.documentId!);
                              if (t.type === 'practice') setActiveView('quiz');
                              else if (t.type === 'flashcards') setActiveView('flashcards');
                              else setActiveView('reader');
                            }}
                            className="btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                          >
                            Launch →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
