'use client';

import React, { useState, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  Sparkles,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  Clock,
  CheckCircle2,
  FileText,
  Bookmark,
  Share2,
} from 'lucide-react';
import { Summary } from '@/lib/database/schema';

export function SummaryView() {
  const { selectedDocument, selectedDocumentId, setActiveView } = useStudy();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed' | 'concepts' | 'formulas' | 'definitions' | 'revision'>('quick');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      if (!selectedDocumentId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/documents/${selectedDocumentId}/summary`);
        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
        }
      } catch (e) {
        console.error('Error fetching summary:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [selectedDocumentId]);

  const tabs = [
    { key: 'quick', label: 'Quick Summary' },
    { key: 'detailed', label: 'Chapter Breakdown' },
    { key: 'concepts', label: 'Key Concepts' },
    { key: 'formulas', label: 'Formulas & Equations' },
    { key: 'definitions', label: 'Core Definitions' },
    { key: 'revision', label: 'Last-Minute Sheet' },
  ] as const;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <span className="badge-tag">AI SYNTHESIS</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '4px',
            }}
          >
            Study Summary & Knowledge Digest
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            Document: <span style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>{selectedDocument?.title || 'Selected Document'}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveView('reader')}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <BookOpen size={14} />
            Read Full Text
          </button>
          <button
            onClick={() => setActiveView('quiz')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Award size={14} />
            Test Knowledge
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(195, 164, 123, 0.2)',
          paddingBottom: '12px',
          marginBottom: '28px',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: activeTab === t.key ? 600 : 400,
              background: activeTab === t.key ? 'var(--pink)' : 'rgba(238, 226, 202, 0.05)',
              color: activeTab === t.key ? 'var(--ink-deep)' : 'var(--text)',
              border: activeTab === t.key ? 'none' : '1px solid rgba(195, 164, 123, 0.2)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
          <Sparkles size={20} className="animate-spin" />
          <span style={{ marginLeft: '10px' }}>Synthesizing comprehensive academic summary...</span>
        </div>
      ) : summary ? (
        <div className="glass-panel" style={{ padding: '32px 36px', borderRadius: '16px' }}>
          {/* QUICK SUMMARY */}
          {activeTab === 'quick' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, color: 'var(--pink-bright)', marginBottom: '16px' }}>
                Executive Academic Overview
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-line' }}>
                {summary.quickSummary}
              </p>

              <div
                style={{
                  marginTop: '32px',
                  padding: '20px 24px',
                  background: 'rgba(195, 164, 123, 0.08)',
                  border: '1px solid rgba(195, 164, 123, 0.25)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--pink-bright)' }}>
                    Ready to practice what you learned?
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                    Take a 5-minute adaptive quiz generated specifically from these concepts.
                  </div>
                </div>
                <button
                  onClick={() => setActiveView('quiz')}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '12px' }}
                >
                  Start Diagnostic Quiz →
                </button>
              </div>
            </div>
          )}

          {/* DETAILED SUMMARY */}
          {activeTab === 'detailed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {summary.detailedSummary.map((ch, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '24px',
                    background: 'rgba(29, 26, 21, 0.5)',
                    border: '1px solid rgba(195, 164, 123, 0.16)',
                    borderRadius: '12px',
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '18.5px', fontWeight: 600, color: 'var(--pink-bright)', margin: '0 0 10px 0' }}>
                    {ch.chapter}
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text)', marginBottom: '16px' }}>
                    {ch.content}
                  </p>
                  <div>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                      Key Focus Points:
                    </span>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.6 }}>
                      {ch.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* KEY CONCEPTS */}
          {activeTab === 'concepts' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {summary.keyConcepts.map((kc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    background: 'rgba(29, 26, 21, 0.6)',
                    border: '1px solid rgba(195, 164, 123, 0.18)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: kc.importance === 'high' ? '#e57a44' : 'var(--pink)',
                        background: kc.importance === 'high' ? 'rgba(229, 122, 68, 0.12)' : 'rgba(195, 164, 123, 0.12)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                      }}
                    >
                      {kc.importance} yield
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
                    {kc.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
                    {kc.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* FORMULAS */}
          {activeTab === 'formulas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {summary.formulas.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '22px 24px',
                    background: 'rgba(20, 18, 14, 0.8)',
                    border: '1px solid rgba(195, 164, 123, 0.25)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                        {f.description}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: '18px',
                          color: 'var(--pink-bright)',
                          fontWeight: 600,
                          margin: '10px 0',
                          padding: '10px 16px',
                          background: 'rgba(0, 0, 0, 0.35)',
                          borderRadius: '8px',
                          display: 'inline-block',
                        }}
                      >
                        {f.formula}
                      </div>
                    </div>
                  </div>

                  {f.variables && f.variables.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(195, 164, 123, 0.1)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>Variables:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                        {f.variables.map((v, vIdx) => (
                          <span
                            key={vIdx}
                            style={{
                              fontSize: '11.5px',
                              fontFamily: 'var(--mono)',
                              background: 'rgba(195, 164, 123, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              color: 'var(--text)',
                            }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* DEFINITIONS */}
          {activeTab === 'definitions' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {summary.definitions.map((def, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    background: 'rgba(29, 26, 21, 0.5)',
                    border: '1px solid rgba(195, 164, 123, 0.16)',
                    borderRadius: '10px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--pink-bright)', margin: '0 0 6px 0' }}>
                    {def.term}
                  </h3>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text)', margin: 0 }}>
                    {def.definition}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* LAST-MINUTE REVISION */}
          {activeTab === 'revision' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                  color: 'var(--pink-bright)',
                }}
              >
                <Clock size={18} />
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 600, margin: 0 }}>
                  High-Yield Examination Cheat Sheet
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {summary.lastMinuteRevision.map((point, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(29, 26, 21, 0.6)',
                      borderLeft: '4px solid var(--pink)',
                      borderRadius: '0 10px 10px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--pink)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text)' }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          No summary generated for this document yet.
        </div>
      )}
    </div>
  );
}
