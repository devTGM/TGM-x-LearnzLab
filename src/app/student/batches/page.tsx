'use client';

import { useEffect, useState } from 'react';

type Batch = {
  id: string;
  name: string;
  status: string;
  course: { title: string; duration: string; thumbnail: string };
  _count: { classes: number; assignments: number };
};

export default function StudentBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/batches')
      .then(res => res.json())
      .then(data => {
        setBatches(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">My Batches</h1>
        <p className="admin-page-subtitle">Courses you are currently enrolled in.</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Batches...</div>
      ) : batches.length === 0 ? (
        <div className="admin-card" style={{ padding: 64, textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#140342', marginBottom: 8 }}>No Enrollments</h3>
          <p style={{ color: '#64748b' }}>You are not currently enrolled in any batches.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {batches.map(batch => (
            <div key={batch.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ height: 140, background: '#e2e8f0', backgroundImage: batch.course?.thumbnail ? `url(${batch.course.thumbnail})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                {!batch.course?.thumbnail && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <span style={{ position: 'absolute', top: 12, right: 12, background: batch.status === 'ACTIVE' ? '#d1fae5' : '#f1f5f9', color: batch.status === 'ACTIVE' ? '#059669' : '#475569', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 50, letterSpacing: '0.5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  {batch.status}
                </span>
              </div>
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#140342' }}>{batch.course?.title}</h3>
                <div style={{ fontSize: 14, color: '#6440FB', fontWeight: 600, marginBottom: 16 }}>{batch.name}</div>
                
                <div style={{ display: 'flex', gap: 16, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {batch._count?.classes || 0} Classes
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    {batch._count?.assignments || 0} Assignments
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
