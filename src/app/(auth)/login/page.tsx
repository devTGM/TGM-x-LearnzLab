"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get('notice') === 'invite-only') {
      setNotice('LearnzLab is invite-only. Please contact your administrator for access.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', { redirect: false, email, password });
      if (res?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        // Fetch session to redirect by role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role;
        if (role === 'ADMIN') router.push('/admin');
        else if (role === 'TRAINER') router.push('/trainer');
        else router.push('/student');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 30, fontWeight: 900, color: '#140342', marginBottom: 8,
          fontFamily: "'Jost', 'Inter', sans-serif", letterSpacing: '-0.3px',
        }}>Welcome Back 👋</h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>
          Sign in to your LearnzLab account to continue.
        </p>
      </div>

      {/* Invite-only notice */}
      {notice && (
        <div style={{
          background: '#fffbeb', border: '1.5px solid #fde68a', color: '#92400e',
          borderRadius: 12, padding: '12px 16px', fontSize: 14,
          marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {notice}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c',
          borderRadius: 12, padding: '12px 16px', fontSize: 14,
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input type="email" className="auth-input" placeholder="you@learnzlab.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input type={showPassword ? 'text' : 'password'} className="auth-input"
              placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="current-password" style={{ paddingRight: 48 }} />
            <button type="button" onClick={() => setShowPassword(p => !p)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
            }}>
              {showPassword
                ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29" /></svg>
                : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              }
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <a href="#" style={{ fontSize: 13, color: '#6440FB', fontWeight: 600, textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>

        <button type="submit" disabled={loading} className="auth-submit-btn">
          {loading
            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Signing in…
              </span>
            : 'Sign In →'
          }
        </button>
      </form>

      {/* Invite-only footer note */}
      <div style={{
        marginTop: 32, padding: '14px 18px',
        background: '#f8f9fc', borderRadius: 12,
        border: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2} style={{ flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
          <strong style={{ color: '#374151' }}>Invite-only platform.</strong> New accounts are created by the administrator. Contact your admin for access.
        </p>
      </div>
    </>
  );
}
