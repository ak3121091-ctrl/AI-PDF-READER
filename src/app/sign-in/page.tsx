'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { ArrowRight, Lock, Mail, Sparkles, AlertCircle } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('ashutosh@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('studyforge_mode', 'workspace');
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate.');
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    await signIn('ashutosh@university.edu', 'demo123');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studyforge_mode', 'workspace');
    }
    router.push('/');
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
      {/* Background brand link */}
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
          maxWidth: '440px',
          padding: '36px 32px',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(195, 164, 123, 0.15)',
              color: 'var(--pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <Lock size={20} />
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text)' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginTop: '4px' }}>
            Access your AI study system, documents and quizzes
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(169, 99, 70, 0.15)',
              border: '1px solid rgba(169, 99, 70, 0.4)',
              borderRadius: '8px',
              color: '#e28878',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
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
                  padding: '11px 14px 11px 38px',
                  background: 'rgba(29, 26, 21, 0.7)',
                  border: '1px solid rgba(195, 164, 123, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Mail size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)' }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--pink)', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  background: 'rgba(29, 26, 21, 0.7)',
                  border: '1px solid rgba(195, 164, 123, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '13.5px', marginBottom: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={handleDemoSignIn}
            className="btn-secondary"
            style={{ width: '100%', padding: '11px', fontSize: '12.5px', borderColor: 'rgba(195, 164, 123, 0.3)' }}
          >
            <Sparkles size={14} color="var(--pink)" />
            Continue as Ashutosh (Demo Account)
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '24px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
