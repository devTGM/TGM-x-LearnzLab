import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
        @media (max-width: 767px) {
          .admin-content {
            padding: 16px;
            padding-bottom: 84px;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .admin-content { padding: 24px; }
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
          color: #64748b;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #374151;
          vertical-align: middle;
        }
        .admin-table tr:hover td {
          background: #fafbff;
        }
        .admin-table tr:last-child td {
          border-bottom: none;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
        }
        .badge-admin { background: #ede9fe; color: #6440FB; }
        .badge-trainer { background: #d1fae5; color: #059669; }
        .badge-student { background: #dbeafe; color: #2563EB; }
        .badge-active { background: #d1fae5; color: #059669; }
        .badge-inactive { background: #f1f5f9; color: #64748b; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #6440FB; color: #fff; border: none;
          padding: 10px 20px; border-radius: 10px; font-size: 14px;
          font-weight: 700; cursor: pointer; font-family: inherit;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-primary:hover { background: #5027fa; transform: translateY(-1px); color: #fff; }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #374151;
          border: 1.5px solid #e2e8f0;
          padding: 9px 18px; border-radius: 10px; font-size: 14px;
          font-weight: 600; cursor: pointer; font-family: inherit;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-secondary:hover { border-color: #6440FB; color: #6440FB; }
        .btn-danger {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff1f2; color: #be123c;
          border: 1.5px solid #fecdd3;
          padding: 7px 14px; border-radius: 8px; font-size: 13px;
          font-weight: 600; cursor: pointer; font-family: inherit;
          transition: background 0.2s;
        }
        .btn-danger:hover { background: #ffe4e6; }
        .btn-edit {
          display: inline-flex; align-items: center; gap: 6px;
          background: #ede9fe; color: #6440FB;
          border: none;
          padding: 7px 14px; border-radius: 8px; font-size: 13px;
          font-weight: 600; cursor: pointer; font-family: inherit;
          transition: background 0.2s;
        }
        .btn-edit:hover { background: #ddd6fe; }
        .admin-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(20,3,66,0.05);
          overflow: hidden;
        }
        .admin-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-card-title {
          font-size: 16px;
          font-weight: 800;
          color: #140342;
          font-family: 'Jost', 'Inter', sans-serif;
          margin: 0;
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #140342;
          background: #fafbff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #6440FB;
          box-shadow: 0 0 0 3px rgba(100,64,251,0.1);
          background: #fff;
        }
        .form-select {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #140342;
          background: #fafbff;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
          cursor: pointer;
          box-sizing: border-box;
        }
        .form-select:focus {
          border-color: #6440FB;
          box-shadow: 0 0 0 3px rgba(100,64,251,0.1);
        }
        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(10,1,24,0.5);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal-box {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 24px 64px rgba(10,1,24,0.2);
          animation: modalIn 0.2s ease;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-title {
          font-size: 18px; font-weight: 900; color: #140342;
          font-family: 'Jost', 'Inter', sans-serif; margin: 0;
        }
        .modal-body { padding: 24px 28px; }
        .modal-footer {
          padding: 16px 28px 24px;
          display: flex; gap: 12px; justify-content: flex-end;
        }
        .close-btn {
          background: #f1f5f9; border: none; color: #64748b;
          width: 32px; height: 32px; border-radius: 8px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover { background: #e2e8f0; color: #374151; }
      `}</style>

      <div className="admin-shell">
        <AdminSidebar />
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
