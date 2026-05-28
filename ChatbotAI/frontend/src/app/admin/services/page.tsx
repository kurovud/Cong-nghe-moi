"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceCatalogItem } from "@/lib/serviceCatalog";
import { DEFAULT_SERVICES, loadServiceCatalog, saveServiceCatalog } from "@/lib/serviceCatalog";

const CATEGORY_LABELS: Record<ServiceCatalogItem["category"], string> = {
  assembly: "Lắp Ráp",
  delivery: "Vận Chuyển",
  support: "Hỗ Trợ",
  consultation: "Tư Vấn",
};

const CATEGORY_ICONS: Record<string, string> = {
  assembly: "🔧",
  delivery: "🚚",
  support: "🛠️",
  consultation: "💬",
};

const EMPTY_SERVICE: ServiceCatalogItem = {
  id: "",
  name: "",
  category: "support",
  price: 0,
  description: "",
  features: [],
  icon: "🔧",
  duration: "",
  inStock: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceCatalogItem[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceCatalogItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceCatalogItem | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/services");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setServices(data);
            setLoading(false);
            return;
          }
          if (Array.isArray((data as any).services)) {
            setServices((data as any).services);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // ignore and fall back
      }
      setServices(loadServiceCatalog());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) saveServiceCatalog(services);
  }, [services, loading]);

  const stats = useMemo(
    () => ({
      total: services.length,
      assembly: services.filter((s) => s.category === "assembly").length,
      delivery: services.filter((s) => s.category === "delivery").length,
      support: services.filter((s) => s.category === "support").length,
      consultation: services.filter((s) => s.category === "consultation").length,
    }),
    [services]
  );

  const openAdd = () => {
    setEditing({ ...EMPTY_SERVICE, id: `service-${Date.now()}` });
    setFeatureInput("");
    setShowForm(true);
  };

  const openEdit = (s: ServiceCatalogItem) => {
    setEditing(s);
    setFeatureInput(s.features.join(", "));
    setShowForm(true);
  };

  const save = async () => {
    if (!editing) return;
    const features = featureInput.split(",").map((f) => f.trim()).filter(Boolean);
    const updated = { ...editing, features };

    let next: ServiceCatalogItem[];
    if (services.find((s) => s.id === updated.id)) {
      next = services.map((s) => (s.id === updated.id ? updated : s));
      setServices(next);
    } else {
      next = [...services, updated];
      setServices(next);
    }
    setShowForm(false);
    setEditing(null);

    try {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: next }),
      });
    } catch {
      // ignore persistence errors
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    const next = services.filter((s) => s.id !== deleteTarget.id);
    setServices(next);
    setDeleteTarget(null);
    try {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: next }),
      });
    } catch {
      // ignore
    }
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
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'var(--text-2)',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  const statCards = [
    { label: 'Tổng số', val: stats.total, icon: '📊', gradient: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.04))' },
    { label: 'Lắp ráp', val: stats.assembly, icon: '🔧', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))' },
    { label: 'Vận chuyển', val: stats.delivery, icon: '🚚', gradient: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))' },
    { label: 'Hỗ trợ', val: stats.support, icon: '🛠️', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))' },
    { label: 'Tư vấn', val: stats.consultation, icon: '💬', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 0.35rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>🛠️ Quản lý Dịch vụ</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: 0 }}>Quản lý tất cả dịch vụ lắp ráp, vận chuyển và hỗ trợ</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={openAdd}
          style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ➕ Thêm dịch vụ
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: s.gradient,
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.25rem',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.35rem' }}>{s.icon}</span>
            <strong style={{
              display: 'block',
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text)',
            }}>{s.val}</strong>
            <span style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-2)' }}>
                {['Dịch vụ', 'Danh mục', 'Giá', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} style={{
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    color: 'var(--text-3)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: 'var(--surface-2)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.2s',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        fontSize: '1.5rem',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--surface-2)',
                        borderRadius: 'var(--r-sm)',
                      }}>{s.icon}</span>
                      <div>
                        <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{s.name}</span>
                        <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontFamily: 'monospace' }}>{s.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{
                      padding: '0.3rem 0.75rem',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      color: 'var(--text-2)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}>
                      {CATEGORY_ICONS[s.category]} {CATEGORY_LABELS[s.category]}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{
                      color: 'var(--cyan)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-heading)',
                    }}>{s.price.toLocaleString()}đ</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--r-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: s.inStock ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: s.inStock ? 'var(--green)' : 'var(--red)',
                      border: `1px solid ${s.inStock ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: s.inStock ? 'var(--green)' : 'var(--red)',
                      }} />
                      {s.inStock ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        style={{
                          width: 34,
                          height: 34,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--r-sm)',
                          background: 'rgba(0,212,255,0.1)',
                          border: '1px solid rgba(0,212,255,0.2)',
                          color: 'var(--cyan)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.85rem',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.2)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
                      >✏️</button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(s)}
                        style={{
                          width: 34,
                          height: 34,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--r-sm)',
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          color: 'var(--red)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.85rem',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showForm && editing && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--r-xl)',
              width: '100%',
              maxWidth: 640,
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              margin: '2rem 0',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface)',
            }}>
              <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', margin: 0 }}>
                {editing.id.startsWith("service-") && !services.find(s => s.id === editing.id) ? "➕ Thêm dịch vụ mới" : "✏️ Chỉnh sửa dịch vụ"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-3)',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  lineHeight: 1,
                }}
              >×</button>
            </div>
            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Tên dịch vụ</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Danh mục</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Giá (VNĐ)</label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mô tả ngắn</label>
                <input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Đặc điểm (cách nhau bởi dấu phẩy)</label>
                <textarea
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Biểu tượng (Emoji)</label>
                  <input
                    value={editing.icon}
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Thời gian hoàn thành</label>
                  <input
                    placeholder="Ví dụ: 2-4 giờ"
                    value={editing.duration}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  onClick={() => setEditing({ ...editing, inStock: !editing.inStock })}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: editing.inStock ? 'var(--green)' : 'var(--surface-2)',
                    border: `1px solid ${editing.inStock ? 'rgba(16,185,129,0.5)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 2,
                    left: editing.inStock ? 22 : 2,
                    transition: 'left 0.3s var(--ease)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }} />
                </div>
                <label style={{ color: 'var(--text-2)', fontSize: '0.88rem', cursor: 'pointer' }}>
                  Sẵn sàng cung cấp
                </label>
              </div>
            </div>
            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
            }}>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '0.65rem 1.25rem' }}>Hủy</button>
              <button type="button" className="btn-primary" onClick={save} style={{ padding: '0.65rem 1.25rem' }}>💾 Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--r-xl)',
              maxWidth: 420,
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Xác nhận xóa</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Bạn có chắc muốn xóa dịch vụ &quot;{deleteTarget.name}&quot;?<br />Hành động này không thể hoàn tác.
              </p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
            }}>
              <button type="button" className="btn-ghost" onClick={() => setDeleteTarget(null)} style={{ padding: '0.65rem 1.25rem' }}>Hủy</button>
              <button
                type="button"
                onClick={remove}
                style={{
                  padding: '0.65rem 1.25rem',
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--red)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font)',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
              >Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
