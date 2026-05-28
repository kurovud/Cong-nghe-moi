import React from "react";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0, color: "var(--text)" }}>Không tìm thấy trang</h2>
      <p style={{ color: "var(--text-3)" }}>Trang bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
    </div>
  );
}
