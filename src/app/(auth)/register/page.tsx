"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      const loginRes = await signIn('credentials', { redirect: false, email: formData.email, password: formData.password });
      if (loginRes?.error) { router.push('/login'); } else { router.push('/'); router.refresh(); }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof typeof formData; label: string; type: string; placeholder: string; icon: string }[] = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 9876543210', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  ];

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 900, color: '#140342', marginBottom: 8,
          fontFamily: "'Jost', 'Inter', sans-serif", letterSpacing: '-0.3px',
        }}>Create Your Account 🚀</h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>
          Start your data science journey with LearnzLab.
        </p>
      </div>

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
        {fields.map(f => (
          <div key={f.name} style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              {f.label}
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <input
                type={f.type}
                name={f.name}
                className="auth-input"
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
                required={f.name !== 'phone'}
              />
            </div>
          </div>
        ))}

        {/* Password row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {(['password', 'confirmPassword'] as const).map((fname, idx) => (
            <div key={fname}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                {idx === 0 ? 'Password' : 'Confirm'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name={fname}
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData[fname]}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: idx === 0 ? 40 : 14 }}
                />
                {idx === 0 && (
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
                  }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'} />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Password strength hint */}
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: -16, marginBottom: 20 }}>
          Minimum 6 characters required
        </p>

        <button type="submit" disabled={loading} className="auth-submit-btn">
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Creating account…
            </span>
          ) : 'Create My Account →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 24 }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#6440FB', fontWeight: 700, textDecoration: 'none' }}>
          Sign in →
        </Link>
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
