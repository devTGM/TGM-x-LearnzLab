import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blobPulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50%       { transform: scale(1.12); opacity: 0.55; }
        }
        .auth-input {
          width: 100%; padding: 13px 16px 13px 44px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; color: #140342; background: #fafbff;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .auth-input:focus {
          border-color: #6440FB;
          box-shadow: 0 0 0 4px rgba(100,64,251,0.1);
          background: #fff;
        }
        .auth-input::placeholder { color: #a0aec0; }
        .auth-input-noicon {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; color: #140342; background: #fafbff;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .auth-input-noicon:focus {
          border-color: #6440FB;
          box-shadow: 0 0 0 4px rgba(100,64,251,0.1);
          background: #fff;
        }
        .auth-input-noicon::placeholder { color: #a0aec0; }
        .auth-submit-btn {
          width: 100%; padding: 14px; border-radius: 12px;
          background: linear-gradient(135deg, #6440FB, #8B5CF6);
          color: #fff; border: none; font-size: 16px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 6px 24px rgba(100,64,251,0.38);
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .auth-submit-btn:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(100,64,251,0.45);
        }
        .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .stat-pill {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px; padding: 16px 24px;
          text-align: center; color: #fff;
        }
        .feature-check {
          display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px;
        }
        .check-icon {
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
        }
        .auth-right-panel {
          flex: 1; position: relative; overflow: hidden;
          background: linear-gradient(145deg, #0a0118 0%, #140342 40%, #2d1b8e 70%, #6440FB 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 64px 56px;
        }
        @media (max-width: 767px) {
          .auth-right-panel { display: none !important; }
          .auth-form-panel {
            max-width: 100% !important;
            padding: 32px 24px !important;
            min-height: 100vh;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .auth-right-panel { padding: 40px 32px; }
          .auth-form-panel { padding: 40px 40px !important; max-width: 400px !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
        
        {/* ── LEFT: Form Panel ── */}
        <div className="auth-form-panel" style={{
          width: '100%', maxWidth: 520,
          background: '#fff', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '48px 56px',
          boxShadow: '4px 0 32px rgba(20,3,66,0.06)',
          position: 'relative', zIndex: 10,
          overflowY: 'auto',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'inline-block', marginBottom: 40 }}>
            <Image src="/logo.png" alt="LearnzLab" width={150} height={50} style={{ objectFit: 'contain' }} />
          </Link>

          {/* Page Content (login or register form) */}
          <div style={{ animation: 'floatUp 0.5s ease forwards' }}>
            {children}
          </div>
        </div>

        {/* ── RIGHT: Brand Panel ── */}
        <div className="auth-right-panel">
          {/* Grid pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          {/* Animated glows */}
          <div style={{
            position: 'absolute', top: '10%', right: '10%',
            width: 380, height: 380, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,64,251,0.5), transparent 70%)',
            animation: 'blobPulse 7s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '5%', left: '5%',
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
            animation: 'blobPulse 9s ease-in-out infinite 3s',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 460, width: '100%' }}>
            {/* Hero image */}
            <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 90, height: 90, borderRadius: 24,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
            </div>

            <h2 style={{
              fontSize: 38, fontWeight: 900, color: '#fff', lineHeight: 1.15,
              marginBottom: 16, fontFamily: "'Jost', 'Inter', sans-serif",
              letterSpacing: '-0.5px',
            }}>
              Your Path to<br />
              <span style={{
                background: 'linear-gradient(90deg, #c4b5fd, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Data Mastery</span><br />
              Starts Here
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, marginBottom: 40,
            }}>
              Join thousands of learners building industry-ready skills with India's best Data Science institute.
            </p>

            {/* Feature list */}
            {[
              'Expert-led live sessions with real-world projects',
              '100% placement assistance & interview prep',
              'Industry-recognised certification on completion',
              'Mentorship from 8+ year industry professionals',
            ].map((f, i) => (
              <div key={i} className="feature-check">
                <div className="check-icon">
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}

            {/* Stats pills */}
            <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
              <div className="stat-pill">
                <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>500+</div>
                <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 600 }}>CAREERS<br/>TRANSFORMED</div>
              </div>
              <div className="stat-pill">
                <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>100%</div>
                <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 600 }}>PLACEMENT<br/>ASSISTANCE</div>
              </div>
              <div className="stat-pill">
                <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>₹10L+</div>
                <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 600 }}>HIGHEST<br/>CTC ACHIEVED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
