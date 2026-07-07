'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminTopbar() {
  const { data: session } = useSession();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <>
      <style>{`
        .topbar {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
        }
        .topbar-search {
          position: relative;
          max-width: 320px;
          width: 100%;
        }
        .topbar-search-input {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #140342;
          background: #f8fafc;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .topbar-search-input:focus { border-color: #6440FB; }
        .topbar-right { display: flex; align-items: center; gap: 16px; }
        .topbar-datetime { text-align: right; display: flex; flex-direction: column; line-height: 1.3; }
        .topbar-add-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #6440FB; color: #fff; border: none;
          padding: 9px 16px; border-radius: 10px; font-size: 13px;
          font-weight: 700; cursor: pointer; font-family: inherit;
          text-decoration: none; white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
        }
        .topbar-add-btn:hover { background: #5027fa; color: #fff; transform: translateY(-1px); }

        @media (max-width: 767px) {
          .topbar {
            padding: 0 16px 0 64px;
            height: 56px;
          }
          .topbar-search { display: none; }
          .topbar-datetime { display: none !important; }
          .topbar-notification-btn { display: none !important; }
          .topbar-add-btn { padding: 8px 12px; font-size: 12px; }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .topbar { padding: 0 24px; }
          .topbar-search { max-width: 200px; }
          .topbar-datetime { display: none !important; }
        }
      `}</style>

      <header className="topbar">
        {/* Search */}
        <div className="topbar-search">
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="topbar-search-input"
          />
        </div>

        {/* Right side */}
        <div className="topbar-right">
          {/* Date/Time */}
          <div className="topbar-datetime">
            <span style={{ fontSize: 13, fontWeight: 700, color: '#140342' }}>{timeStr}</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{dateStr}</span>
          </div>

          {/* Notification bell */}
          <button className="topbar-notification-btn" style={{
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
          <Link href="/admin/users?action=create" className="topbar-add-btn">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </Link>
        </div>
      </header>
    </>
  );
}
