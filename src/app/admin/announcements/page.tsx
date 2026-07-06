'use client';

import { useState } from 'react';

export default function AdminAnnouncementsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', targetRole: 'ALL' });

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">Announcements</h1>
          <p className="admin-page-subtitle">Send notices to students, trainers, or everyone.</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Announcement
        </button>
      </div>

      <div className="admin-card">
        <div style={{ padding: 64, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#140342', fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 8 }}>No announcements yet</h3>
          <p style={{ color: '#64748b', fontSize: 14 }}>Post your first announcement to reach your students and trainers.</p>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">New Announcement</h3>
              <button className="close-btn" onClick={() => setModalOpen(false)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" />
              </div>
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select className="form-select" value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}>
                  <option value="ALL">Everyone</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="TRAINER">Trainers Only</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-input" rows={5} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Write your announcement here…"
                  style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary">Post Announcement</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
