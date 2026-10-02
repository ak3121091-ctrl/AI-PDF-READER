'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  HelpCircle,
  Award,
  Layers,
  FileText,
  Calendar,
  Search,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import { DocumentPage, Topic } from '@/lib/database/schema';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: number[];
  citations?: { pageNumber: number; snippet: string; score: number }[];
  timestamp: string;
}

export function DocumentReaderView() {
  const { selectedDocument, selectedDocumentId, setActiveView } = useStudy();

  const [pages, setPages] = useState<DocumentPage[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(true);
  const [readerMode, setReaderMode] = useState<'text' | 'original'>('text');

  // Ask PDF Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadDocumentData() {
      if (!selectedDocumentId) return;
      try {
        setLoading(true);
        const [docRes, topRes] = await Promise.all([
          fetch(`/api/documents/${selectedDocumentId}`),
          fetch(`/api/documents/${selectedDocumentId}/topics`),
        ]);

        const docData = await docRes.json();
        const topData = await topRes.json();

        if (docData.pages && docData.pages.length > 0) {
          setPages(docData.pages);
          setCurrentPageNum(1);
        }
        if (topData.topics) {
          setTopics(topData.topics);
        }

        // Initialize welcome message for this document
        setMessages([
          {
            id: 'msg-init-' + selectedDocumentId,
            sender: 'ai',
            text: `Hello! I have indexed **${selectedDocument?.title || 'your document'}** across all pages. You can ask me to explain complex formulas, summarize key theorems, or generate exam practice questions.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (e) {
        console.error('Failed to load document reader data', e);
      } finally {
        setLoading(false);
      }
    }

    loadDocumentData();
  }, [selectedDocumentId, selectedDocument?.title]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q || !q.trim() || isAsking) return;

    const userMsg: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const res = await fetch(`/api/documents/${selectedDocumentId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q.trim() }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: data.answer,
        sources: data.sources || [],
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'ai',
          text: `⚠️ **Processing Notice:** ${err.message || 'Unable to retrieve answer. Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const currentPage = pages.find((p) => p.pageNumber === currentPageNum) || pages[0];

  const suggestedPrompts = [
    'Explain this topic in simple language.',
    'What are the important formulas?',
    'Give me examples.',
    'What should I revise before the exam?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', minHeight: '680px' }}>
      {/* Top Document Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          background: 'rgba(29, 26, 21, 0.7)',
          border: '1px solid rgba(195, 164, 123, 0.18)',
          borderRadius: '12px 12px 0 0',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--pink)" />
            <h2 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              {selectedDocument?.title || 'Selected Document'}
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            ({pages.length} Pages • {(selectedDocument ? selectedDocument.fileSize / (1024 * 1024) : 0).toFixed(1)} MB)
          </span>
        </div>

        {/* Workspace Cross-Module Action Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveView('summary')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
          >
            <Sparkles size={13} color="var(--pink)" />
            Summary
          </button>
          <button
            onClick={() => setActiveView('topics')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
          >
            <Layers size={13} color="var(--pink-bright)" />
            Topics
          </button>
          <button
            onClick={() => setActiveView('quiz')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
          >
            <Award size={13} color="var(--pink)" />
            Quiz
          </button>
          <button
            onClick={() => setActiveView('flashcards')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
          >
            <Layers size={13} color="var(--sage)" />
            Flashcards
          </button>
          <button
            onClick={() => setActiveView('pyq')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
          >
            <Calendar size={13} color="#e57a44" />
            PYQs
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Layout */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 1fr)',
          border: '1px solid rgba(195, 164, 123, 0.18)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          background: 'rgba(20, 18, 14, 0.65)',
        }}
      >
        {/* LEFT PANE: Document Pages Reader */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(195, 164, 123, 0.18)',
            background: 'rgba(24, 21, 16, 0.85)',
          }}
        >
          {/* Reader Sub-Toolbar */}
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(195, 164, 123, 0.14)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(29, 26, 21, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                disabled={currentPageNum <= 1}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--pink-bright)' }}>
                Page {currentPageNum} of {pages.length || 1}
              </span>
              <button
                onClick={() => setCurrentPageNum((p) => Math.min(pages.length, p + 1))}
                disabled={currentPageNum >= pages.length}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Reader Mode Toggle */}
              <div style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(195, 164, 123, 0.15)' }}>
                <button
                  onClick={() => setReaderMode('text')}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: readerMode === 'text' ? 'rgba(195, 164, 123, 0.3)' : 'transparent',
                    color: readerMode === 'text' ? 'var(--pink-bright)' : 'var(--muted)',
                    fontWeight: readerMode === 'text' ? 600 : 400,
                  }}
                >
                  Text
                </button>
                <button
                  onClick={() => setReaderMode('original')}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: readerMode === 'original' ? 'rgba(195, 164, 123, 0.3)' : 'transparent',
                    color: readerMode === 'original' ? 'var(--pink-bright)' : 'var(--muted)',
                    fontWeight: readerMode === 'original' ? 600 : 400,
                  }}
                >
                  Original PDF
                </button>
              </div>

              <a
                href={`/api/documents/${selectedDocumentId}/file`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Open Original PDF in New Tab"
              >
                <FileText size={12} color="var(--pink)" />
                <span>Open Tab</span>
              </a>

              {readerMode === 'text' && (
                <>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                    className="btn-secondary"
                    style={{ padding: '4px 8px' }}
                    title="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--muted)', minWidth: '40px', textAlign: 'center' }}>
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                    className="btn-secondary"
                    style={{ padding: '4px 8px' }}
                    title="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Document Content Display */}
          {readerMode === 'original' ? (
            <div style={{ flex: 1, height: '100%', position: 'relative', background: '#14120e' }}>
              <iframe
                src={`/api/documents/${selectedDocumentId}/file`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Original PDF Document"
              />
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--muted)', margin: 'auto' }}>
                  <Sparkles size={18} className="animate-spin" />
                  Loading extracted PDF pages...
                </div>
              ) : currentPage ? (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '740px',
                    background: '#fcfbf8',
                    color: '#1a1815',
                    padding: '40px 48px',
                    borderRadius: '6px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    fontSize: `${(14.5 * zoomLevel) / 100}px`,
                    lineHeight: 1.7,
                    fontFamily: 'var(--serif)',
                    transformOrigin: 'top center',
                    minHeight: '600px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #e2ddd0',
                      paddingBottom: '10px',
                      marginBottom: '20px',
                      fontSize: '11px',
                      color: '#7a7265',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    <span>{selectedDocument?.fileName || 'Document.pdf'}</span>
                    <span>Page {currentPage.pageNumber}</span>
                  </div>

                  <div style={{ whiteSpace: 'pre-wrap', color: '#24201a' }}>
                    {currentPage.text}
                  </div>
                </div>
              ) : (
                <div style={{ margin: 'auto', color: 'var(--muted)', fontSize: '14px' }}>
                  No page content available.
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANE: Integrated Ask PDF AI Assistant */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(29, 26, 21, 0.95)',
          }}
        >
          {/* AI Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(195, 164, 123, 0.16)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(38, 34, 27, 0.6)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(195, 164, 123, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pink)',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
                AI STUDY ASSISTANT
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Ground-truth citations from {selectedDocument?.title || 'document'}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: msg.sender === 'user' ? '82%' : '92%',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background:
                      msg.sender === 'user'
                        ? 'var(--pink)'
                        : 'rgba(38, 34, 27, 0.85)',
                    color: msg.sender === 'user' ? 'var(--ink-deep)' : 'var(--text)',
                    border:
                      msg.sender === 'user'
                        ? 'none'
                        : '1px solid rgba(195, 164, 123, 0.2)',
                    fontSize: '13.5px',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}

                  {/* Ground Truth Citation Badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(195, 164, 123, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                        Source:
                      </span>
                      {msg.sources.map((src) => (
                        <button
                          key={src}
                          onClick={() => setCurrentPageNum(src)}
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--mono)',
                            color: 'var(--pink-bright)',
                            background: 'rgba(195, 164, 123, 0.15)',
                            border: '1px solid rgba(195, 164, 123, 0.3)',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          title={`Jump to Page ${src}`}
                        >
                          Page {src}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '10.5px',
                    color: 'var(--muted)',
                    marginTop: '4px',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isAsking && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'rgba(38, 34, 27, 0.85)',
                  border: '1px solid rgba(195, 164, 123, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--pink-bright)',
                }}
              >
                <Sparkles size={14} className="animate-spin" />
                Searching relevant chunks & synthesizing answer...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid rgba(195, 164, 123, 0.12)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              background: 'rgba(29, 26, 21, 0.5)',
            }}
          >
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                style={{
                  fontSize: '11.5px',
                  color: 'var(--muted)',
                  background: 'rgba(238, 226, 202, 0.06)',
                  border: '1px solid rgba(195, 164, 123, 0.18)',
                  padding: '4px 9px',
                  borderRadius: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(195, 164, 123, 0.18)', background: 'rgba(38, 34, 27, 0.9)' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about formulas, derivations, or concepts..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '20px',
                  background: 'rgba(20, 18, 14, 0.8)',
                  border: '1px solid rgba(195, 164, 123, 0.28)',
                  color: 'var(--text)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isAsking}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--pink)',
                  color: 'var(--ink-deep)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputQuery.trim() && !isAsking ? 'pointer' : 'default',
                  opacity: inputQuery.trim() && !isAsking ? 1 : 0.45,
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
