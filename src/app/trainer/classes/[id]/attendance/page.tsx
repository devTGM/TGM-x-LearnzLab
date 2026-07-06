'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';

type AttendanceRecord = {
  user: { id: string; name: string; email: string };
  status: 'PRESENT' | 'ABSENT' | 'LATE';
};

export default function AttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;
  
  const [data, setData] = useState<{ classSession: any; attendance: AttendanceRecord[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/trainer/classes/${classId}/attendance`);
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, [classId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const updateStatus = (userId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    if (!data) return;
    const newAttendance = data.attendance.map(a => 
      a.user.id === userId ? { ...a, status } : a
    );
    setData({ ...data, attendance: newAttendance });
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSuccess(false);
    
    const payload = data.attendance.map(a => ({
      userId: a.user.id,
      status: a.status
    }));

    const res = await fetch(`/api/trainer/classes/${classId}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendanceData: payload }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert('Failed to save attendance');
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Class Data...</div>;
  }

  if (!data) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#be123c' }}>Class not found or unauthorized.</div>;
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Link href="/trainer/classes" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Classes
        </Link>
      </div>

      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">{data.classSession.title}</h1>
          <p className="admin-page-subtitle">
            {new Date(data.classSession.startTime).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} • 
            {new Date(data.classSession.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {success && (
        <div style={{ background: '#d1fae5', border: '1px solid #34d399', color: '#065f46', padding: '12px 16px', borderRadius: 10, marginBottom: 24, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Attendance saved successfully! Class marked as completed.
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!data.attendance.length && (
              <tr>
                <td colSpan={3}>
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#64748b' }}>No students in this batch</h3>
                  </div>
                </td>
              </tr>
            )}
            {data.attendance.map((record) => (
              <tr key={record.user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6440FB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                      {record.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: '#140342' }}>{record.user.name}</span>
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{record.user.email}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, background: '#f8fafc', padding: 4, borderRadius: 10, width: 'fit-content' }}>
                    <button 
                      onClick={() => updateStatus(record.user.id, 'PRESENT')}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                        background: record.status === 'PRESENT' ? '#d1fae5' : 'transparent',
                        color: record.status === 'PRESENT' ? '#059669' : '#64748b',
                        transition: 'all 0.2s'
                      }}
                    >
                      Present
                    </button>
                    <button 
                      onClick={() => updateStatus(record.user.id, 'LATE')}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                        background: record.status === 'LATE' ? '#fef3c7' : 'transparent',
                        color: record.status === 'LATE' ? '#d97706' : '#64748b',
                        transition: 'all 0.2s'
                      }}
                    >
                      Late
                    </button>
                    <button 
                      onClick={() => updateStatus(record.user.id, 'ABSENT')}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                        background: record.status === 'ABSENT' ? '#ffe4e6' : 'transparent',
                        color: record.status === 'ABSENT' ? '#e11d48' : '#64748b',
                        transition: 'all 0.2s'
                      }}
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
