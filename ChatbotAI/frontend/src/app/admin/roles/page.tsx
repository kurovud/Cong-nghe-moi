const RolesPage = () => {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <h1>Vai trò & phân quyền</h1>
        <p className="muted">
          Thiết lập quyền truy cập kho tri thức, cấu hình hệ thống và giám sát vận hành.
        </p>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3>Admin</h3>
          <p className="muted">Toàn quyền CRUD dữ liệu, cấu hình RAG, quản lý người dùng.</p>
        </div>
        <div className="card">
          <h3>CSKH</h3>
          <p className="muted">Theo dõi hội thoại, xử lý complaint/ticket, handoff.</p>
        </div>
        <div className="card">
          <h3>Manager</h3>
          <p className="muted">Xem báo cáo KPI, phân tích rating và hiệu quả cache.</p>
        </div>
        <div className="card">
          <h3>Data Engineer</h3>
          <p className="muted">Quản lý pipeline ETL, chunking, embedding và version.</p>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
