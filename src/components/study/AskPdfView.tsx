'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  Sparkles,
  Send,
  FileText,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: number[];
  citations?: { pageNumber: number; snippet: string; score: number }[];
  timestamp: string;
}

export function AskPdfView() {
  const { selectedDocument, selectedDocumentId, setActiveView } = useStudy();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDocument) {
      setMessages([
        {
          id: 'init-' + selectedDocument.id,
          sender: 'ai',
          text: `I am your study assistant grounded directly in **${selectedDocument.title}** (${selectedDocument.pageCount} pages). Ask me anything: derive formulas, generate concept comparisons, or request last-minute exam summaries.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [selectedDocument?.id, selectedDocument?.title, selectedDocument?.pageCount]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q || !q.trim() || isAsking || !selectedDocumentId) return;

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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedQuestions = [
    'Explain the core mechanism in simple language.',
    'List all key mathematical formulas with variable definitions.',
    'What are the most repeated exam derivations in this document?',
    'Create 3 practice conceptual questions for self-testing.',
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span className="badge-tag">RETRIEVAL-AUGMENTED INTELLIGENCE</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 600, color: 'var(--text)', margin: '4px 0 0 0' }}>
            Ask Your Document
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: '2px 0 0 0' }}>
            Active document: <span style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>{selectedDocument?.title || 'Selected Document'}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveView('reader')}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <BookOpen size={14} />
          View PDF Pages
        </button>
      </div>

      {/* Chat Pane */}
      <div
        className="glass-panel"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '14px',
          overflow: 'hidden',
          background: 'rgba(24, 21, 16, 0.85)',
        }}
      >
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: msg.sender === 'user' ? '75%' : '88%',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background:
                    msg.sender === 'user'
                      ? 'var(--pink)'
                      : 'rgba(38, 34, 27, 0.85)',
                  color: msg.sender === 'user' ? 'var(--ink-deep)' : 'var(--text)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(195, 164, 123, 0.2)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  position: 'relative',
                }}
              >
                {msg.text}

                {/* Citation Pills */}
                {msg.sources && msg.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(195, 164, 123, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                      Verified Ground Truth:
                    </span>
                    {msg.sources.map((src) => (
                      <span
                        key={src}
                        onClick={() => setActiveView('reader')}
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--mono)',
                          color: 'var(--pink-bright)',
                          background: 'rgba(195, 164, 123, 0.15)',
                          border: '1px solid rgba(195, 164, 123, 0.3)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        title="Click to view in Reader"
                      >
                        Page {src} ↗
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <span style={{ fontSize: '10.5px', color: 'var(--muted)' }}>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      fontSize: '10.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: 0,
                    }}
                  >
                    {copiedId === msg.id ? <Check size={11} color="var(--sage)" /> : <Copy size={11} />}
                    {copiedId === msg.id ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isAsking && (
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '14px 20px',
                borderRadius: '12px',
                background: 'rgba(38, 34, 27, 0.85)',
                border: '1px solid rgba(195, 164, 123, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13.5px',
                color: 'var(--pink-bright)',
              }}
            >
              <Sparkles size={16} className="animate-spin" />
              Searching vector chunks & generating ground-truth response...
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid rgba(195, 164, 123, 0.12)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            background: 'rgba(29, 26, 21, 0.5)',
          }}
        >
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              style={{
                fontSize: '12px',
                color: 'var(--muted)',
                background: 'rgba(238, 226, 202, 0.05)',
                border: '1px solid rgba(195, 164, 123, 0.16)',
                padding: '5px 12px',
                borderRadius: '14px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(195, 164, 123, 0.18)', background: 'rgba(38, 34, 27, 0.95)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about this document (theorems, equations, definitions)..."
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '24px',
                background: 'rgba(20, 18, 14, 0.8)',
                border: '1px solid rgba(195, 164, 123, 0.3)',
                color: 'var(--text)',
                fontSize: '13.5px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isAsking}
              style={{
                width: '42px',
                height: '42px',
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
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
