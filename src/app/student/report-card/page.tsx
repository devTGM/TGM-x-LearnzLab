'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function StudentReportCardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // We reuse the logic the trainer has to fetch SWOT if not already there, 
  // or we just fetch the data. Let's assume the student report API returns attendance and assignments.
  useEffect(() => {
    fetch('/api/student/report-card')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading your report card...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">My Report Card</h1>
        <p className="admin-page-subtitle">View your attendance, grades, and trainer feedback.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#140342' }}>Overview</h3>
          
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Attendance</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: data.attendance?.percentage >= 70 ? '#059669' : '#e11d48' }}>
              {data.attendance?.percentage || 0}%
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{data.attendance?.attended || 0} / {data.attendance?.total || 0} classes</div>
          </div>
          
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Assignments</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#140342' }}>
              {data.assignments?.filter((a: any) => a.submissions?.length > 0).length || 0} / {data.assignments?.length || 0}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Submitted</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 18, color: '#140342' }}>Assignments Log</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Status</th>
                <th>Grade</th>
                <th>AI Feedback</th>
              </tr>
            </thead>
            <tbody>
              {data.assignments?.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>No assignments yet.</td></tr>
              )}
              {data.assignments?.map((a: any) => {
                const sub = a.submissions[0];
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600, color: '#140342' }}>{a.title}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{a.batch?.name}</td>
                    <td>
                      {sub ? (
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 50, background: sub.status === 'GRADED' ? '#d1fae5' : '#fef3c7', color: sub.status === 'GRADED' ? '#059669' : '#d97706' }}>
                          {sub.status}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 50, background: '#f1f5f9', color: '#64748b' }}>
                          NOT SUBMITTED
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: '#140342' }}>
                      {sub?.grade !== null && sub?.grade !== undefined ? `${sub.grade}%` : '-'}
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      <div style={{ fontSize: 13, color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sub?.aiFeedback || 'No feedback yet.'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
