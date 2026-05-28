"use client";

import React from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0, color: "var(--text)" }}>Đã xảy ra lỗi</h2>
      <p style={{ color: "var(--text-3)" }}>{String(error?.message || "Không rõ lỗi")}</p>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => reset && reset()} style={{ padding: "0.6rem 0.9rem", borderRadius: 8, background: "var(--grad-brand)", border: "none", color: "#050d1a", fontWeight: 700 }}>Thử lại</button>
      </div>
    </div>
  );
}
