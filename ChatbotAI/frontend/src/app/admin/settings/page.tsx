"use client";

import { useEffect, useState } from "react";

interface SettingsState {
  topK: number;
  similarityThreshold: number;
  cacheTTL: number;
  routingMode: string;
}

const defaultSettings: SettingsState = {
  topK: 5,
  similarityThreshold: 0.72,
  cacheTTL: 3600,
  routingMode: "balanced"
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("chatbox-settings");
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("chatbox-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>⚙️ Cấu hình RAG & Routing</h1>
          <p>Thiết lập tham số Top-K, ngưỡng similarity, TTL cache và chiến lược routing cho chatbot</p>
        </div>
      </div>

      {saved && <div className="notice notice--success" style={{ marginBottom: "1rem" }}>✅ Đã lưu cấu hình thành công!</div>}

      <div className="admin-table-wrap" style={{ padding: "1.5rem" }}>
        <div style={{ display: "grid", gap: "1rem", maxWidth: 520 }}>
          <div className="form-group">
            <label>Top-K (số lượng kết quả tìm kiếm)</label>
            <input
              type="number"
              min={1}
              max={20}
              value={settings.topK}
              onChange={(e) => setSettings({ ...settings, topK: Number(e.target.value) })}
            />
            <p className="form-hint">Số đoạn văn bản trả về từ RAG pipeline</p>
          </div>

          <div className="form-group">
            <label>Ngưỡng cosine similarity</label>
            <input
              type="number"
              step="0.01"
              min={0}
              max={1}
              value={settings.similarityThreshold}
              onChange={(e) => setSettings({ ...settings, similarityThreshold: Number(e.target.value) })}
            />
            <p className="form-hint">Tối thiểu 0 → 1. Giá trị cao = kết quả chính xác hơn nhưng ít hơn</p>
          </div>

          <div className="form-group">
            <label>TTL cache (giây)</label>
            <input
              type="number"
              min={60}
              value={settings.cacheTTL}
              onChange={(e) => setSettings({ ...settings, cacheTTL: Number(e.target.value) })}
            />
            <p className="form-hint">Thời gian lưu cache kết quả tìm kiếm (mặc định 3600s = 1 giờ)</p>
          </div>

          <div className="form-group">
            <label>Chiến lược semantic routing</label>
            <select
              value={settings.routingMode}
              onChange={(e) => setSettings({ ...settings, routingMode: e.target.value })}
            >
              <option value="balanced">Balanced — Cân bằng</option>
              <option value="cost-saving">Ưu tiên tiết kiệm chi phí</option>
              <option value="accuracy">Ưu tiên độ chính xác</option>
            </select>
            <p className="form-hint">Ảnh hưởng đến cách chatbot chọn model xử lý câu hỏi</p>
          </div>

          <div style={{ paddingTop: "0.5rem" }}>
            <button type="button" className="btn btn--primary" aria-label="Lưu cấu hình" onClick={handleSave}>💾 Lưu cấu hình</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
