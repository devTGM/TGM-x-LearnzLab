'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const NAVIGATION = [
  { name: 'Dashboard', href: '/trainer', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { name: 'My Classes', href: '/trainer/classes', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'My Batches', href: '/trainer/batches', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
];

export default function TrainerSidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/trainer' && pathname.startsWith(href));

  return (
    <>
      <style>{`
        .trainer-sidebar {
          width: 260px;
          background: #fff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .trainer-nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; font-weight: 600; font-size: 14px;
          color: #4F547B; transition: all 0.2s;
        }
        .trainer-nav-link:hover { background: #f8fafc; color: #140342; }
        .trainer-nav-link.active { background: #ede9fe; color: #6440FB; }

        /* Mobile bottom nav */
        .trainer-mobile-bottom-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid #e2e8f0;
          z-index: 100;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .trainer-mobile-bottom-nav-inner {
          display: flex; justify-content: space-around; align-items: stretch;
        }
        .trainer-mobile-nav-item {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 3px; padding: 10px 4px; flex: 1;
          text-decoration: none;
          color: #94a3b8; font-size: 10px; font-weight: 600;
          transition: color 0.2s; border: none; background: none;
          cursor: pointer; font-family: inherit;
        }
        .trainer-mobile-nav-item.active { color: #6440FB; }
        .trainer-mobile-nav-item:hover { color: #140342; }

        @media (max-width: 767px) {
          .trainer-sidebar { display: none !important; }
          .trainer-mobile-bottom-nav { display: flex !important; }
          .trainer-mobile-content-pad { padding-bottom: 72px !important; }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .trainer-sidebar { width: 72px !important; }
          .trainer-nav-label { display: none !important; }
          .trainer-sidebar-logo-text { display: none !important; }
          .trainer-user-section { display: none !important; }
          .trainer-sidebar-logo-wrapper { justify-content: center !important; padding: 20px 0 !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="trainer-sidebar">
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #e2e8f0' }}>
          <Link href="/trainer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} className="trainer-sidebar-logo-wrapper">
            <Image src="/logo.png" alt="LearnzLab Logo" width={32} height={32} style={{ borderRadius: 6 }} />
            <div className="trainer-sidebar-logo-text">
              <div style={{ fontWeight: 800, fontSize: 18, color: '#140342', letterSpacing: '-0.5px' }}>LearnzLab</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6440FB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trainer Portal</div>
            </div>
          </Link>
        </div>

        <div style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, paddingLeft: 12 }}>
            <span className="trainer-nav-label">Menu</span>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAVIGATION.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`trainer-nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="trainer-nav-label">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="trainer-user-section" style={{ padding: '20px 16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="trainer-nav-link"
            style={{ width: '100%', background: '#fff1f2', color: '#be123c', border: 'none', cursor: 'pointer' }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="trainer-nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="trainer-mobile-bottom-nav">
        <div className="trainer-mobile-bottom-nav-inner">
          {NAVIGATION.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`trainer-mobile-nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.name.replace('My ', '')}
            </Link>
          ))}
          <button
            className="trainer-mobile-nav-item"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
