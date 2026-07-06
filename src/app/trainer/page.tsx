'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TrainerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trainer/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Dashboard...</div>;
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Welcome back, Trainer!</h1>
        <p className="admin-page-subtitle">Here is your schedule and overview for today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#6440FB" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#140342', lineHeight: 1 }}>{data?.stats?.upcomingClasses || 0}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginTop: 4 }}>UPCOMING CLASSES</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#140342', lineHeight: 1 }}>{data?.stats?.completedClasses || 0}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginTop: 4 }}>COMPLETED CLASSES</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0284c7" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#140342', lineHeight: 1 }}>{data?.stats?.totalStudents || 0}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginTop: 4 }}>TOTAL STUDENTS</div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-page-header">
        <h2 className="admin-page-title" style={{ fontSize: 20 }}>Today's Classes</h2>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Class Title</th>
              <th>Batch</th>
              <th>Time</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data?.todaysClasses?.length && (
              <tr>
                <td colSpan={5}>
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>No classes today</h3>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>Enjoy your day off!</p>
                  </div>
                </td>
              </tr>
            )}
            {data?.todaysClasses?.map((c: any) => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#140342' }}>{c.title}</span>
                </td>
                <td style={{ color: '#64748b' }}>{c.batch.name}</td>
                <td>
                  <div style={{ color: '#140342', fontWeight: 600 }}>
                    {new Date(c.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{c.batch._count.students} Students</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {c.meetLink && (
                      <a href={c.meetLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: 12 }}>
                        Start Meeting
                      </a>
                    )}
                    <Link href={`/trainer/classes/${c.id}/attendance`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}>
                      Take Attendance
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
