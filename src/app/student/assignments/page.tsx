'use client';

import { useEffect, useState } from 'react';

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  fileUrl: string | null;
  batch: { name: string };
  submissions: { id: string; status: string; grade: number | null; aiFeedback: string | null }[];
};

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [submitModalId, setSubmitModalId] = useState<string | null>(null);
  const [submitContent, setSubmitContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    fetch('/api/student/assignments')
      .then(res => res.json())
      .then(data => {
        setAssignments(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalId) return;
    setSubmitting(true);
    const res = await fetch(`/api/student/assignments/${submitModalId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: submitContent })
    });
    if (res.ok) {
      alert('Assignment submitted successfully!');
      setSubmitModalId(null);
      setSubmitContent('');
      fetchAssignments();
    } else {
      alert('Failed to submit assignment.');
    }
    setSubmitting(false);
  };

  const pending = assignments.filter(a => a.submissions.length === 0);
  const submitted = assignments.filter(a => a.submissions.length > 0);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Assignments</h1>
        <p className="admin-page-subtitle">Submit pending tasks and review graded work.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Pending Assignments */}
        <div className="admin-card" style={{ padding: 24, alignSelf: 'flex-start' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 18, color: '#140342' }}>Pending ({pending.length})</h3>
          
          {pending.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#64748b' }}>
              You have no pending assignments!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pending.map(a => (
                <div key={a.id} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h4 style={{ margin: 0, color: '#140342', fontSize: 16 }}>{a.title}</h4>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 50, background: '#fef3c7', color: '#d97706' }}>PENDING</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6440FB', fontWeight: 600, marginBottom: 8 }}>{a.batch?.name}</div>
                  <div style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>{a.description}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: '#e11d48', fontWeight: 600 }}>Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                    <button onClick={() => setSubmitModalId(a.id)} className="btn-primary" style={{ padding: '6px 16px', fontSize: 12 }}>
                      Submit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submitted Assignments */}
        <div className="admin-card" style={{ padding: 24, alignSelf: 'flex-start' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 18, color: '#140342' }}>Submitted ({submitted.length})</h3>
          
          {submitted.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#64748b' }}>
              No submitted assignments yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {submitted.map(a => {
                const sub = a.submissions[0];
                return (
                  <div key={a.id} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, borderLeft: sub.status === 'GRADED' ? '4px solid #10b981' : '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, color: '#140342', fontSize: 16 }}>{a.title}</h4>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 50, background: sub.status === 'GRADED' ? '#d1fae5' : '#eff6ff', color: sub.status === 'GRADED' ? '#059669' : '#2563eb' }}>
                        {sub.status}
                      </span>
                    </div>
                    
                    {sub.status === 'GRADED' && (
                      <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Grade</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#140342', marginBottom: 12 }}>{sub.grade}%</div>
                        
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>AI Feedback</div>
                        <div style={{ fontSize: 13, color: '#475569' }}>{sub.aiFeedback || 'No feedback provided.'}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {submitModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: 480, overflow: 'hidden', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 18, color: '#140342' }}>Submit Assignment</h2>
              <button onClick={() => setSubmitModalId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 24 }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#140342', marginBottom: 6 }}>Submission Link</label>
                <input required type="url" value={submitContent} onChange={e => setSubmitContent(e.target.value)} placeholder="https://github.com/your/repo" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, boxSizing: 'border-box' }} />
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748b' }}>Paste a link to your work (e.g. GitHub repo, Google Doc, hosted project).</p>
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setSubmitModalId(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
