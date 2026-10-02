'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { useStudy, StudyView } from '@/contexts/StudyContext';
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
  Flame,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  onOpenUpload?: () => void;
  onNavClick?: (view: StudyView) => void;
}

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen, onOpenUpload, onNavClick }: SidebarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    activeView,
    setActiveView,
    selectedDocument,
    selectedDocumentId,
    setSelectedDocumentId,
    documents,
    setIsUploadOpen,
    exitToLanding,
  } = useStudy();

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
    if (onNavClick) {
      onNavClick(view);
    }
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleOpenUpload = () => {
    if (onOpenUpload) {
      onOpenUpload();
    } else {
      setIsUploadOpen(true);
    }
  };

  const handleExit = () => {
    exitToLanding();
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      router.push('/');
    }
  };

  return (
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
            onClick={() => handleNavClick('dashboard')}
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
            onClick={handleExit}
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
          <span
            style={{
              fontSize: '10.5px',
              color: 'var(--muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: '6px',
            }}
          >
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
          onClick={handleOpenUpload}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '12px',
            justifyContent: 'center',
            marginBottom: '14px',
            cursor: 'pointer',
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
  );
}
