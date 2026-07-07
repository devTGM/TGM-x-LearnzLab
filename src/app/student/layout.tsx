'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Dashboard', href: '/student', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'My Batches', href: '/student/batches', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Classes', href: '/student/classes', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { name: 'Assignments', href: '/student/assignments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Report Card', href: '/student/report-card', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== '/student' && pathname.startsWith(href));

  return (
    <>
      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        .admin-content-wrapper {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
        .admin-sidebar {
          width: 280px;
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
        .admin-sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .admin-logo {
          font-size: 24px;
          font-weight: 900;
          color: #6440FB;
          margin: 0;
          font-family: 'Jost', sans-serif;
        }
        .admin-nav {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #64748b;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 14px;
        }
        .admin-nav-item:hover, .admin-nav-item.active {
          background: #f0eeff;
          color: #6440FB;
        }
        .admin-nav-icon { width: 20px; height: 20px; flex-shrink: 0; }
        .admin-page-header { margin-bottom: 28px; }
        .admin-page-title {
          font-size: 26px; font-weight: 900; color: #140342;
          font-family: 'Jost', 'Inter', sans-serif; letter-spacing: -0.3px; margin: 0 0 4px;
        }
        .admin-page-subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .admin-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(20,3,66,0.05); overflow: hidden;
        }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .admin-table th {
          background: #f8fafc; padding: 12px 16px; text-align: left;
          font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;
        }
        .admin-table td {
          padding: 16px; border-bottom: 1px solid #e2e8f0;
          color: #4F547B; vertical-align: middle;
        }
        .btn-primary {
          background: #6440FB; color: #fff; border: none;
          padding: 10px 20px; border-radius: 10px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: #5027fa; transform: translateY(-1px); }
        .btn-secondary {
          background: #fff; color: #4F547B; border: 1px solid #e2e8f0;
          padding: 10px 20px; border-radius: 10px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-secondary:hover { background: #f8f9fc; border-color: #cbd5e1; }

        /* Mobile bottom nav */
        .student-mobile-bottom-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0;
          background: #fff; border-top: 1px solid #e2e8f0;
          z-index: 100; padding-bottom: env(safe-area-inset-bottom);
        }
        .student-mobile-bottom-nav-inner {
          display: flex; justify-content: space-around; align-items: stretch;
        }
        .student-mobile-nav-item {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 3px; padding: 10px 4px; flex: 1;
          text-decoration: none; color: #94a3b8; font-size: 9px; font-weight: 600;
          transition: color 0.2s; border: none; background: none;
          cursor: pointer; font-family: inherit;
        }
        .student-mobile-nav-item.active { color: #6440FB; }

        /* Mobile header */
        .student-mobile-header {
          display: none;
          position: sticky; top: 0; z-index: 50;
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 14px 16px;
          align-items: center; justify-content: space-between;
        }

        @media (max-width: 767px) {
          .admin-sidebar { display: none !important; }
          .student-mobile-bottom-nav { display: flex !important; }
          .student-mobile-header { display: flex !important; }
          .admin-content-wrapper {
            padding: 16px !important;
            padding-bottom: 84px !important;
          }
          .admin-page-title { font-size: 20px !important; }
          .admin-table td, .admin-table th { padding: 10px 12px !important; font-size: 13px !important; }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .admin-sidebar { width: 72px !important; }
          .student-nav-label { display: none !important; }
          .student-sidebar-user { display: none !important; }
          .student-sidebar-logo-text { display: none !important; }
          .admin-content-wrapper { padding: 24px !important; }
        }
      `}</style>

      <div className="admin-shell">
        {/* Desktop Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <Link href="/student" style={{ textDecoration: 'none' }}>
              <h2 className="admin-logo">LearnzLab</h2>
              <p className="student-sidebar-logo-text" style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Portal</p>
            </Link>
          </div>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className={`admin-nav-item ${isActive(item.href) ? 'active' : ''}`}>
                <svg className="admin-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="student-nav-label">{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="student-sidebar-user" style={{ marginTop: 'auto', padding: '24px 0', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ padding: '0 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6440FB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {session?.user?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#140342' }}>{session?.user?.name || 'Student'}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Student Portal</div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="admin-nav-item"
              style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#e11d48' }}
            >
              <svg className="admin-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="student-nav-label">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Mobile Header */}
          <div className="student-mobile-header">
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#6440FB', margin: 0, fontFamily: "'Jost', sans-serif" }}>LearnzLab</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#6440FB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                {session?.user?.name?.charAt(0) || 'S'}
              </div>
            </div>
          </div>
          <div className="admin-content-wrapper">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="student-mobile-bottom-nav">
        <div className="student-mobile-bottom-nav-inner">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className={`student-mobile-nav-item ${isActive(item.href) ? 'active' : ''}`}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name.replace('My ', '').replace(' Card', '')}
            </Link>
          ))}
          <button className="student-mobile-nav-item" onClick={() => signOut({ callbackUrl: '/login' })}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>
    </>
  );
}
