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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    color: 'var(--text)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font)',
    outline: 'none',
    transition: 'border-color 0.3s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'var(--text)',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  };

  const hintStyle: React.CSSProperties = {
    color: 'var(--text-3)',
    fontSize: '0.8rem',
    marginTop: '0.4rem',
    lineHeight: 1.4,
  };

  const settingsGroups = [
    {
      icon: '🔍',
      title: 'Top-K (số lượng kết quả tìm kiếm)',
      hint: 'Số đoạn văn bản trả về từ RAG pipeline',
      type: 'number',
      min: 1,
      max: 20,
      value: settings.topK,
      onChange: (v: string) => setSettings({ ...settings, topK: Number(v) }),
    },
    {
      icon: '🎯',
      title: 'Ngưỡng cosine similarity',
      hint: 'Tối thiểu 0 → 1. Giá trị cao = kết quả chính xác hơn nhưng ít hơn',
      type: 'number',
      step: '0.01',
      min: 0,
      max: 1,
      value: settings.similarityThreshold,
      onChange: (v: string) => setSettings({ ...settings, similarityThreshold: Number(v) }),
    },
    {
      icon: '⏱️',
      title: 'TTL cache (giây)',
      hint: 'Thời gian lưu cache kết quả tìm kiếm (mặc định 3600s = 1 giờ)',
      type: 'number',
      min: 60,
      value: settings.cacheTTL,
      onChange: (v: string) => setSettings({ ...settings, cacheTTL: Number(v) }),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--text)',
          margin: '0 0 0.35rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>⚙️ Cấu hình RAG & Routing</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: 0 }}>
          Thiết lập tham số Top-K, ngưỡng similarity, TTL cache và chiến lược routing cho chatbot
        </p>
      </div>

      {/* Success Toast */}
      {saved && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--r)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          color: 'var(--green)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>✅ Đã lưu cấu hình thành công!</div>
      )}

      {/* Settings Form */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        padding: '2rem',
        backdropFilter: 'blur(20px)',
        maxWidth: 600,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {settingsGroups.map((group, idx) => (
            <div key={idx} style={{
              padding: '1.25rem',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r)',
              transition: 'border-color 0.3s',
            }}>
              <label style={labelStyle}>
                <span style={{ marginRight: '0.4rem' }}>{group.icon}</span>
                {group.title}
              </label>
              <input
                type={group.type}
                min={group.min}
                max={group.max}
                step={(group as any).step}
                value={group.value}
                onChange={(e) => group.onChange(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
              <p style={hintStyle}>{group.hint}</p>
            </div>
          ))}

          {/* Routing Mode */}
          <div style={{
            padding: '1.25rem',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r)',
          }}>
            <label style={labelStyle}>
              <span style={{ marginRight: '0.4rem' }}>🧭</span>
              Chiến lược semantic routing
            </label>
            <select
              value={settings.routingMode}
              onChange={(e) => setSettings({ ...settings, routingMode: e.target.value })}
              style={{
                ...inputStyle,
                cursor: 'pointer',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <option value="balanced">Balanced — Cân bằng</option>
              <option value="cost-saving">Ưu tiên tiết kiệm chi phí</option>
              <option value="accuracy">Ưu tiên độ chính xác</option>
            </select>
            <p style={hintStyle}>Ảnh hưởng đến cách chatbot chọn model xử lý câu hỏi</p>
          </div>

          {/* Save Button */}
          <div style={{ paddingTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-primary"
              aria-label="Lưu cấu hình"
              onClick={handleSave}
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >💾 Lưu cấu hình</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
