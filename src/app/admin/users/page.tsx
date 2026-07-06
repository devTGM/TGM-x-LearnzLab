'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type User = {
  id: string; name: string; email: string; phone?: string;
  role: string; isActive: boolean; createdAt: string;
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'badge-admin', TRAINER: 'badge-trainer', STUDENT: 'badge-student',
};

type ModalMode = 'create' | 'edit' | 'delete' | null;

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>(searchParams.get('action') === 'create' ? 'create' : null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'STUDENT' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set('role', roleFilter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) {
        console.error('Users API error:', res.status, res.statusText);
        setUsers([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    }
    setLoading(false);
  }, [roleFilter, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => {
    setForm({ name: '', email: '', phone: '', password: '', role: 'STUDENT' });
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (u: User) => {
    setSelectedUser(u);
    setForm({ name: u.name, email: u.email, phone: u.phone || '', password: '', role: u.role });
    setFormError('');
    setModalMode('edit');
  };

  const openDelete = (u: User) => { setSelectedUser(u); setModalMode('delete'); };
  const closeModal = () => { setModalMode(null); setSelectedUser(null); setFormError(''); };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    try {
      if (modalMode === 'create') {
        if (!form.name || !form.email || !form.password) {
          setFormError('Name, email, and password are required.'); setSaving(false); return;
        }
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) { setFormError(data.message || 'Failed to create user.'); setSaving(false); return; }
      } else if (modalMode === 'edit' && selectedUser) {
        const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, phone: form.phone, role: form.role, isActive: selectedUser.isActive, password: form.password || undefined }),
        });
        const data = await res.json();
        if (!res.ok) { setFormError(data.message || 'Failed to update user.'); setSaving(false); return; }
      }
      closeModal();
      fetchUsers();
    } catch { setFormError('An error occurred.'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSaving(true);
    const res = await fetch(`/api/admin/users/${selectedUser.id}`, { method: 'DELETE' });
    if (res.ok) { closeModal(); fetchUsers(); }
    else { setFormError('Failed to delete user.'); }
    setSaving(false);
  };

  const toggleActive = async (u: User) => {
    await fetch(`/api/admin/users/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: u.name, phone: u.phone, role: u.role, isActive: !u.isActive }),
    });
    fetchUsers();
  };

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">Manage Users</h1>
          <p className="admin-page-subtitle">Create and manage students, trainers, and admins.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create User
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)}
          className="form-input" style={{ maxWidth: 280 }}
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="form-select" style={{ maxWidth: 160 }}>
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TRAINER">Trainers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            {loading ? 'Loading…' : `${users.length} user${users.length !== 1 ? 's' : ''} found`}
          </h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading users…</td></tr>
            )}
            {!loading && !users.length && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No users found.</td></tr>
            )}
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: '#ede9fe', color: '#6440FB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 14,
                    }}>{u.name[0]?.toUpperCase()}</div>
                    <span style={{ fontWeight: 700, color: '#140342' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{u.email}</td>
                <td style={{ color: '#64748b' }}>{u.phone || '—'}</td>
                <td><span className={`badge ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                <td>
                  <button onClick={() => toggleActive(u)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    background: u.isActive ? '#d1fae5' : '#f1f5f9',
                    color: u.isActive ? '#059669' : '#64748b',
                    fontFamily: 'inherit',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.isActive ? '#059669' : '#94a3b8', display: 'inline-block' }} />
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ color: '#94a3b8', fontSize: 13 }}>
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-edit" onClick={() => openEdit(u)}>Edit</button>
                    <button className="btn-danger" onClick={() => openDelete(u)}>Delete</button>
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
              <h3 className="modal-title">{modalMode === 'create' ? 'Create New User' : 'Edit User'}</h3>
              <button className="close-btn" onClick={closeModal}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {formError && (
                <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
                  {formError}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                </div>
                <div className="form-group" style={{ gridColumn: modalMode === 'create' ? '1 / -1' : undefined }}>
                  <label className="form-label">Email Address {modalMode === 'create' ? '*' : ''}</label>
                  <input className="form-input" type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="user@learnzlab.com"
                    disabled={modalMode === 'edit'}
                    style={modalMode === 'edit' ? { opacity: 0.6, cursor: 'not-allowed' } : {}} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="STUDENT">Student</option>
                    <option value="TRAINER">Trainer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">{modalMode === 'create' ? 'Password *' : 'New Password (leave blank to keep current)'}</label>
                  <input className="form-input" type="password" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={modalMode === 'create' ? 'Min. 6 characters' : '••••••••'} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : modalMode === 'create' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modalMode === 'delete' && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete User</h3>
              <button className="close-btn" onClick={closeModal}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Are you sure you want to permanently delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
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
    </>
  );
}
