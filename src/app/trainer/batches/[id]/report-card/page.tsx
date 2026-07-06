'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

type ReportCardEntry = {
  user: { id: string; name: string; email: string };
  attendance: { total: number; attended: number; percentage: number };
  assignments: { total: number; submitted: number; averageGrade: number | null };
};

export default function ReportCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: batchId } = use(params);
  const [data, setData] = useState<ReportCardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/trainer/batches/${batchId}/report-card`)
      .then(async (res) => {
        if (!res.ok) {
          console.error('API Error:', res.status, await res.text());
          return [];
        }
        const text = await res.text();
        if (!text) return [];
        return JSON.parse(text);
      })
      .then(d => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setData([]);
        setLoading(false);
      });
  }, [batchId]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Report Cards...</div>;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Link href="/trainer/batches" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Batches
        </Link>
      </div>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Student Report Cards</h1>
        <p className="admin-page-subtitle">Comprehensive view of attendance and assignment performance for this batch.</p>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Attendance</th>
              <th>Assignments Submitted</th>
              <th>Average Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No students found in this batch.</td>
              </tr>
            )}
            {data.map(entry => {
              const isAtRisk = entry.attendance.percentage < 70 || (entry.assignments.averageGrade !== null && entry.assignments.averageGrade < 70);
              
              return (
                <tr key={entry.user.id}>
                  <td>
                    <Link href={`/trainer/batches/${batchId}/student/${entry.user.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontWeight: 700, color: '#6440FB', textDecoration: 'underline' }}>{entry.user.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{entry.user.email}</div>
                    </Link>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden', minWidth: 100 }}>
                        <div style={{ height: '100%', background: entry.attendance.percentage >= 70 ? '#059669' : '#e11d48', width: `${entry.attendance.percentage}%` }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: entry.attendance.percentage >= 70 ? '#059669' : '#e11d48' }}>
                        {entry.attendance.percentage}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#140342' }}>{entry.assignments.submitted}</span>
                    <span style={{ color: '#64748b' }}> / {entry.assignments.total}</span>
                  </td>
                  <td>
                    {entry.assignments.averageGrade === null ? (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>No graded assignments</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ 
                          fontWeight: 800, fontSize: 16, 
                          color: entry.assignments.averageGrade >= 80 ? '#059669' : entry.assignments.averageGrade >= 65 ? '#d97706' : '#e11d48' 
                        }}>
                          {entry.assignments.averageGrade}
                        </span>
                        <span style={{ color: '#64748b', fontSize: 12 }}>/ 100</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase',
                      background: isAtRisk ? '#ffe4e6' : '#d1fae5',
                      color: isAtRisk ? '#e11d48' : '#059669'
                    }}>
                      {isAtRisk ? 'At Risk' : 'On Track'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
