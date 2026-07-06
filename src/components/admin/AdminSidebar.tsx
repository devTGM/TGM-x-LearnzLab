'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Courses',
    href: '/admin/courses',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    label: 'Batches',
    href: '/admin/batches',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    label: 'Classes',
    href: '/admin/classes',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    label: 'Announcements',
    href: '/admin/announcements',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <>
      <style>{`
        .admin-sidebar {
          width: ${collapsed ? '72px' : '260px'};
          min-height: 100vh;
          background: #140342;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 10px;
          margin: 2px 12px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-nav-link:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .sidebar-nav-link.active {
          background: #6440FB;
          color: #fff;
          box-shadow: 0 4px 16px rgba(100,64,251,0.4);
        }
        .sidebar-nav-link svg {
          flex-shrink: 0;
        }
        .sign-out-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 10px;
          margin: 2px 12px 16px;
          color: rgba(255,255,255,0.5);
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          overflow: hidden;
          width: calc(100% - 24px);
          text-align: left;
          transition: background 0.2s, color 0.2s;
        }
        .sign-out-btn:hover {
          background: rgba(239,68,68,0.15);
          color: #f87171;
        }
        .collapse-btn {
          background: rgba(255,255,255,0.08);
          border: none;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }
        .collapse-btn:hover { background: rgba(255,255,255,0.16); color: #fff; }
      `}</style>

      <aside className="admin-sidebar">
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 12,
        }}>
          {!collapsed && (
            <Image src="/logo.png" alt="LearnzLab" width={130} height={44}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          )}
          {collapsed && (
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#6440FB', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18,
            }}>L</div>
          )}
          <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d={collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: 4 }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-link ${isActive(item.href) ? 'active' : ''}`}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>

        {/* User + Sign Out */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
          {!collapsed && session?.user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', margin: '0 12px 8px',
              background: 'rgba(255,255,255,0.06)', borderRadius: 10,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: '#6440FB', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13,
                flexShrink: 0,
              }}>
                {session.user.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Administrator</div>
              </div>
            </div>
          )}
          <button className="sign-out-btn" onClick={() => signOut({ callbackUrl: '/login' })}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>
    </>
  );
}
