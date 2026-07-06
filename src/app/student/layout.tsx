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
        }
        .admin-nav-item:hover, .admin-nav-item.active {
          background: #f8f9fc;
          color: #6440FB;
        }
        .admin-nav-icon {
          width: 20px;
          height: 20px;
        }
        .admin-page-header {
          margin-bottom: 28px;
        }
        .admin-page-title {
          font-size: 26px;
          font-weight: 900;
          color: #140342;
          font-family: 'Jost', 'Inter', sans-serif;
          letter-spacing: -0.3px;
          margin: 0 0 4px;
        }
        .admin-page-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
        .admin-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(20,3,66,0.05);
          overflow: hidden;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .admin-table th {
          background: #f8fafc;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #4F547B;
          vertical-align: middle;
        }
        .btn-primary {
          background: #6440FB;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background: #5027fa;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: #fff;
          color: #4F547B;
          border: 1px solid #e2e8f0;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-secondary:hover {
          background: #f8f9fc;
          border-color: #cbd5e1;
        }
      `}</style>
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link href="/student" style={{ textDecoration: 'none' }}>
            <h2 className="admin-logo">LearnzLab</h2>
          </Link>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} className={`admin-nav-item ${isActive ? 'active' : ''}`}>
                <svg className="admin-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', padding: '24px 0', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ padding: '0 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6440FB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
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
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content-wrapper">
          {children}
        </div>
      </main>
    </div>
    </>
  );
}
