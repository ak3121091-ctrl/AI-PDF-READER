'use client';

import React, { useState } from 'react';
import { useStudy, StudyView } from '@/contexts/StudyContext';
import { useAuth } from '@/lib/auth/authContext';
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
  Compass,
  FileText,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  Award,
  Calendar,
  TrendingUp,
  UploadCloud,
  ChevronDown,
  User as UserIcon,
  Flame,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export function WorkspaceShell() {
  const { user } = useAuth();
  const {
    activeView,
    setActiveView,
    selectedDocument,
    selectedDocumentId,
    setSelectedDocumentId,
    documents,
    isUploadOpen,
    setIsUploadOpen,
    refreshDocuments,
    exitToLanding,
  } = useStudy();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);

  const navItems: { key: StudyView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <Compass size={17} /> },
    { key: 'documents', label: 'Documents', icon: <FileText size={17} /> },
    { key: 'reader', label: 'Document Reader', icon: <BookOpen size={17} /> },
    { key: 'summary', label: 'AI Summary', icon: <Sparkles size={17} /> },
    { key: 'ask', label: 'Ask Your PDF', icon: <HelpCircle size={17} />, badge: 'RAG' },
    { key: 'topics', label: 'Important Topics', icon: <Layers size={17} /> },
    { key: 'quiz', label: 'AI Quiz', icon: <Award size={17} /> },
    { key: 'flashcards', label: 'Flashcards', icon: <Layers size={17} /> },
    { key: 'pyq', label: 'PYQ Analyzer', icon: <Calendar size={17} /> },
    { key: 'study-plan', label: 'Study Plan', icon: <Calendar size={17} /> },
    { key: 'progress', label: 'Progress', icon: <TrendingUp size={17} /> },
  ];

  const handleNavClick = (view: StudyView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

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

      {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      <aside
        className={`workspace-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          flexShrink: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(24, 21, 16, 0.98)',
          borderRight: '1px solid rgba(195, 164, 123, 0.18)',
          zIndex: 50,
        }}
      >
        <div>
          {/* Brand Logo & Showcase Link */}
          <div
            style={{
              padding: '20px 22px',
              borderBottom: '1px solid rgba(195, 164, 123, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              onClick={() => setActiveView('dashboard')}
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--pink)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ fontSize: '16px' }}>⚡</span>
              STUDYFORGE AI
            </div>

            <button
              onClick={exitToLanding}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Return to 3D Book Showcase"
            >
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Active Document Selector Pill */}
          <div style={{ padding: '14px 18px', position: 'relative' }}>
            <span style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
              Active Document Context
            </span>
            <div
              onClick={() => setDocDropdownOpen(!docDropdownOpen)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                background: 'rgba(38, 34, 27, 0.85)',
                border: '1px solid rgba(195, 164, 123, 0.28)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} color="var(--pink-bright)" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {selectedDocument?.title || 'Select a document...'}
                </span>
              </div>
              <ChevronDown size={14} color="var(--muted)" style={{ flexShrink: 0 }} />
            </div>

            {/* Document Selector Dropdown Menu */}
            {docDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '74px',
                  left: '18px',
                  right: '18px',
                  background: 'rgba(29, 26, 21, 0.98)',
                  border: '1px solid rgba(195, 164, 123, 0.35)',
                  borderRadius: '10px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                  padding: '6px',
                  zIndex: 80,
                  maxHeight: '260px',
                  overflowY: 'auto',
                }}
              >
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocumentId(doc.id);
                      setDocDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: doc.id === selectedDocumentId ? 'rgba(195, 164, 123, 0.18)' : 'transparent',
                      color: doc.id === selectedDocumentId ? 'var(--pink-bright)' : 'var(--text)',
                      fontSize: '12px',
                      fontWeight: doc.id === selectedDocumentId ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileText size={12} color="var(--pink)" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Items List */}
          <nav style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map((item) => {
              const isActive = activeView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'rgba(195, 164, 123, 0.18)' : 'transparent',
                    color: isActive ? 'var(--pink-bright)' : 'var(--muted)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 140ms ease',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text)';
                      e.currentTarget.style.background = 'rgba(238, 226, 202, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--muted)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isActive ? 'var(--pink-bright)' : 'inherit' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: 'var(--ink-deep)',
                        background: 'var(--pink)',
                        padding: '1px 6px',
                        borderRadius: '8px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 18px', borderTop: '1px solid rgba(195, 164, 123, 0.14)' }}>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '12px',
              justifyContent: 'center',
              marginBottom: '14px',
            }}
          >
            <UploadCloud size={14} />
            Upload PDF
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(195, 164, 123, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--pink)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text)' }}>
                {user?.name || 'Ashutosh'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#e57a44', fontWeight: 600 }}>
              <Flame size={13} fill="#e57a44" />
              <span>7d</span>
            </div>
          </div>
        </div>
      </aside>

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
                display: 'none', // controlled via CSS in desktop
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
        onUploadSuccess={async () => {
          await refreshDocuments();
          setActiveView('reader');
        }}
      />
    </div>
  );
}
