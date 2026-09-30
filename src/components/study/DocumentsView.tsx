'use client';

import React from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  FileText,
  UploadCloud,
  Layers,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
} from 'lucide-react';

export function DocumentsView() {
  const {
    documents,
    selectedDocumentId,
    setSelectedDocumentId,
    setActiveView,
    setIsUploadOpen,
  } = useStudy();

  const handleSelect = (docId: string, view: 'reader' | 'summary' | 'quiz' | 'flashcards' | 'topics' = 'reader') => {
    setSelectedDocumentId(docId);
    setActiveView(view);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span className="badge-tag">STUDY LIBRARY</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '4px',
            }}
          >
            Your Study Documents
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginTop: '4px' }}>
            Click any document to inspect its pages, extract formulas, generate flashcards, or quiz your knowledge.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="btn-primary"
          style={{ padding: '10px 22px', fontSize: '12.5px' }}
        >
          <UploadCloud size={15} />
          + Upload PDF
        </button>
      </div>

      {/* Document Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {documents.map((doc) => {
          const isSelected = doc.id === selectedDocumentId;
          return (
            <div
              key={doc.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isSelected
                  ? '1.5px solid var(--pink)'
                  : '1px solid rgba(195, 164, 123, 0.18)',
                boxShadow: isSelected ? '0 0 20px rgba(195, 164, 123, 0.15)' : 'none',
                transition: 'all 200ms ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(195, 164, 123, 0.12)',
                      border: '1px solid rgba(195, 164, 123, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--pink)',
                    }}
                  >
                    <FileText size={20} />
                  </div>

                  {isSelected && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--ink-deep)',
                        background: 'var(--pink)',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => handleSelect(doc.id, 'reader')}
                  style={{
                    fontSize: '16.5px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: '0 0 8px 0',
                    lineHeight: 1.3,
                    cursor: 'pointer',
                  }}
                >
                  {doc.title}
                </h3>

                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                  {doc.fileName}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--muted)',
                    padding: '10px 0',
                    borderTop: '1px solid rgba(195, 164, 123, 0.1)',
                    borderBottom: '1px solid rgba(195, 164, 123, 0.1)',
                    marginBottom: '18px',
                  }}
                >
                  <span>{doc.pageCount} Pages</span>
                  <span>•</span>
                  <span>{(doc.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                  <span>•</span>
                  <span style={{ color: 'var(--sage)', fontWeight: 600 }}>Ready</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => handleSelect(doc.id, 'reader')}
                  className="btn-primary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '11.5px',
                    justifyContent: 'center',
                    borderRadius: '8px',
                  }}
                >
                  <BookOpen size={13} />
                  Read & Ask
                </button>
                <button
                  onClick={() => handleSelect(doc.id, 'summary')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '11.5px',
                    justifyContent: 'center',
                    borderRadius: '8px',
                  }}
                >
                  <Sparkles size={13} />
                  Summary
                </button>
                <button
                  onClick={() => handleSelect(doc.id, 'quiz')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '11.5px',
                    justifyContent: 'center',
                    borderRadius: '8px',
                  }}
                >
                  <Award size={13} />
                  Quiz
                </button>
                <button
                  onClick={() => handleSelect(doc.id, 'flashcards')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '11.5px',
                    justifyContent: 'center',
                    borderRadius: '8px',
                  }}
                >
                  <Layers size={13} />
                  Flashcards
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
