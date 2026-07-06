'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type ClassSession = {
  id: string; title: string; startTime: string; endTime: string;
  meetLink?: string; recordingUrl?: string; status: string;
  batch: { id: string; name: string; _count: { students: number } };
};

export default function TrainerClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'UPCOMING' | 'PAST' | 'ATTENDANCE'>('UPCOMING');

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/trainer/classes');
    if (res.ok) {
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCancelClass = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this class?')) return;
    const res = await fetch(`/api/trainer/classes/${id}/cancel`, { method: 'POST' });
    if (res.ok) {
      fetchClasses();
    } else {
      alert('Failed to cancel class');
    }
  };

  const [editLinksModalId, setEditLinksModalId] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveLinks = async () => {
    if (!editLinksModalId) return;
    setSaving(true);
    const res = await fetch(`/api/trainer/classes/${editLinksModalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetLink, recordingUrl })
    });
    if (res.ok) {
      setEditLinksModalId(null);
      fetchClasses();
    } else {
      alert('Failed to save links');
    }
    setSaving(false);
  };

  const now = new Date();
  
  const filteredClasses = classes.filter(c => {
    const isPast = new Date(c.endTime) < now || c.status === 'COMPLETED';
    if (tab === 'PAST') return isPast;
    return !isPast;
  }).sort((a, b) => {
    // Upcoming: Ascending (closest first)
    if (tab === 'UPCOMING') return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    // Past: Descending (most recent first)
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">My Classes</h1>
          <p className="admin-page-subtitle">View your scheduled classes and manage attendance.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button 
          onClick={() => setTab('UPCOMING')}
          style={{
            padding: '8px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
            background: tab === 'UPCOMING' ? '#140342' : '#f8fafc',
            color: tab === 'UPCOMING' ? '#fff' : '#64748b',
            boxShadow: tab === 'UPCOMING' ? '0 4px 12px rgba(20,3,66,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Upcoming Classes
        </button>
        <button 
          onClick={() => setTab('PAST')}
          style={{
            padding: '8px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
            background: tab === 'PAST' ? '#140342' : '#f8fafc',
            color: tab === 'PAST' ? '#fff' : '#64748b',
            boxShadow: tab === 'PAST' ? '0 4px 12px rgba(20,3,66,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Past & Completed
        </button>
        <button 
          onClick={() => setTab('ATTENDANCE')}
          style={{
            padding: '8px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
            background: tab === 'ATTENDANCE' ? '#140342' : '#f8fafc',
            color: tab === 'ATTENDANCE' ? '#fff' : '#64748b',
            boxShadow: tab === 'ATTENDANCE' ? '0 4px 12px rgba(20,3,66,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Student Attendance
        </button>
      </div>

      {tab === 'ATTENDANCE' ? (
        <AttendanceTab />
      ) : (
        <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Class Title</th>
              <th>Batch</th>
              <th>Date & Time</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading…</td></tr>}
            {!loading && !filteredClasses.length && (
              <tr>
                <td colSpan={5}>
                  <div style={{ padding: 64, textAlign: 'center' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#140342', fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 8 }}>No classes found</h3>
                    <p style={{ color: '#64748b', fontSize: 14 }}>You have no {tab.toLowerCase()} classes at the moment.</p>
                  </div>
                </td>
              </tr>
            )}
            {filteredClasses.map(c => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#140342' }}>{c.title}</span>
                  {c.status === 'COMPLETED' && (
                    <span style={{ marginLeft: 8, background: '#d1fae5', color: '#059669', borderRadius: 50, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                      COMPLETED
                    </span>
                  )}
                </td>
                <td style={{ color: '#64748b' }}>{c.batch.name}</td>
                <td>
                  <div style={{ color: '#140342', fontWeight: 500 }}>
                    {new Date(c.startTime).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>
                    {new Date(c.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{c.batch._count.students} Students</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {c.status === 'CANCELLED' ? (
                      <span style={{ padding: '6px 12px', fontSize: 12, color: '#e11d48', background: '#ffe4e6', borderRadius: 6, fontWeight: 600 }}>Cancelled</span>
                    ) : (
                      <>
                        {c.meetLink && tab === 'UPCOMING' && (
                          <a href={c.meetLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: 12 }}>
                            Start Meeting
                          </a>
                        )}
                        <Link href={`/trainer/classes/${c.id}/attendance`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, textDecoration: 'none', color: '#6440FB', borderColor: '#6440FB' }}>
                          {tab === 'UPCOMING' ? 'Take Attendance' : 'View Attendance'}
                        </Link>
                        <button onClick={() => {
                          setEditLinksModalId(c.id);
                          setMeetLink(c.meetLink || '');
                          setRecordingUrl(c.recordingUrl || '');
                        }} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                          Edit Links
                        </button>
                        {tab === 'UPCOMING' && (
                          <button onClick={() => handleCancelClass(c.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, color: '#e11d48', borderColor: '#e11d48', background: 'transparent' }}>
                            Cancel Class
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Edit Links Modal */}
      {editLinksModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: 480, overflow: 'hidden', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 18, color: '#140342' }}>Edit Class Links</h2>
              <button onClick={() => setEditLinksModalId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Live Meeting Link (Zoom, Meet, etc.)</label>
                <input type="url" value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="https://meet.google.com/..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Recording URL (for Past Classes)</label>
                <input type="url" value={recordingUrl} onChange={e => setRecordingUrl(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setEditLinksModalId(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="button" onClick={handleSaveLinks} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : 'Save Links'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AttendanceTab() {
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [activeBatch, setActiveBatch] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trainer/batches')
      .then(res => res.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : [];
        setBatches(arr);
        if (arr.length > 0) setActiveBatch(arr[0].id);
        else setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!activeBatch) return;
    setLoading(true);
    fetch(`/api/trainer/batches/${activeBatch}/report-card`)
      .then(async res => {
        if (!res.ok) return [];
        return JSON.parse(await res.text() || '[]');
      })
      .then(d => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, [activeBatch]);

  if (batches.length === 0 && !loading) {
    return <div className="admin-card" style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No batches found to display attendance.</div>;
  }

  return (
    <div className="admin-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontWeight: 600, color: '#140342' }}>Select Batch:</span>
        <select 
          value={activeBatch || ''} 
          onChange={e => setActiveBatch(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', outline: 'none' }}
        >
          {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Attendance...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Classes Attended</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>No students found in this batch.</td></tr>
            )}
            {data.map(entry => (
              <tr key={entry.user.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#140342' }}>{entry.user.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{entry.user.email}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#140342' }}>{entry.attendance.attended}</span>
                  <span style={{ color: '#64748b' }}> out of {entry.attendance.total} classes</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden', maxWidth: 200 }}>
                      <div style={{ height: '100%', background: entry.attendance.percentage >= 70 ? '#059669' : '#e11d48', width: `${entry.attendance.percentage}%` }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: entry.attendance.percentage >= 70 ? '#059669' : '#e11d48' }}>
                      {entry.attendance.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
