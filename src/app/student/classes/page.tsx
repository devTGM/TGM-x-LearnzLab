'use client';

import { useEffect, useState } from 'react';

type ClassSession = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  recordingUrl: string | null;
  status: string;
  batch: { name: string; course: { title: string } };
  trainer: { name: string };
};

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  // YouTube
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Google Drive
  if (url.includes('drive.google.com/file/d/')) {
    return url.replace('/view', '/preview');
  }
  return url;
};

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [viewVideoUrl, setViewVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/student/classes')
      .then(res => res.json())
      .then(data => {
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  
  const upcomingClasses = classes
    .filter(c => new Date(c.endTime) >= now && c.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
  const pastClasses = classes
    .filter(c => new Date(c.endTime) < now || c.status === 'CANCELLED')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const displayClasses = tab === 'UPCOMING' ? upcomingClasses : pastClasses;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">My Classes</h1>
        <p className="admin-page-subtitle">View your schedule and join live sessions.</p>
      </div>

      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
        <button
          onClick={() => setTab('UPCOMING')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'UPCOMING' ? '2px solid #6440FB' : '2px solid transparent', color: tab === 'UPCOMING' ? '#140342' : '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Upcoming Classes ({upcomingClasses.length})
        </button>
        <button
          onClick={() => setTab('PAST')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: tab === 'PAST' ? '2px solid #6440FB' : '2px solid transparent', color: tab === 'PAST' ? '#140342' : '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Past / Cancelled ({pastClasses.length})
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading classes...</div>
        ) : displayClasses.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
            No {tab.toLowerCase()} classes found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Class Details</th>
                <th>Batch & Course</th>
                <th>Trainer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayClasses.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#140342', marginBottom: 4 }}>
                      {c.title}
                      {c.status === 'CANCELLED' && (
                        <span style={{ marginLeft: 8, padding: '2px 6px', fontSize: 10, background: '#ffe4e6', color: '#e11d48', borderRadius: 4 }}>CANCELLED</span>
                      )}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 13, marginBottom: 2 }}>
                      {new Date(c.startTime).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ color: '#6440FB', fontSize: 12, fontWeight: 600 }}>
                      {new Date(c.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#140342' }}>{c.batch?.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{c.batch?.course?.title}</div>
                  </td>
                  <td style={{ color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
                        {c.trainer?.name?.charAt(0)}
                      </div>
                      {c.trainer?.name}
                    </div>
                  </td>
                  <td>
                    {c.status !== 'CANCELLED' && c.meetLink && tab === 'UPCOMING' ? (
                      <a href={c.meetLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '6px 12px', fontSize: 12 }}>
                        Join Meeting
                      </a>
                    ) : c.status !== 'CANCELLED' && tab === 'UPCOMING' ? (
                      <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Link not added yet</span>
                    ) : c.status !== 'CANCELLED' && tab === 'PAST' && c.recordingUrl ? (
                      <button onClick={() => setViewVideoUrl(c.recordingUrl)} className="btn-secondary" style={{ border: 'none', background: 'transparent', color: '#6440FB', padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch Recording
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Video Player Modal */}
      {viewVideoUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 40 }}>
          <div style={{ width: '100%', maxWidth: 1080, background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
              <button onClick={() => setViewVideoUrl(null)} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={getEmbedUrl(viewVideoUrl)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
