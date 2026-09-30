'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: '28px',
          left: '3.2vw',
          fontFamily: 'var(--serif)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--pink)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>⚡</span> STUDYFORGE AI
      </Link>

      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 32px',
          borderRadius: '16px',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(137, 148, 111, 0.2)',
                color: 'var(--sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              Reset Instructions Sent
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              We have dispatched password recovery instructions to <strong>{email}</strong>. Check your inbox and follow the secure link.
            </p>
            <Link href="/sign-in" className="btn-primary" style={{ width: '100%' }}>
              Return to Sign In
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 600, color: 'var(--text)' }}>
                Reset Your Password
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                Enter your university or student email to receive recovery instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      background: 'rgba(29, 26, 21, 0.7)',
                      border: '1px solid rgba(195, 164, 123, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                  <Mail size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '13.5px' }}>
                Send Reset Link
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link
                href="/sign-in"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: 'var(--muted)',
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
