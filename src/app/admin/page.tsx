'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Stats = {
  totalUsers: number;
  totalStudents: number;
  totalTrainers: number;
  totalBatches: number;
  totalCourses: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
};

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total Users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: '#6440FB', bg: '#ede9fe', href: '/admin/users' },
  { key: 'totalStudents', label: 'Students', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', color: '#2563EB', bg: '#dbeafe', href: '/admin/users?role=STUDENT' },
  { key: 'totalTrainers', label: 'Trainers', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: '#059669', bg: '#d1fae5', href: '/admin/users?role=TRAINER' },
  { key: 'totalBatches', label: 'Batches', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: '#D97706', bg: '#fef3c7', href: '/admin/batches' },
  { key: 'totalCourses', label: 'Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: '#DC2626', bg: '#fee2e2', href: '/admin/courses' },
];

const QUICK_ACTIONS = [
  { label: 'Add New User', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', href: '/admin/users?action=create', color: '#6440FB' },
  { label: 'Create Batch', icon: 'M12 4v16m8-8H4', href: '/admin/batches?action=create', color: '#059669' },
  { label: 'Schedule Class', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', href: '/admin/classes?action=create', color: '#D97706' },
  { label: 'Post Announcement', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', href: '/admin/announcements?action=create', color: '#DC2626' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async r => {
        if (!r.ok) return;
        const data = await r.json();
        setStats(data);
      })
      .catch(err => console.error('Stats fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const roleColor: Record<string, string> = {
    ADMIN: 'badge-admin',
    TRAINER: 'badge-trainer',
    STUDENT: 'badge-student',
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here's what's happening at LearnzLab today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
        {STAT_CARDS.map(card => (
          <Link key={card.key} href={card.href} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={card.color} strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#140342', fontFamily: "'Jost', 'Inter', sans-serif", lineHeight: 1 }}>
                {loading ? '—' : (stats as any)?.[card.key] ?? 0}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 6 }}>{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

        {/* Recent Users Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recently Added Users</h2>
            <Link href="/admin/users" className="btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }}>View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>Loading…</td></tr>
              )}
              {!loading && (!stats?.recentUsers?.length) && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No users yet</td></tr>
              )}
              {stats?.recentUsers?.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#ede9fe', color: '#6440FB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 13, flexShrink: 0,
                      }}>{u.name[0]?.toUpperCase()}</div>
                      <span style={{ fontWeight: 600, color: '#140342' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748b' }}>{u.email}</td>
                  <td><span className={`badge ${roleColor[u.role]}`}>{u.role}</span></td>
                  <td style={{ color: '#94a3b8', fontSize: 13 }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="admin-card" style={{ height: 'fit-content' }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Quick Actions</h2>
          </div>
          <div style={{ padding: '12px 16px' }}>
            {QUICK_ACTIONS.map(action => (
              <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 12, marginBottom: 8,
                  border: '1.5px solid #f1f5f9',
                  transition: 'border-color 0.2s, background 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = action.color; (e.currentTarget as HTMLElement).style.background = '#fafbff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9'; (e.currentTarget as HTMLElement).style.background = ''; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${action.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={action.color} strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#140342' }}>{action.label}</span>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2} style={{ marginLeft: 'auto' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
