'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import {
  BookOpen,
  LayoutDashboard,
  CalendarCheck,
  Award,
  User as UserIcon,
  UploadCloud,
  LogOut,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  onOpenUpload?: () => void;
}

export function Navbar({ onOpenUpload }: NavbarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/documents/engineering-physics', label: 'Document Reader', icon: BookOpen },
    { href: '/study-plan', label: 'Study Plan', icon: CalendarCheck },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        background: 'rgba(33, 29, 23, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(195, 164, 123, 0.18)',
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--serif)',
            fontSize: '19px',
            fontWeight: 600,
            color: 'var(--pink)',
            letterSpacing: '-0.02em',
          }}
        >
          <span>⚡</span>
          STUDYFORGE AI
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href.startsWith('/documents') && pathname.startsWith('/documents'));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  color: isActive ? 'var(--pink-bright)' : 'var(--muted)',
                  background: isActive ? 'rgba(195, 164, 123, 0.14)' : 'transparent',
                  border: isActive ? '1px solid rgba(195, 164, 123, 0.28)' : '1px solid transparent',
                  transition: 'all 160ms ease',
                }}
              >
                <Icon size={15} color={isActive ? 'var(--pink)' : 'var(--muted)'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '12.5px',
            }}
          >
            <UploadCloud size={15} />
            Upload PDF
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid rgba(195, 164, 123, 0.18)' }}>
          <Link
            href="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text)',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(195, 164, 123, 0.2)',
                border: '1px solid rgba(195, 164, 123, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pink-bright)',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{user?.name || 'Ashutosh'}</span>
          </Link>

          <button
            onClick={signOut}
            style={{
              color: 'var(--muted)',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
