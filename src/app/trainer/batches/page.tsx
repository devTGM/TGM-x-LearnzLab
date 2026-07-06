'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Batch = {
  id: string;
  name: string;
  description: string;
  status: string;
  course: { title: string };
  _count: { students: number; classes: number };
};

export default function TrainerBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  const [extendModalBatch, setExtendModalBatch] = useState<string | null>(null);
  const [extendType, setExtendType] = useState<'WEEKS' | 'DATE'>('WEEKS');
  const [extendValue, setExtendValue] = useState('');
  const [extendReason, setExtendReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/trainer/batches')
      .then(res => res.json())
      .then(data => {
        setBatches(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalBatch) return;
    setSubmitting(true);
    const res = await fetch(`/api/trainer/batches/${extendModalBatch}/extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: extendType, value: extendValue, reason: extendReason })
    });
    if (res.ok) {
      alert('Extension request submitted to Admin successfully.');
      setExtendModalBatch(null);
      setExtendValue('');
      setExtendReason('');
    } else {
      alert('Failed to submit extension request.');
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">My Batches</h1>
        <p className="admin-page-subtitle">Manage assignments and view report cards for your assigned batches.</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Batches...</div>
      ) : batches.length === 0 ? (
        <div className="admin-card" style={{ padding: 64, textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#140342', marginBottom: 8 }}>No Batches Assigned</h3>
          <p style={{ color: '#64748b' }}>You have not been assigned to lead any classes in any batch yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {batches.map(batch => (
            <div key={batch.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 24, borderBottom: '1px solid #e2e8f0', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#140342' }}>{batch.name}</h3>
                  <span style={{ background: batch.status === 'ACTIVE' ? '#d1fae5' : '#f1f5f9', color: batch.status === 'ACTIVE' ? '#059669' : '#475569', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 50, letterSpacing: '0.5px' }}>
                    {batch.status}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: '#6440FB', fontWeight: 600, marginBottom: 16 }}>
                  {batch.course?.title}
                </div>
                
                <div style={{ display: 'flex', gap: 16, marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {batch._count.students} Students
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {batch._count.classes} Classes
                  </div>
                </div>
              </div>
              
              <div style={{ padding: 16, background: '#f8fafc', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href={`/trainer/batches/${batch.id}/assignments`} style={{ flex: 1, minWidth: '45%', textAlign: 'center', padding: '10px 0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#140342', fontWeight: 600, fontSize: 13, textDecoration: 'none', transition: 'all 0.2s' }}>
                  Assignments
                </Link>
                <Link href={`/trainer/batches/${batch.id}/report-card`} style={{ flex: 1, minWidth: '45%', textAlign: 'center', padding: '10px 0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#140342', fontWeight: 600, fontSize: 13, textDecoration: 'none', transition: 'all 0.2s' }}>
                  Report Card
                </Link>
                <button 
                  onClick={() => setExtendModalBatch(batch.id)} 
                  className="btn-secondary" 
                  style={{ flex: '1 1 100%', padding: '10px 0', fontSize: 13, color: '#6440FB', borderColor: '#e2e8f0', background: '#fff' }}
                >
                  Request Batch Extension
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {extendModalBatch && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: 480, overflow: 'hidden', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 18, color: '#140342' }}>Request Batch Extension</h2>
              <button onClick={() => setExtendModalBatch(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleExtend} style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#140342', fontWeight: 500, cursor: 'pointer' }}>
                  <input type="radio" name="extendType" checked={extendType === 'WEEKS'} onChange={() => { setExtendType('WEEKS'); setExtendValue(''); }} />
                  Extend by Weeks
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#140342', fontWeight: 500, cursor: 'pointer' }}>
                  <input type="radio" name="extendType" checked={extendType === 'DATE'} onChange={() => { setExtendType('DATE'); setExtendValue(''); }} />
                  Extend till Date
                </label>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>
                  {extendType === 'WEEKS' ? 'Number of Weeks' : 'New End Date'}
                </label>
                {extendType === 'WEEKS' ? (
                  <input required type="number" min="1" max="52" value={extendValue} onChange={e => setExtendValue(e.target.value)} placeholder="e.g. 2" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
                ) : (
                  <input required type="date" value={extendValue} onChange={e => setExtendValue(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
                )}
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Reason (Optional)</label>
                <textarea value={extendReason} onChange={e => setExtendReason(e.target.value)} placeholder="Why is this extension needed?" rows={3} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setExtendModalBatch(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
