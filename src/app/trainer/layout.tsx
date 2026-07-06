import TrainerSidebar from '@/components/trainer/TrainerSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar'; // Reusing generic topbar

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }
        .admin-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
        .admin-page-header {
          margin-bottom: 28px;
        }
        .admin-page-title {
          font-size: 26px;
          font-weight: 900;
          color: #140342;
          font-family: 'Jost', 'Inter', sans-serif;
          letter-spacing: -0.3px;
          margin: 0 0 4px;
        }
        .admin-page-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(20,3,66,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20,3,66,0.09);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .admin-table th {
          background: #f8fafc;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #4F547B;
          vertical-align: middle;
        }
        .admin-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(20,3,66,0.05);
          overflow: hidden;
        }
        .btn-primary {
          background: #6440FB;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          alignItems: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background: #5027fa;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: #fff;
          color: #4F547B;
          border: 1.5px solid #e2e8f0;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
      `}</style>

      <div className="admin-shell">
        <TrainerSidebar />
        <div className="admin-main">
          <AdminTopbar />
          <main className="admin-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
