'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../database/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (name: string, email: string, pass: string, field: string) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const DEFAULT_USER: User = {
  id: 'user-ashutosh',
  name: 'Ashutosh',
  email: 'ashutosh@university.edu',
  studyField: 'Computer Science & Engineering',
  dailyGoalHours: 3.5,
  examDate: '2026-12-15',
  createdAt: '2026-09-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isLoading: false,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('studyforge_auth_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        localStorage.setItem('studyforge_auth_user', JSON.stringify(DEFAULT_USER));
      }
    } catch (e) {
      console.error('Failed reading user from storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, _pass: string): Promise<boolean> => {
    // In production, connects to Supabase/Auth.js
    const loggedUser: User = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      name: email.split('@')[0] ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : DEFAULT_USER.name,
    };
    setUser(loggedUser);
    localStorage.setItem('studyforge_auth_user', JSON.stringify(loggedUser));
    return true;
  };

  const signUp = async (name: string, email: string, _pass: string, field: string): Promise<boolean> => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name || 'Student',
      email: email,
      studyField: field || 'General Engineering',
      dailyGoalHours: 3.0,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('studyforge_auth_user', JSON.stringify(newUser));
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('studyforge_auth_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('studyforge_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
