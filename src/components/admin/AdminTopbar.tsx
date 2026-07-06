'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminTopbar() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 32px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexShrink: 0,
    }}>
      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, width: '100%' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search anything..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px 9px 36px',
            border: '1.5px solid #e2e8f0', borderRadius: 10,
            fontSize: 14, color: '#140342', background: '#f8fafc',
            outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Date/Time */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#140342' }}>{timeStr}</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{dateStr}</span>
        </div>

        {/* Notification bell */}
        <button style={{
          position: 'relative', background: '#f8fafc', border: '1.5px solid #e2e8f0',
          borderRadius: 10, width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#64748b', transition: 'background 0.2s',
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span style={{
            position: 'absolute', top: 8, right: 8,
            width: 8, height: 8, borderRadius: '50%',
            background: '#6440FB', border: '2px solid #fff',
          }} />
        </button>

        {/* Quick add user link */}
        <Link href="/admin/users?action=create" className="btn-primary" style={{ padding: '9px 16px', fontSize: 13 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </Link>
      </div>
    </header>
  );
}
