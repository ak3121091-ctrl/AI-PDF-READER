'use client';

import React, { useEffect, Suspense } from 'react';
import { StudyProvider, useStudy, StudyView } from '@/contexts/StudyContext';
import { WorkspaceShell } from '@/components/study/WorkspaceShell';
import { BestsellersBookShowcase } from '@/shaders/landing-pages/LandingPages';
import { UploadCloud, Compass, User as UserIcon } from 'lucide-react';

function StudyAppRoot() {
  const { mode, setMode, enterWorkspace, setIsUploadOpen, setSelectedDocumentId } = useStudy();

  // Check URL query params on initial mount (e.g., from old route redirects or direct links)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as StudyView | null;
      const docIdParam = params.get('docId');
      const uploadParam = params.get('upload');
      const workspaceParam = params.get('workspace');
      const savedMode = sessionStorage.getItem('studyforge_mode');

      if (viewParam || docIdParam || uploadParam || workspaceParam === 'true' || savedMode === 'workspace') {
        if (docIdParam) {
          setSelectedDocumentId(docIdParam);
        }
        enterWorkspace(viewParam || 'dashboard', docIdParam || undefined);
        if (uploadParam === 'true') {
          setIsUploadOpen(true);
        }
        // Always clean the browser address bar so the URL is strictly http://localhost:3000/
        window.history.replaceState({}, '', '/');
      }
    }
  }, [enterWorkspace, setIsUploadOpen, setSelectedDocumentId]);

  // Listen for postMessage from the ThreeUI landing page iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'STUDYFORGE_NAVIGATE') {
        const { view, docId, openUpload } = event.data;
        enterWorkspace(view || 'dashboard', docId);
        if (openUpload) {
          setIsUploadOpen(true);
        }
        window.history.replaceState({}, '', '/');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [enterWorkspace, setIsUploadOpen]);

  if (mode === 'workspace') {
    return <WorkspaceShell />;
  }

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Top Navigation Bar Overlay on Landing Page */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 3.2vw',
          pointerEvents: 'none',
        }}
      >
        <div
          onClick={() => enterWorkspace('dashboard')}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--serif)',
            fontSize: '20px',
            letterSpacing: '-0.02em',
            color: 'var(--pink)',
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          title="Enter Study Workspace"
        >
          <span style={{ fontSize: '18px' }}>⚡</span>
          STUDYFORGE AI
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
          <button
            onClick={() => enterWorkspace('dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--text)',
              background: 'rgba(38, 34, 27, 0.85)',
              border: '1px solid rgba(195, 164, 123, 0.35)',
              borderRadius: '9999px',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              transition: 'background 200ms ease, border-color 200ms ease, transform 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(58, 52, 42, 0.95)';
              e.currentTarget.style.borderColor = 'var(--pink)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(38, 34, 27, 0.85)';
              e.currentTarget.style.borderColor = 'rgba(195, 164, 123, 0.35)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <Compass size={14} color="var(--pink)" />
            START STUDYING
          </button>

          <button
            onClick={() => {
              enterWorkspace('documents');
              setIsUploadOpen(true);
            }}
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              letterSpacing: '0.06em',
              cursor: 'pointer',
            }}
          >
            <UploadCloud size={14} />
            UPLOAD PDF
          </button>

          <button
            onClick={() => enterWorkspace('progress')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(38, 34, 27, 0.75)',
              border: '1px solid rgba(195, 164, 123, 0.25)',
              color: 'var(--pink)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
            }}
            title="Profile & Progress"
          >
            <UserIcon size={16} />
          </button>
        </div>
      </header>

      {/* Exact ThreeUI Registered Component */}
      <div className="shader-frame" style={{ width: '100%', height: '100%' }}>
        <BestsellersBookShowcase
          headingFont="iowan-old-style"
          bodyFont="iowan-old-style"
          headingWeight="500"
          bodyWeight="400"
          primaryColor="#c3a47b"
          headingSize={325}
          bodySize={17}
          headingLetterSpacing={-0.085}
        />
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <StudyProvider>
      <Suspense fallback={<div style={{ background: '#29251d', width: '100vw', height: '100vh' }} />}>
        <StudyAppRoot />
      </Suspense>
    </StudyProvider>
  );
}
