'use client';

export default function AdminCoursesPage() {
  const courses = [
    { title: 'Data Science & AI with Python', duration: '11 Months', cat: 'Flagship', color: '#6440FB', students: 0 },
    { title: 'Deep Learning with Python', duration: '6 Months', cat: 'Advanced', color: '#8B5CF6', students: 0 },
    { title: 'Machine Learning with Python', duration: '6 Months', cat: 'Advanced', color: '#7C3AED', students: 0 },
    { title: 'Data Science with Python', duration: '4 Months', cat: 'Intermediate', color: '#2563EB', students: 0 },
    { title: 'Data Analytics with Python', duration: '4 Months', cat: 'Intermediate', color: '#0891B2', students: 0 },
    { title: 'Business Analytics', duration: '3 Months', cat: 'Professional', color: '#059669', students: 0 },
    { title: 'Data Visualisation — Power BI', duration: '2 Months', cat: 'Specialisation', color: '#D97706', students: 0 },
    { title: 'Data Visualisation — Tableau', duration: '2 Months', cat: 'Specialisation', color: '#DC2626', students: 0 },
  ];

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">Courses</h1>
          <p className="admin-page-subtitle">All available LearnzLab programs and courses.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {courses.map((c, i) => (
          <div key={i} className="admin-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: 5, background: `linear-gradient(90deg, ${c.color}, ${c.color}80)` }} />
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ background: `${c.color}15`, color: c.color, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                  {c.cat}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {c.duration}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#140342', lineHeight: 1.35, fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 14 }}>
                {c.title}
              </h3>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {c.students} enrolled
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Live classes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
