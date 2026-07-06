'use client';

import { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';

type Assignment = {
  id: string; title: string; description: string; dueDate: string;
  _count: { submissions: number };
};

export default function AssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: batchId } = use(params);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [submissionsData, setSubmissionsData] = useState<any>(null);
  const [grading, setGrading] = useState(false);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trainer/batches/${batchId}/assignments`);
      if (res.ok) {
        const text = await res.text();
        if (text) setAssignments(JSON.parse(text));
      } else {
        console.error('API Error:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  }, [batchId]);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    let fileUrl = '';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (upRes.ok) {
          const upData = await upRes.json();
          fileUrl = upData.url;
        } else {
          alert('Failed to upload file');
          setSubmitting(false);
          return;
        }
      } catch (e) {
        alert('File upload failed');
        setSubmitting(false);
        return;
      }
    }

    const res = await fetch(`/api/trainer/batches/${batchId}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate, fileUrl })
    });
    if (res.ok) {
      setShowModal(false);
      setTitle(''); setDescription(''); setDueDate(''); setFile(null);
      fetchAssignments();
    }
    setSubmitting(false);
  };

  const viewSubmissions = async (assignmentId: string) => {
    setActiveAssignmentId(assignmentId);
    setSubmissionsData(null);
    const res = await fetch(`/api/trainer/assignments/${assignmentId}/submissions`);
    if (res.ok) setSubmissionsData(await res.json());
  };

  const gradeWithAI = async () => {
    if (!activeAssignmentId) return;
    setGrading(true);
    const res = await fetch(`/api/trainer/assignments/${activeAssignmentId}/grade-ai`, { method: 'POST' });
    if (res.ok) {
      alert('AI Grading Complete!');
      viewSubmissions(activeAssignmentId);
    }
    setGrading(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading Assignments...</div>;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Link href="/trainer/batches" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Batches
        </Link>
      </div>

      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">Assignments</h1>
          <p className="admin-page-subtitle">Manage assignments and grade student submissions.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Create Assignment</button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: '100%', maxWidth: 500 }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, color: '#140342' }}>Create New Assignment</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Description (Instructions/Links)</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Due Date</label>
                <input required type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Attachment (Optional)</label>
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{submitting ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: activeAssignmentId ? '0 0 350px' : 1, transition: 'all 0.3s' }}>
          {assignments.length === 0 ? (
            <div className="admin-card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#64748b', margin: 0 }}>No assignments created yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {assignments.map(a => (
                <div key={a.id} className="admin-card" style={{ padding: 20, cursor: 'pointer', border: activeAssignmentId === a.id ? '2px solid #6440FB' : '1px solid #e2e8f0' }} onClick={() => viewSubmissions(a.id)}>
                  <div style={{ fontWeight: 800, color: '#140342', fontSize: 16, marginBottom: 8 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    <span style={{ fontWeight: 700, color: '#6440FB' }}>{a._count.submissions} Submissions</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeAssignmentId && (
          <div className="admin-card" style={{ flex: 1, padding: 24 }}>
            {!submissionsData ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Loading submissions...</div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <h2 style={{ margin: '0 0 8px', fontSize: 20, color: '#140342' }}>{submissionsData.title}</h2>
                    <p style={{ margin: '0 0 12px', fontSize: 14, color: '#64748b' }}>{submissionsData.description}</p>
                    {submissionsData.fileUrl && (
                      <a href={submissionsData.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6440FB', fontWeight: 600, textDecoration: 'none', background: '#f3f0ff', padding: '6px 12px', borderRadius: 6 }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Attachment
                      </a>
                    )}
                  </div>
                  <button className="btn-primary" onClick={gradeWithAI} disabled={grading} style={{ background: '#0f172a' }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    {grading ? 'AI Grading...' : 'Grade with AI'}
                  </button>
                </div>
                
                {submissionsData.submissions.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>No submissions from students yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {submissionsData.submissions.map((sub: any) => (
                      <div key={sub.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontWeight: 700, color: '#140342' }}>{sub.user.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: sub.status === 'GRADED' ? '#d1fae5' : '#fef3c7', color: sub.status === 'GRADED' ? '#059669' : '#d97706' }}>
                            {sub.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 14, color: '#4F547B', marginBottom: 16, background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                          <strong>Submission Content:</strong><br/>
                          {sub.content}
                        </div>
                        {sub.status === 'GRADED' && (
                          <div style={{ background: '#ede9fe', padding: 12, borderRadius: 8, color: '#140342', fontSize: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 700 }}>
                              <span>✨ AI Feedback</span>
                              <span style={{ color: '#6440FB' }}>Grade: {sub.grade}/100</span>
                            </div>
                            <div style={{ color: '#4F547B' }}>{sub.aiFeedback}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
