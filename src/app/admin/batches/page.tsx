'use client';

import { useEffect, useState, useCallback } from 'react';

type Batch = {
  id: string; name: string; courseId?: string; startDate?: string;
  endDate?: string; time?: string; trainerId?: string; createdAt: string;
  _count?: { students: number };
};

type User = {
  id: string; name: string; email: string; role: string;
};

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | 'students' | 'auto-schedule' | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', time: '' });
  const [formError, setFormError] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Student Management State
  const [batchStudents, setBatchStudents] = useState<User[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Auto-Schedule State
  const [trainers, setTrainers] = useState<User[]>([]);
  const [autoScheduleForm, setAutoScheduleForm] = useState({
    daysOfWeek: [] as number[],
    startTime: '',
    durationHours: '2',
    trainerId: '',
    meetLink: ''
  });

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/batches');
    const data = await res.json();
    setBatches(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const openCreate = () => {
    setForm({ name: '', startDate: '', endDate: '', time: '' });
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (b: Batch) => {
    setSelectedBatch(b);
    setForm({ 
      name: b.name, 
      startDate: b.startDate ? new Date(b.startDate).toISOString().split('T')[0] : '', 
      endDate: b.endDate ? new Date(b.endDate).toISOString().split('T')[0] : '',
      time: b.time || ''
    });
    setFormError('');
    setModalMode('edit');
  };

  const openDelete = (b: Batch) => {
    setSelectedBatch(b);
    setModalMode('delete');
  };

  const openStudents = async (b: Batch) => {
    setSelectedBatch(b);
    setModalMode('students');
    setStudentSearch('');
    // Fetch students in this batch
    const res = await fetch(`/api/admin/batches/${b.id}/students`);
    const data = await res.json();
    setBatchStudents(Array.isArray(data) ? data : []);
    
    // Fetch all students to pick from
    const resAll = await fetch('/api/admin/users?role=STUDENT');
    const allData = await resAll.json();
    setAllStudents(Array.isArray(allData) ? allData : []);
  };

  const openAutoSchedule = async (b: Batch) => {
    setSelectedBatch(b);
    setAutoScheduleForm({ daysOfWeek: [], startTime: '', durationHours: '2', trainerId: '', meetLink: '' });
    setFormError('');
    setModalMode('auto-schedule');
    
    // Fetch trainers
    const res = await fetch('/api/admin/users?role=TRAINER');
    const data = await res.json();
    setTrainers(Array.isArray(data) ? data : []);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedBatch(null);
  };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    if (!form.name) { setFormError('Batch name is required.'); setSaving(false); return; }
    
    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/admin/batches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) { setFormError(data.message || 'Failed.'); setSaving(false); return; }
      } else if (modalMode === 'edit' && selectedBatch) {
        const res = await fetch(`/api/admin/batches/${selectedBatch.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) { setFormError(data.message || 'Failed.'); setSaving(false); return; }
      }
      closeModal();
      fetchBatches();
    } catch (e) {
      setFormError('An error occurred.');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedBatch) return;
    setSaving(true);
    const res = await fetch(`/api/admin/batches/${selectedBatch.id}`, { method: 'DELETE' });
    if (res.ok) { closeModal(); fetchBatches(); }
    else { setFormError('Failed to delete batch.'); }
    setSaving(false);
  };

  const addStudentToBatch = async (userId: string) => {
    if (!selectedBatch) return;
    const res = await fetch(`/api/admin/batches/${selectedBatch.id}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: [userId] }),
    });
    if (res.ok) {
      openStudents(selectedBatch); // Refresh list
      fetchBatches(); // Update counts
    }
  };

  const removeStudentFromBatch = async (userId: string) => {
    if (!selectedBatch) return;
    const res = await fetch(`/api/admin/batches/${selectedBatch.id}/students`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      openStudents(selectedBatch); // Refresh list
      fetchBatches(); // Update counts
    }
  };

  // Filter students who are not in the batch
  const availableStudents = allStudents.filter(
    s => !batchStudents.some(bs => bs.id === s.id) && 
         (s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
          s.email.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const handleAutoSchedule = async () => {
    if (!selectedBatch) return;
    setSaving(true); setFormError('');
    
    if (autoScheduleForm.daysOfWeek.length === 0) {
      setFormError('Please select at least one day of the week.');
      setSaving(false); return;
    }
    if (!autoScheduleForm.startTime || !autoScheduleForm.trainerId) {
      setFormError('Please fill in all required fields.');
      setSaving(false); return;
    }

    try {
      const res = await fetch(`/api/admin/batches/${selectedBatch.id}/auto-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoScheduleForm),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || 'Failed to auto-schedule classes.'); setSaving(false); return; }
      
      closeModal();
      alert(data.message); // Simple alert to show success
    } catch (e) {
      setFormError('An error occurred.');
    }
    setSaving(false);
  };

  const toggleDay = (day: number) => {
    setAutoScheduleForm(f => ({
      ...f,
      daysOfWeek: f.daysOfWeek.includes(day) ? f.daysOfWeek.filter(d => d !== day) : [...f.daysOfWeek, day]
    }));
  };

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">Batches</h1>
          <p className="admin-page-subtitle">Manage student batches and cohorts.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Batch
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Time</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Students</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading…</td></tr>}
            {!loading && !batches.length && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No batches yet. Create your first one!</td></tr>}
            {batches.map(b => (
              <tr key={b.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6440FB" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span style={{ fontWeight: 700, color: '#140342' }}>{b.name}</span>
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{b.time || '—'}</td>
                <td style={{ color: '#64748b' }}>{b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                <td style={{ color: '#64748b' }}>{b.endDate ? new Date(b.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                <td>
                  <span style={{ background: '#ede9fe', color: '#6440FB', borderRadius: 50, padding: '3px 12px', fontSize: 13, fontWeight: 700 }}>
                    {b._count?.students ?? 0}
                  </span>
                </td>
                <td style={{ color: '#94a3b8', fontSize: 13 }}>{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openStudents(b)}>Students</button>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, color: '#6440FB', borderColor: '#6440FB' }} onClick={() => openAutoSchedule(b)}>Auto-Schedule</button>
                    <button className="btn-edit" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn-danger" onClick={() => openDelete(b)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modalMode === 'create' ? 'Create Batch' : 'Edit Batch'}</h3>
              <button className="close-btn" onClick={closeModal}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {formError && <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>{formError}</div>}
              <div className="form-group">
                <label className="form-label">Batch Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. DS Batch July 2026" />
              </div>
              <div className="form-group">
                <label className="form-label">Batch Time</label>
                <input className="form-input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 6:00 PM - 8:00 PM or Morning Batch" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input className="form-input" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input className="form-input" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : modalMode === 'create' ? 'Create Batch' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modalMode === 'delete' && selectedBatch && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Batch</h3>
              <button className="close-btn" onClick={closeModal}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Are you sure you want to permanently delete <strong>{selectedBatch.name}</strong>? This action cannot be undone.
              </p>
              {formError && (
                <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 13 }}>
                  {formError}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete} disabled={saving} style={{ padding: '10px 20px', borderRadius: 10 }}>
                {saving ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Students Modal */}
      {modalMode === 'students' && selectedBatch && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Manage Students: {selectedBatch.name}</h3>
              <button className="close-btn" onClick={closeModal}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#140342', marginBottom: 12 }}>Enrolled Students ({batchStudents.length})</h4>
                {batchStudents.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1', color: '#64748b', fontSize: 14 }}>
                    No students enrolled yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {batchStudents.map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#140342', fontSize: 14 }}>{s.name}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>{s.email}</div>
                        </div>
                        <button className="btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => removeStudentFromBatch(s.id)}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#140342', marginBottom: 12 }}>Add Students</h4>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Search students to add..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
                  {availableStudents.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      No available students found.
                    </div>
                  ) : (
                    availableStudents.map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#140342', fontSize: 14 }}>{s.name}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>{s.email}</div>
                        </div>
                        <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 12, color: '#6440FB', borderColor: '#6440FB' }} onClick={() => addStudentToBatch(s.id)}>Add</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={closeModal}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Schedule Modal */}
      {modalMode === 'auto-schedule' && selectedBatch && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Auto-Schedule: {selectedBatch.name}</h3>
              <button className="close-btn" onClick={closeModal}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
                This will automatically generate Class Sessions for all selected days between the batch's Start Date and End Date.
              </p>
              
              {formError && <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>{formError}</div>}
              
              <div className="form-group">
                <label className="form-label">Days of the Week *</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <button 
                      key={day}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      style={{
                        padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                        background: autoScheduleForm.daysOfWeek.includes(idx) ? '#6440FB' : '#f1f5f9',
                        color: autoScheduleForm.daysOfWeek.includes(idx) ? '#fff' : '#475569',
                        border: '1px solid',
                        borderColor: autoScheduleForm.daysOfWeek.includes(idx) ? '#6440FB' : '#cbd5e1'
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input className="form-input" type="time" value={autoScheduleForm.startTime} onChange={e => setAutoScheduleForm(f => ({ ...f, startTime: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (Hrs)</label>
                  <select className="form-select" value={autoScheduleForm.durationHours} onChange={e => setAutoScheduleForm(f => ({ ...f, durationHours: e.target.value }))}>
                    <option value="1">1 Hour</option>
                    <option value="1.5">1.5 Hours</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assign Trainer *</label>
                <select className="form-select" value={autoScheduleForm.trainerId} onChange={e => setAutoScheduleForm(f => ({ ...f, trainerId: e.target.value }))}>
                  <option value="">-- Choose Trainer --</option>
                  {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Meeting Link (Zoom / Google Meet)</label>
                <input className="form-input" value={autoScheduleForm.meetLink} onChange={e => setAutoScheduleForm(f => ({ ...f, meetLink: e.target.value }))} placeholder="https://zoom.us/j/..." />
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleAutoSchedule} disabled={saving}>{saving ? 'Scheduling…' : 'Generate Classes'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
