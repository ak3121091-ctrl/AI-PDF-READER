'use client';

import React, { useState, useEffect } from 'react';
import { useStudy, StudyView } from '@/contexts/StudyContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { UploadModal } from '@/components/dashboard/UploadModal';
import { DashboardView } from './DashboardView';
import { DocumentsView } from './DocumentsView';
import { DocumentReaderView } from './DocumentReaderView';
import { AskPdfView } from './AskPdfView';
import { SummaryView } from './SummaryView';
import { TopicsView } from './TopicsView';
import { QuizView } from './QuizView';
import { FlashcardsView } from './FlashcardsView';
import { PyqView } from './PyqView';
import { StudyPlanView } from './StudyPlanView';
import { ProgressView } from './ProgressView';
import {
  UploadCloud,
  Menu,
  X,
} from 'lucide-react';

interface WorkspaceShellProps {
  initialView?: StudyView;
  initialDocId?: string;
}

export function WorkspaceShell({ initialView, initialDocId }: WorkspaceShellProps = {}) {
  const {
    activeView,
    setActiveView,
    setSelectedDocumentId,
    isUploadOpen,
    setIsUploadOpen,
    refreshDocuments,
    exitToLanding,
  } = useStudy();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (initialDocId) {
      setSelectedDocumentId(initialDocId);
    }
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialDocId, initialView, setSelectedDocumentId, setActiveView]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'documents':
        return <DocumentsView />;
      case 'reader':
        return <DocumentReaderView />;
      case 'ask':
        return <AskPdfView />;
      case 'summary':
        return <SummaryView />;
      case 'topics':
        return <TopicsView />;
      case 'quiz':
        return <QuizView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'pyq':
        return <PyqView />;
      case 'study-plan':
        return <StudyPlanView />;
      case 'progress':
        return <ProgressView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--ink)' }}>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 49,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* CANONICAL SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavClick={() => setMobileMenuOpen(false)}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '60px',
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(195, 164, 123, 0.16)',
            background: 'rgba(29, 26, 21, 0.8)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0,
          }}
        >
          {/* Breadcrumb / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only-btn"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'none', // controlled via CSS on desktop
                padding: '4px',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--muted)' }}>Workspace</span>
              <span style={{ color: 'rgba(195, 164, 123, 0.4)' }}>/</span>
              <span style={{ color: 'var(--pink-bright)', fontWeight: 600, textTransform: 'capitalize' }}>
                {activeView.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={exitToLanding}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
            >
              Showcase ↗
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="btn-primary"
              style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '20px' }}
            >
              <UploadCloud size={13} />
              Upload PDF
            </button>
          </div>
        </header>

        {/* View Dynamic Body */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            position: 'relative',
          }}
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Global In-Workspace PDF Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={async (newDocId) => {
          await refreshDocuments();
          if (newDocId) {
            setSelectedDocumentId(newDocId);
          }
          setActiveView('reader');
          setIsUploadOpen(false);
        }}
      />
    </div>
  );
}
