'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function StudentReportCardPage({ params }: { params: Promise<{ id: string, studentId: string }> }) {
  const { id: batchId, studentId } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [swot, setSwot] = useState<any>(null);
  const [generatingSwot, setGeneratingSwot] = useState(false);

  useEffect(() => {
    fetch(`/api/trainer/batches/${batchId}/student/${studentId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [batchId, studentId]);

  const generateSwot = async () => {
    setGeneratingSwot(true);
    try {
      const res = await fetch(`/api/trainer/batches/${batchId}/student/${studentId}/swot`, { method: 'POST' });
      const result = await res.json();
      setSwot(result);
    } catch (e) {
      alert('Failed to generate SWOT analysis.');
    }
    setGeneratingSwot(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading student data...</div>;
  if (!data?.student) return <div style={{ padding: 40, textAlign: 'center', color: '#e11d48' }}>Student not found.</div>;

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link href={`/trainer/batches/${batchId}/report-card`} style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="admin-page-title">{data.student.name}'s Report Card</h1>
          <p className="admin-page-subtitle">{data.student.email} • {data.student.phone || 'No phone'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, marginBottom: 24 }}>
        <div className="admin-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#140342' }}>Overview</h3>
          
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Attendance</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: data.attendance.percentage >= 70 ? '#059669' : '#e11d48' }}>
              {data.attendance.percentage}%
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{data.attendance.attended} / {data.attendance.total} classes</div>
          </div>
          
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Assignments</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#140342' }}>
              {data.assignments.filter((a: any) => a.submissions.length > 0).length} / {data.assignments.length}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Submitted</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#140342' }}>AI SWOT Analysis</h3>
            {!swot && (
              <button onClick={generateSwot} disabled={generatingSwot} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {generatingSwot ? 'Generating...' : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Generate SWOT
                  </>
                )}
              </button>
            )}
          </div>
          
          {swot ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Strengths */}
              <div style={{ padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
                <h4 style={{ margin: '0 0 12px', color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Strengths
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#166534', fontSize: 14 }}>
                  {swot.strengths.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                </ul>
              </div>
              
              {/* Weaknesses */}
              <div style={{ padding: 16, background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 8 }}>
                <h4 style={{ margin: '0 0 12px', color: '#9f1239', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Weaknesses
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#9f1239', fontSize: 14 }}>
                  {swot.weaknesses.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                </ul>
              </div>

              {/* Opportunities */}
              <div style={{ padding: 16, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
                <h4 style={{ margin: '0 0 12px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Opportunities
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#1e40af', fontSize: 14 }}>
                  {swot.opportunities.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                </ul>
              </div>

              {/* Threats */}
              <div style={{ padding: 16, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                <h4 style={{ margin: '0 0 12px', color: '#b45309', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Threats
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#b45309', fontSize: 14 }}>
                  {swot.threats.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#64748b' }}>
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              <p style={{ margin: 0, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>Generate an AI-powered SWOT analysis to understand this student's academic standing.</p>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 18, color: '#140342' }}>Assignments Log</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Status</th>
              <th>Grade</th>
              <th>AI Feedback</th>
            </tr>
          </thead>
          <tbody>
            {data.assignments.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>No assignments yet.</td></tr>
            )}
            {data.assignments.map((a: any) => {
              const sub = a.submissions[0];
              return (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: '#140342' }}>{a.title}</td>
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
    </>
  );
}
