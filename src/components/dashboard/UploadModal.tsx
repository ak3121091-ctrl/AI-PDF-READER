'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (docId?: string) => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('Engineering Physics');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusStep, setStatusStep] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successDocId, setSuccessDocId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selected: File) => {
    setError(null);
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setError('Invalid file format. Please upload an academic PDF document.');
      return;
    }
    const maxSizeBytes = 20 * 1024 * 1024; // 20 MB
    if (selected.size > maxSizeBytes) {
      setError('File size exceeds the 20 MB limit. Please optimize or upload a smaller chapter.');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setUploadProgress(15);
    setStatusStep('UPLOADING DOCUMENT...');

    try {
      // Progress animation
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressTimer);
            return prev;
          }
          return prev + 12;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);

      setTimeout(() => {
        setStatusStep('EXTRACTING TEXT & DETECTING PAGES...');
      }, 600);

      setTimeout(() => {
        setStatusStep('CHUNKING & INDEXING KNOWLEDGE BASE...');
      }, 1200);

      setTimeout(() => {
        setStatusStep('GENERATING AI SUMMARY & STUDY ASSETS...');
      }, 1800);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressTimer);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to process PDF.');
      }

      setUploadProgress(100);
      setStatusStep('DOCUMENT READY!');
      setSuccessDocId(data.document.id);
      if (onUploadSuccess) onUploadSuccess(data.document.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while uploading. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleOpenDocument = () => {
    if (successDocId) {
      onClose();
      router.push(`/documents/${successDocId}`);
    }
  };

  const reset = () => {
    setFile(null);
    setError(null);
    setIsProcessing(false);
    setUploadProgress(0);
    setStatusStep('');
    setSuccessDocId(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 13, 10, 0.82)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'rgba(38, 34, 27, 0.94)',
          border: '1px solid rgba(195, 164, 123, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text)' }}>
              Upload Study PDF
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
              Turn notes or textbooks into an interactive learning system
            </p>
          </div>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Success State */}
        {successDocId ? (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(137, 148, 111, 0.2)',
                border: '1px solid rgba(137, 148, 111, 0.5)',
                color: 'var(--sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--text)', marginBottom: '8px' }}>
              Study Material Generated!
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', maxWidth: '380px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              Your document has been parsed into high-yield summaries, formula sheets, diagnostic MCQs, and flashcard decks.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={reset} className="btn-secondary">
                Upload Another
              </button>
              <button onClick={handleOpenDocument} className="btn-primary">
                Open in Document Reader
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          /* Processing State */
          <div style={{ padding: '28px 12px', textAlign: 'center' }}>
            <div style={{ marginBottom: '18px' }}>
              <Loader2 size={36} color="var(--pink)" className="animate-spin" style={{ margin: '0 auto', animation: 'spin 1.2s linear infinite' }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.08em', color: 'var(--pink-bright)', marginBottom: '10px' }}>
              {statusStep}
            </div>

            {/* Ascii-style visual progress bar */}
            <div
              style={{
                background: 'rgba(29, 26, 21, 0.8)',
                border: '1px solid rgba(195, 164, 123, 0.25)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                fontFamily: 'var(--mono)',
                fontSize: '13px',
                color: 'var(--text)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>UPLOADING</span>
                <span>{uploadProgress}%</span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    background: 'var(--pink)',
                    borderRadius: '4px',
                    transition: 'width 250ms ease',
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
              Analyzing text structure, extracting equations, and indexing chapters...
            </p>
          </div>
        ) : (
          /* Normal File Drop State */
          <div>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--pink)' : 'rgba(195, 164, 123, 0.3)'}`,
                borderRadius: '12px',
                padding: '36px 20px',
                textAlign: 'center',
                background: isDragging ? 'rgba(195, 164, 123, 0.08)' : 'rgba(29, 26, 21, 0.5)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(195, 164, 123, 0.15)',
                  color: 'var(--pink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <UploadCloud size={26} />
              </div>
              <h4 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                DROP YOUR PDF
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '14px' }}>
                or click to browse from your device
              </p>
              <div
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--mono)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  color: 'var(--pink-bright)',
                  background: 'rgba(195, 164, 123, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(195, 164, 123, 0.2)',
                }}
              >
                PDF • MAX 20 MB
              </div>
            </div>

            {/* Selected File Details */}
            {file && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'rgba(195, 164, 123, 0.1)',
                  border: '1px solid rgba(195, 164, 123, 0.25)',
                  borderRadius: '8px',
                  marginTop: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <FileText size={18} color="var(--pink)" style={{ flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  style={{ color: 'var(--muted)', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Subject Selector */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '6px' }}>
                Subject / Category
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(29, 26, 21, 0.7)',
                  border: '1px solid rgba(195, 164, 123, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                <option value="Engineering Physics">Engineering Physics</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Mathematics III">Mathematics III</option>
                <option value="Digital Electronics">Digital Electronics</option>
                <option value="Other / General">Other / General Notes</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'rgba(169, 99, 70, 0.15)',
                  border: '1px solid rgba(169, 99, 70, 0.4)',
                  borderRadius: '8px',
                  color: '#e28878',
                  fontSize: '12.5px',
                  marginTop: '16px',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file}
                className="btn-primary"
                style={{ opacity: file ? 1 : 0.5, cursor: file ? 'pointer' : 'not-allowed' }}
              >
                <Sparkles size={14} />
                Process & Study
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
