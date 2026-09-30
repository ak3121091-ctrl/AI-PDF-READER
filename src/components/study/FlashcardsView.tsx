'use client';

import React, { useState, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Flashcard } from '@/lib/database/schema';

export function FlashcardsView() {
  const { selectedDocument, selectedDocumentId, setActiveView } = useStudy();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCards() {
      if (!selectedDocumentId) return;
      try {
        setLoading(true);
        setIsFlipped(false);
        setCurrentIdx(0);
        const res = await fetch(`/api/documents/${selectedDocumentId}/flashcards`);
        const data = await res.json();
        if (data.flashcards) {
          setCards(data.flashcards);
        }
      } catch (e) {
        console.error('Error fetching flashcards', e);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, [selectedDocumentId]);

  const currentCard = cards[currentIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx((i) => (i + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx((i) => (i - 1 + cards.length) % cards.length);
  };

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    setReviewedCount((c) => c + 1);
    handleNext();
  };

  const toggleMark = (cardId: string) => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <span className="badge-tag">ACTIVE RECALL & SPACED REPETITION</span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(22px, 2.6vw, 32px)',
              fontWeight: 500,
              color: 'var(--text)',
              marginTop: '4px',
            }}
          >
            Concept Flashcards
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginTop: '4px' }}>
            Document: <span style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>{selectedDocument?.title || 'Selected Document'}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
            Reviewed: <strong style={{ color: 'var(--pink-bright)' }}>{reviewedCount}</strong>
          </span>
          <button
            onClick={() => {
              setCurrentIdx(0);
              setIsFlipped(false);
              setReviewedCount(0);
            }}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <RotateCcw size={13} />
            Reset Deck
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
          <Sparkles size={20} className="animate-spin" />
          <span style={{ marginLeft: '10px' }}>Loading memory recall flashcards...</span>
        </div>
      ) : currentCard ? (
        <div>
          {/* Card Meta & Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--pink-bright)' }}>
              Card {currentIdx + 1} of {cards.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                {currentCard.category}
              </span>
              <button
                onClick={() => toggleMark(currentCard.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: markedForReview.has(currentCard.id) ? '#e57a44' : 'var(--muted)',
                  cursor: 'pointer',
                  padding: '2px',
                }}
                title={markedForReview.has(currentCard.id) ? 'Marked for Review' : 'Mark for Review'}
              >
                <Bookmark size={15} fill={markedForReview.has(currentCard.id) ? '#e57a44' : 'none'} />
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', marginBottom: '24px' }}>
            <div
              style={{
                width: `${((currentIdx + 1) / cards.length) * 100}%`,
                height: '100%',
                background: 'var(--pink)',
                borderRadius: '2px',
                transition: 'width 200ms ease',
              }}
            />
          </div>

          {/* 3D Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              perspective: '1200px',
              minHeight: '340px',
              cursor: 'pointer',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '340px',
                transformStyle: 'preserve-3d',
                transition: 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* FRONT (QUESTION) */}
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  borderRadius: '16px',
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(195, 164, 123, 0.25)',
                }}
              >
                <div>
                  <span className="badge-tag">PROMPT / QUESTION</span>
                  <h2
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: '24px',
                      lineHeight: 1.45,
                      color: 'var(--text)',
                      marginTop: '20px',
                    }}
                  >
                    {currentCard.front}
                  </h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(195, 164, 123, 0.15)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Difficulty: <strong style={{ color: 'var(--pink)' }}>{currentCard.difficulty}</strong>
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--pink-bright)', fontWeight: 600 }}>
                    CLICK TO FLIP ↻
                  </span>
                </div>
              </div>

              {/* BACK (ANSWER) */}
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '16px',
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(29, 26, 21, 0.98)',
                  border: '1px solid var(--pink)',
                }}
              >
                <div>
                  <span className="badge-tag" style={{ background: 'rgba(137, 148, 111, 0.15)', color: 'var(--sage)', borderColor: 'var(--sage)' }}>
                    ACADEMIC EXPLANATION
                  </span>
                  <p
                    style={{
                      fontSize: '16px',
                      lineHeight: 1.7,
                      color: 'var(--text)',
                      marginTop: '20px',
                    }}
                  >
                    {currentCard.back}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(195, 164, 123, 0.15)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Ground Truth from study material
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--pink-bright)', fontWeight: 600 }}>
                    CLICK TO FLIP ↺
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Rating Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={() => handleRate('again')}
              className="btn-secondary"
              style={{ padding: '12px', fontSize: '12.5px', justifyContent: 'center', borderColor: '#e57a44', color: '#e57a44' }}
            >
              Again (1d)
            </button>
            <button
              onClick={() => handleRate('hard')}
              className="btn-secondary"
              style={{ padding: '12px', fontSize: '12.5px', justifyContent: 'center', borderColor: 'var(--pink)' }}
            >
              Hard (3d)
            </button>
            <button
              onClick={() => handleRate('good')}
              className="btn-secondary"
              style={{ padding: '12px', fontSize: '12.5px', justifyContent: 'center', borderColor: 'var(--sage)', color: 'var(--sage)' }}
            >
              Good (7d)
            </button>
            <button
              onClick={() => handleRate('easy')}
              className="btn-primary"
              style={{ padding: '12px', fontSize: '12.5px', justifyContent: 'center' }}
            >
              Easy (14d)
            </button>
          </div>

          {/* Deck Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12.5px' }}
            >
              <ChevronLeft size={16} />
              Previous Card
            </button>
            <button
              onClick={handleNext}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12.5px' }}
            >
              Next Card
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          No flashcards available for this document.
        </div>
      )}
    </div>
  );
}
