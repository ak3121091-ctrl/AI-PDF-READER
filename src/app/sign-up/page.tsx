'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { ArrowRight, Lock, Mail, User, GraduationCap, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [field, setField] = useState('Computer Science & Engineering');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUp(name, email, password, field);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('studyforge_mode', 'workspace');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
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
          maxWidth: '460px',
          padding: '36px 32px',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text)' }}>
            Create Your Account
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginTop: '4px' }}>
            Turn textbook PDFs into a personalized learning system
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
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '5px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ashutosh Sharma"
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
              <User size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '5px' }}>
              University / Student Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ashutosh@university.edu"
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

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '5px' }}>
              Major / Study Discipline
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="Computer Science, Electrical, etc."
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
              <GraduationCap size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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
              <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '13.5px' }}
          >
            {loading ? 'Creating Account...' : 'Get Started'}
            <ArrowRight size={15} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '22px' }}>
          Already have an account?{' '}
          <Link href="/sign-in" style={{ color: 'var(--pink-bright)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
