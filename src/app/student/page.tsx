'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Dashboard...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Welcome back, {session?.user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
        <p className="admin-page-subtitle">Here is what's happening with your courses today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="admin-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Attendance</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#140342' }}>{data?.attendancePercentage ?? 0}%</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending Tasks</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#140342' }}>{data?.pendingAssignments?.length || 0}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Classes Today</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#140342' }}>{data?.upcomingClasses?.length || 0}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#140342' }}>Upcoming Classes</h3>
            <Link href="/student/classes" style={{ fontSize: 13, color: '#6440FB', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          
          {data?.upcomingClasses?.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#64748b' }}>
              No classes scheduled for today or tomorrow.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data?.upcomingClasses?.map((c: any) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#140342' }}>{c.title}</h4>
                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      {new Date(c.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  {c.meetLink ? (
                    <a href={c.meetLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 13 }}>
                      Join Class
                    </a>
                  ) : (
                    <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No link yet</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#140342' }}>To Do</h3>
            <Link href="/student/assignments" style={{ fontSize: 13, color: '#6440FB', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
          </div>
          
          {data?.pendingAssignments?.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#64748b' }}>
              You're all caught up!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data?.pendingAssignments?.map((a: any) => (
                <div key={a.id} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, borderLeft: '4px solid #f59e0b' }}>
                  <h4 style={{ margin: '0 0 4px', color: '#140342', fontSize: 14 }}>{a.title}</h4>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                    Due: {new Date(a.dueDate).toLocaleDateString()}
                  </div>
                  <Link href="/student/assignments" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none', padding: '6px 12px', fontSize: 12 }}>
                    Submit Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
