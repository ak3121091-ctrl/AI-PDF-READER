'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document, StudyTask, UserProgress } from '@/lib/database/schema';

export type StudyView =
  | 'dashboard'
  | 'documents'
  | 'reader'
  | 'summary'
  | 'ask'
  | 'topics'
  | 'quiz'
  | 'flashcards'
  | 'pyq'
  | 'study-plan'
  | 'progress';

export type AppMode = 'landing' | 'workspace';

interface StudyContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeView: StudyView;
  setActiveView: (view: StudyView) => void;
  selectedDocumentId: string;
  selectedDocument: Document | null;
  setSelectedDocumentId: (id: string) => void;
  documents: Document[];
  loadingDocuments: boolean;
  refreshDocuments: () => Promise<void>;
  isUploadOpen: boolean;
  setIsUploadOpen: (open: boolean) => void;
  enterWorkspace: (view?: StudyView, docId?: string) => void;
  exitToLanding: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('landing');
  const [activeView, setActiveView] = useState<StudyView>('dashboard');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('engineering-physics');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(true);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const refreshDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.documents && Array.isArray(data.documents)) {
        setDocuments(data.documents);
        // If selected document is not in list or none selected, pick the first
        if (!selectedDocumentId && data.documents.length > 0) {
          setSelectedDocumentId(data.documents[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    refreshDocuments();
    if (typeof window !== 'undefined') {
      const savedMode = sessionStorage.getItem('studyforge_mode') as AppMode | null;
      if (savedMode === 'workspace') {
        setMode('workspace');
      }
    }
  }, []);

  const selectedDocument =
    documents.find((d) => d.id === selectedDocumentId) || documents[0] || null;

  const enterWorkspace = (view: StudyView = 'dashboard', docId?: string) => {
    if (docId) {
      setSelectedDocumentId(docId);
    }
    setActiveView(view);
    setMode('workspace');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studyforge_mode', 'workspace');
    }
  };

  const exitToLanding = () => {
    setMode('landing');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studyforge_mode', 'landing');
    }
  };

  return (
    <StudyContext.Provider
      value={{
        mode,
        setMode,
        activeView,
        setActiveView,
        selectedDocumentId,
        selectedDocument,
        setSelectedDocumentId,
        documents,
        loadingDocuments,
        refreshDocuments,
        isUploadOpen,
        setIsUploadOpen,
        enterWorkspace,
        exitToLanding,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
