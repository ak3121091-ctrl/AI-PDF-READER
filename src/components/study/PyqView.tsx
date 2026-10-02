'use client';

import React, { useState, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  PieChart,
  Award,
} from 'lucide-react';

export function PyqView() {
  const { selectedDocument, selectedDocumentId, setActiveView, setIsUploadOpen } = useStudy();

  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPYQ() {
      if (!selectedDocumentId) return;
      try {
        setLoading(true);
        const pyqRes = await fetch('/api/pyq/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: selectedDocumentId }),
        });
        const pyqData = await pyqRes.json();
        if (pyqData.analysis) {
          setAnalysis(pyqData.analysis);
        } else {
          setAnalysis(null);
        }
      } catch (e) {
        console.error('Error loading PYQ data', e);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    }
    loadPYQ();
  }, [selectedDocumentId]);

  const analyzedYears: number[] = Array.from(
    new Set((analysis?.analyzedPapers || []).map((p: any) => p.year))
  ).sort((a: any, b: any) => a - b) as number[];

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
          <span className="badge-tag">EXAMINATION PATTERN SYNTHESIS</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '4px',
            }}
          >
            Previous Year Question (PYQ) Analyzer
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            Document: <span style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>{selectedDocument?.title || 'Selected Document'}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveView('quiz')}
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '12px' }}
        >
          <Award size={14} />
          Practice PYQ Quiz
        </button>
      </div>

      {/* Methodology Alert Banner */}
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
        <AlertCircle size={18} color="var(--pink)" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: 'var(--pink-bright)' }}>Objective Historical Evidence:</strong> This module reflects question recurrence verified in the {analyzedYears.length > 0 ? analyzedYears.join(', ') : 'uploaded'} semester examination papers. No arbitrary future exam prediction is manufactured.
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
          <Sparkles size={20} className="animate-spin" />
          <span style={{ marginLeft: '10px' }}>Correlating multi-year exam papers and recurrence frequency...</span>
        </div>
      ) : analysis && analysis.analyzedPapers && analysis.analyzedPapers.length > 0 ? (
        <div>
          {/* Analyzed Papers Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {(analysis.analyzedPapers || []).map((paper: any, idx: number) => (
              <div key={idx} className="glass-panel" style={{ padding: '18px 20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--pink)', fontWeight: 600 }}>PAPER ARCHIVE</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--pink-bright)', fontWeight: 700 }}>
                    {paper.year}
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '6px 0 2px 0' }}>
                  {paper.exam}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {paper.totalQuestions} Questions • {paper.totalMarks} Marks Total
                </div>
              </div>
            ))}
          </div>

          {/* TOPIC FREQUENCY MATRIX */}
          <div className="glass-panel" style={{ padding: '32px 36px', borderRadius: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge-tag">REPETITION MATRIX</span>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                  Topic Frequency in Uploaded Papers
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Cross-checked across {analyzedYears.join(', ')}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(195, 164, 123, 0.25)', color: 'var(--pink-bright)' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Topic / Concept</th>
                    {analyzedYears.map((yr) => (
                      <th key={yr} style={{ padding: '12px 14px', textAlign: 'center' }}>{yr}</th>
                    ))}
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Frequency</th>
                    <th style={{ padding: '12px 14px' }}>Typical Format</th>
                  </tr>
                </thead>
                <tbody>
                  {(analysis?.topicFrequency || []).map((row: any, idx: number) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(195, 164, 123, 0.1)',
                        background: idx % 2 === 0 ? 'rgba(29, 26, 21, 0.4)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '16px 14px', fontWeight: 600, color: 'var(--text)' }}>
                        {row.topic}
                        <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 400, marginTop: '2px' }}>
                          {row.notes}
                        </div>
                      </td>
                      {analyzedYears.map((yr) => (
                        <td key={yr} style={{ padding: '16px 14px', textAlign: 'center', fontFamily: 'var(--mono)' }}>
                          {row.appearances && row.appearances[yr] ? (
                            <span style={{ color: 'var(--sage)', fontWeight: 700 }}>✓</span>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                          )}
                        </td>
                      ))}
                      <td style={{ padding: '16px 14px', textAlign: 'center', fontFamily: 'var(--mono)' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: row.frequencyPercentage === 100 ? 'rgba(229, 122, 68, 0.2)' : 'rgba(195, 164, 123, 0.15)',
                            color: row.frequencyPercentage === 100 ? '#e57a44' : 'var(--pink-bright)',
                          }}
                        >
                          {row.frequencyPercentage}%
                        </span>
                      </td>
                      <td style={{ padding: '16px 14px', fontSize: '12.5px', color: 'var(--muted)' }}>
                        {(row.questionTypes || []).join(' • ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
          <FileText size={44} color="var(--pink)" style={{ opacity: 0.7, margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
            No Examination Papers Uploaded for this Document
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            To view verified recurring examination questions and topic frequencies without synthetic data, upload previous year question papers or select a document with archived papers.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '13px', margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <UploadCloud size={16} />
            Upload PYQ Paper
          </button>
        </div>
      )}
    </div>
  );
}
