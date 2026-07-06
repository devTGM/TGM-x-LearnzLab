'use client';

import { useEffect, useState, useCallback } from 'react';

type ClassSession = {
  id: string; title: string; startTime: string; endTime: string;
  meetLink?: string; status: string;
  batch: { id: string; name: string };
  trainer: { id: string; name: string };
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [form, setForm] = useState({
    title: '', startDate: '', startTime: '', durationHours: '2',
    meetLink: '', batchId: '', trainerId: ''
  });

  const [batches, setBatches] = useState<{id: string, name: string}[]>([]);
  const [trainers, setTrainers] = useState<{id: string, name: string}[]>([]);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/classes');
    if (res.ok) {
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClasses();
    
    // Fetch batches and trainers for the dropdowns
    fetch('/api/admin/batches').then(res => res.json()).then(data => setBatches(Array.isArray(data) ? data : []));
    fetch('/api/admin/users?role=TRAINER').then(res => res.json()).then(data => setTrainers(Array.isArray(data) ? data : []));
  }, [fetchClasses]);

  const openSchedule = () => {
    setForm({ title: '', startDate: '', startTime: '', durationHours: '2', meetLink: '', batchId: '', trainerId: '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleSchedule = async () => {
    setSaving(true); setFormError('');
    if (!form.title || !form.startDate || !form.startTime || !form.batchId || !form.trainerId) {
      setFormError('Please fill in all required fields.');
      setSaving(false); return;
    }

    const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + parseFloat(form.durationHours) * 60 * 60 * 1000);

    const res = await fetch('/api/admin/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        meetLink: form.meetLink,
        batchId: form.batchId,
        trainerId: form.trainerId,
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      fetchClasses();
    } else {
      const data = await res.json();
      setFormError(data.message || 'Failed to schedule class.');
    }
    setSaving(false);
  };

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">Classes</h1>
          <p className="admin-page-subtitle">Schedule and manage live class sessions.</p>
        </div>
        <button className="btn-primary" onClick={openSchedule}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Schedule Class
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Class Title</th>
              <th>Batch</th>
              <th>Trainer</th>
              <th>Schedule</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading…</td></tr>}
            {!loading && !classes.length && (
              <tr>
                <td colSpan={5}>
                  <div style={{ padding: 64, textAlign: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#6440FB" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#140342', fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 8 }}>No classes scheduled yet</h3>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Click "Schedule Class" to create your first live session.</p>
                  </div>
                </td>
              </tr>
            )}
            {classes.map(c => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#140342' }}>{c.title}</span>
                  {c.meetLink && (
                    <a href={c.meetLink} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: 12, color: '#6440FB', marginTop: 4, textDecoration: 'none' }}>
                      Join Meeting ↗
                    </a>
                  )}
                </td>
                <td style={{ color: '#64748b' }}>{c.batch.name}</td>
                <td style={{ color: '#64748b' }}>{c.trainer.name}</td>
                <td>
                  <div style={{ color: '#140342', fontWeight: 500 }}>
                    {new Date(c.startTime).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>
                    {new Date(c.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </td>
                <td>
                  <span style={{ background: c.status === 'COMPLETED' ? '#d1fae5' : '#ede9fe', color: c.status === 'COMPLETED' ? '#059669' : '#6440FB', borderRadius: 50, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Schedule Live Class</h3>
              <button className="close-btn" onClick={() => setModalOpen(false)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {formError && <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>{formError}</div>}
              
              <div className="form-group">
                <label className="form-label">Class Topic / Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Introduction to Python" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Select Batch *</label>
                  <select className="form-select" value={form.batchId} onChange={e => setForm(f => ({ ...f, batchId: e.target.value }))}>
                    <option value="">-- Choose Batch --</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Trainer *</label>
                  <select className="form-select" value={form.trainerId} onChange={e => setForm(f => ({ ...f, trainerId: e.target.value }))}>
                    <option value="">-- Choose Trainer --</option>
                    {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input className="form-input" type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (Hrs)</label>
                  <select className="form-select" value={form.durationHours} onChange={e => setForm(f => ({ ...f, durationHours: e.target.value }))}>
                    <option value="1">1 Hour</option>
                    <option value="1.5">1.5 Hours</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meeting Link (Zoom / Google Meet)</label>
                <input className="form-input" value={form.meetLink} onChange={e => setForm(f => ({ ...f, meetLink: e.target.value }))} placeholder="https://zoom.us/j/..." />
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSchedule} disabled={saving}>{saving ? 'Scheduling…' : 'Schedule Class'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
