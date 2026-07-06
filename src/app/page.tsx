import Link from "next/link";
import Image from "next/image";


export default function Home() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.6; }
        }
        .hero-nav-link {
          color: rgba(255,255,255,0.82); text-decoration: none;
          font-weight: 600; font-size: 15px; padding: 6px 2px;
          transition: color 0.2s; position: relative;
        }
        .hero-nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 2px; background: #fff;
          transition: width 0.25s;
        }
        .hero-nav-link:hover { color: #fff; }
        .hero-nav-link:hover::after { width: 100%; }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: #6440FB; color: #fff; border: none;
          padding: 16px 36px; border-radius: 50px; font-size: 17px;
          font-weight: 700; cursor: pointer; text-decoration: none;
          box-shadow: 0 8px 32px rgba(100,64,251,0.45);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .hero-btn-primary:hover {
          background: #5027fa; transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(100,64,251,0.55); color: #fff;
        }
        .hero-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #fff;
          border: 2px solid rgba(255,255,255,0.4);
          padding: 14px 32px; border-radius: 50px; font-size: 17px;
          font-weight: 600; cursor: pointer; text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .hero-btn-outline:hover {
          border-color: #fff; background: rgba(255,255,255,0.08); color: #fff;
        }
        .nav-link {
          color: #4F547B; text-decoration: none; font-weight: 600;
          font-size: 15px; padding: 8px 4px;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 2px; background: #6440FB;
          transition: width 0.2s;
        }
        .nav-link:hover { color: #6440FB; }
        .nav-link:hover::after { width: 100%; }
        .feature-card {
          background: #fff; border-radius: 20px; padding: 36px 32px;
          border: 1px solid #e8edf5;
          box-shadow: 0 4px 24px rgba(20,3,66,0.06);
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(100,64,251,0.14);
          border-color: #6440FB40;
        }
        .feature-icon {
          width: 64px; height: 64px; border-radius: 16px;
          background: linear-gradient(135deg, #6440FB20, #6440FB10);
          display: flex; align-items: center; justify-center: center;
          margin-bottom: 24px;
          transition: transform 0.3s;
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }
        .stat-item {
          text-align: center; padding: 0 32px;
        }
        .stat-item + .stat-item {
          border-left: 1px solid #e8edf5;
        }
        .course-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8edf5;
          box-shadow: 0 2px 12px rgba(20,3,66,0.05);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(100,64,251,0.12);
        }
        .course-btn {
          display: block; width: 100%; padding: 12px;
          background: #6440FB10; color: #6440FB;
          border: none; border-top: 1px solid #e8edf5;
          font-weight: 700; font-size: 14px; cursor: pointer;
          text-decoration: none; text-align: center;
          transition: background 0.2s, color 0.2s;
          font-family: inherit;
        }
        .course-btn:hover { background: #6440FB; color: #fff; }
        .testimonial-card {
          background: #fff; border-radius: 20px; padding: 32px;
          border: 1px solid #e8edf5;
          box-shadow: 0 4px 20px rgba(20,3,66,0.06);
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 40px; border-radius: 50px; font-size: 17px;
          font-weight: 700; cursor: pointer; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-btn:hover { transform: translateY(-2px); }
        .footer-link {
          color: #a0aec0; text-decoration: none; font-size: 14px;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #fff; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f8f9fc', fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* ─── HERO WRAPPER (contains transparent navbar + hero) ─── */}
        <div style={{ position: 'relative' }}>
        {/* ─── NAVBAR — transparent, floats over hero ─── */}
        <header style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'transparent',
          padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 80,
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            {/* White-tinted logo for dark hero background */}
            <Image src="/logo.png" alt="LearnzLab" width={160} height={52} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} priority />
          </Link>

          <nav style={{ display: 'flex', gap: 36 }}>
            {[
              { href: '#courses', label: 'Courses' },
              { href: '#features', label: 'Why Us' },
              { href: '#testimonials', label: 'Reviews' },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="hero-nav-link">{label}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{
              color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: 600,
              fontSize: 15, padding: '10px 28px', borderRadius: 10,
              border: '1.5px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s, border-color 0.2s',
            }}>Sign In</Link>
          </div>
        </header>

        {/* ─── HERO ─── */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #0a0118 0%, #140342 50%, #1a0a5e 100%)',
          minHeight: '90vh',
          display: 'flex', alignItems: 'center',
        }}>
          {/* Background image */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
            <Image src="/hero.jpg" alt="Data Science AI" fill style={{ objectFit: 'cover', objectPosition: 'right center' }} priority />
          </div>
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(10,1,24,0.97) 0%, rgba(10,1,24,0.8) 45%, rgba(10,1,24,0.2) 100%)',
          }} />
          {/* Animated blobs */}
          <div style={{
            position: 'absolute', top: '15%', left: '30%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(100,64,251,0.25), transparent 70%)',
            animation: 'pulse 6s ease-in-out infinite',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '15%',
            width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
            animation: 'pulse 8s ease-in-out infinite 2s',
            borderRadius: '50%',
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '80px 40px', width: '100%' }}>
            <div style={{ maxWidth: 650, animation: 'fadeUp 0.8s ease forwards' }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(100,64,251,0.2)', border: '1px solid rgba(100,64,251,0.5)',
                color: '#a78bfa', borderRadius: 50, padding: '8px 18px',
                fontSize: 13, fontWeight: 700, marginBottom: 28,
                letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
                India's #1 Data Science Institute
              </div>

              <h1 style={{
                fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.08,
                color: '#fff', marginBottom: 28,
                fontFamily: "'Jost', 'Inter', sans-serif",
                letterSpacing: '-1.5px',
              }}>
                Master <span style={{
                  background: 'linear-gradient(90deg, #a78bfa, #6440FB, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Data Science</span><br />& Artificial Intelligence
              </h1>

              <p style={{
                fontSize: 19, lineHeight: 1.7, color: 'rgba(255,255,255,0.72)',
                marginBottom: 44, maxWidth: 560,
              }}>
                Build real-world skills with expert-led live courses, hands-on projects, and guaranteed placement assistance to launch your data career.
              </p>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="hero-btn-primary">
                  Explore Courses
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/login" className="hero-btn-outline">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </Link>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 48 }}>
                <div style={{ display: 'flex' }}>
                  {[11,12,13,14,15].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/48?img=${i}`} alt="Student"
                      style={{
                        width: 40, height: 40, borderRadius: '50%',
                        border: '2px solid #1a0a5e', marginLeft: i === 11 ? 0 : -10,
                        objectFit: 'cover',
                      }} />
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', marginBottom: 4 }}>
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} style={{ color: '#fbbf24', fontSize: 15 }}>★</span>
                    ))}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                    <strong style={{ color: '#fff' }}>500+</strong> careers transformed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>{/* end hero wrapper */}

        {/* ─── STATS BAND ─── */}
        <section style={{
          background: '#fff',
          borderBottom: '1px solid #e8edf5',
          boxShadow: '0 4px 32px rgba(20,3,66,0.06)',
        }}>
          <div style={{
            maxWidth: 1000, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            padding: '40px 40px',
          }}>
            {[
              { value: '100%', label: 'Placement Assistance' },
              { value: '8+', label: 'Years Industry Experts' },
              { value: '12+', label: 'Hands-on Projects' },
              { value: '₹10L+', label: 'Highest CTC Achieved' },
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div style={{
                  fontSize: 40, fontWeight: 900, color: '#140342',
                  fontFamily: "'Jost', 'Inter', sans-serif", lineHeight: 1.1, marginBottom: 8,
                  background: 'linear-gradient(135deg, #140342, #6440FB)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{stat.value}</div>
                <div style={{ color: '#4F547B', fontWeight: 600, fontSize: 14 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── COURSES ─── */}
        <section id="courses" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-block', background: '#6440FB12', color: '#6440FB',
              borderRadius: 50, padding: '6px 18px', fontSize: 13,
              fontWeight: 700, marginBottom: 16, letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Our Programs</div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: '#140342',
              fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 16, letterSpacing: '-0.5px',
            }}>Courses Designed for Your Career</h2>
            <p style={{ fontSize: 17, color: '#4F547B', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
              Industry-aligned programs from beginner to expert, built with real hiring needs in mind.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 24 }}>
            {[
              { title: 'Data Science & AI with Python', duration: '11 Months', cat: 'Flagship', color: '#6440FB', badge: 'Most Popular' },
              { title: 'Deep Learning with Python', duration: '6 Months', cat: 'Advanced', color: '#8B5CF6', badge: null },
              { title: 'Machine Learning with Python', duration: '6 Months', cat: 'Advanced', color: '#7C3AED', badge: null },
              { title: 'Data Science with Python', duration: '4 Months', cat: 'Intermediate', color: '#2563EB', badge: null },
              { title: 'Data Analytics with Python', duration: '4 Months', cat: 'Intermediate', color: '#0891B2', badge: null },
              { title: 'Business Analytics', duration: '3 Months', cat: 'Professional', color: '#059669', badge: null },
              { title: 'Data Visualisation — Power BI', duration: '2 Months', cat: 'Specialisation', color: '#D97706', badge: null },
              { title: 'Data Visualisation — Tableau', duration: '2 Months', cat: 'Specialisation', color: '#DC2626', badge: null },
            ].map((course, i) => (
              <div key={i} className="course-card">
                {/* Card top strip */}
                <div style={{ height: 6, background: `linear-gradient(90deg, ${course.color}, ${course.color}80)` }} />
                <div style={{ padding: '24px 24px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{
                      background: `${course.color}15`, color: course.color,
                      borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700,
                    }}>{course.cat}</span>
                    {course.badge && (
                      <span style={{
                        background: '#6440FB', color: '#fff',
                        borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700,
                      }}>⭐ {course.badge}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#140342', marginBottom: 10, lineHeight: 1.35, fontFamily: "'Jost', 'Inter', sans-serif" }}>
                    {course.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4F547B', fontSize: 14 }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration} • Live Classes
                  </div>
                </div>
                <Link href="/login" className="course-btn">Sign In to Enroll →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section id="features" style={{ padding: '80px 40px', background: 'linear-gradient(180deg, #f0edff 0%, #f8f9fc 100%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{
                display: 'inline-block', background: '#6440FB12', color: '#6440FB',
                borderRadius: 50, padding: '6px 18px', fontSize: 13,
                fontWeight: 700, marginBottom: 16, letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>Why Choose Us</div>
              <h2 style={{
                fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: '#140342',
                fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 16, letterSpacing: '-0.5px',
              }}>The LearnzLab Difference</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
              {[
                {
                  icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
                  title: 'Expert-Led Live Sessions',
                  desc: 'Learn directly from 8+ year industry veterans through interactive live sessions with real-world case studies.',
                },
                {
                  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
                  title: 'Structured Curriculum',
                  desc: 'Industry-vetted, regularly updated curriculum that takes you from fundamentals to advanced practitioner.',
                },
                {
                  icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  title: '100% Placement Support',
                  desc: 'Dedicated placement drives, mock interviews, resume building, and direct connections with hiring companies.',
                },
                {
                  icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
                  title: 'Hands-on Projects',
                  desc: 'Build 12+ real-world projects that go straight into your portfolio, giving you an edge with employers.',
                },
                {
                  icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
                  title: 'Industry Certification',
                  desc: 'Earn certificates recognised by top companies that validate your skills and boost your professional credibility.',
                },
                {
                  icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
                  title: 'Mentorship & Community',
                  desc: 'Get personal guidance from mentors and stay connected with a growing community of 1000+ data professionals.',
                },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#6440FB" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#140342', marginBottom: 12, fontFamily: "'Jost', 'Inter', sans-serif" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 15, color: '#4F547B', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section id="testimonials" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-block', background: '#6440FB12', color: '#6440FB',
              borderRadius: 50, padding: '6px 18px', fontSize: 13,
              fontWeight: 700, marginBottom: 16, letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Student Reviews</div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: '#140342',
              fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 16, letterSpacing: '-0.5px',
            }}>Careers We've Transformed</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { name: 'Priya Sharma', role: 'Data Analyst @ Accenture', avatar: 21, stars: 5, text: 'LearnzLab completely changed my career trajectory. The live sessions were incredibly practical and the placement support was outstanding.' },
              { name: 'Rahul Verma', role: 'ML Engineer @ Infosys', avatar: 33, stars: 5, text: 'The curriculum is perfectly structured. Within 6 months I went from zero knowledge to landing a job at a top IT company with ₹8L CTC.' },
              { name: 'Anjali Nair', role: 'Data Scientist @ Flipkart', avatar: 44, stars: 5, text: 'Best investment I made in my career. The mentors are very experienced and the hands-on projects helped me build a strong portfolio.' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div style={{ display: 'flex', marginBottom: 16 }}>
                  {'★★★★★'.split('').map((_, si) => (
                    <span key={si} style={{ color: '#fbbf24', fontSize: 18 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#4F547B', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`https://i.pravatar.cc/56?img=${t.avatar}`} alt={t.name}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6440FB20' }} />
                  <div>
                    <div style={{ fontWeight: 800, color: '#140342', fontSize: 15, fontFamily: "'Jost', 'Inter', sans-serif" }}>{t.name}</div>
                    <div style={{ color: '#6440FB', fontSize: 13, fontWeight: 600 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section style={{ padding: '0 40px 100px' }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            background: 'linear-gradient(135deg, #140342 0%, #6440FB 60%, #8B5CF6 100%)',
            borderRadius: 28, padding: '72px 64px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 40, flexWrap: 'wrap',
            boxShadow: '0 24px 80px rgba(100,64,251,0.3)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 300, height: 300, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: 200,
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#fff',
                fontFamily: "'Jost', 'Inter', sans-serif", marginBottom: 12, letterSpacing: '-0.5px',
              }}>Ready to Start Your Journey?</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, maxWidth: 480, lineHeight: 1.6 }}>
                Join 500+ students who have already transformed their careers with LearnzLab.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <Link href="/login" className="cta-btn" style={{
                background: '#fff', color: '#6440FB',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}>
                Sign In to Portal
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/login" className="cta-btn" style={{
                background: 'transparent', color: '#fff',
                border: '2px solid rgba(255,255,255,0.4)',
              }}>
                Access Portal
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ background: '#0a0118', padding: '56px 40px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40, marginBottom: 48 }}>
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Image src="/logo.png" alt="LearnzLab" width={140} height={46} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                </div>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
                  India's leading data science institute with 100% placement assistance and expert-led training.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programs</h4>
                  {['Data Science & AI', 'Machine Learning', 'Deep Learning', 'Data Analytics'].map(l => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <a href="#courses" className="footer-link">{l}</a>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company</h4>
                  {['About Us', 'Careers', 'Blog', 'Contact'].map(l => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <a href="#" className="footer-link">{l}</a>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Portal</h4>
                  {[
                    { label: 'Student Login', href: '/login' },
                    { label: 'Admin Portal', href: '/admin' },
                    { label: 'Student Portal', href: '/login' },
                  ].map(l => (
                    <div key={l.label} style={{ marginBottom: 10 }}>
                      <Link href={l.href} className="footer-link">{l.label}</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #1f2937', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ color: '#4b5563', fontSize: 13 }}>© 2026 LearnzLab. All rights reserved.</p>
              <p style={{ color: '#4b5563', fontSize: 13 }}>Chennai, Tamil Nadu, India</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
