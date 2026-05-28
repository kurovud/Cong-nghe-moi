"use client";

import { useEffect, useMemo, useState } from "react";
import { KnowledgeItem } from "@/types/knowledge";

const emptyForm = {
  title: "",
  content: "",
  tags: "",
  source: ""
};

const KnowledgePage = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (!filter.trim()) return items;
    const value = filter.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(value) ||
        item.content.toLowerCase().includes(value) ||
        item.tags.join(" ").toLowerCase().includes(value)
    );
  }, [items, filter]);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const loadItems = async () => {
    const response = await fetch("/api/knowledge");
    const data = await response.json();
    setItems(data.items ?? []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      flash("Vui lòng nhập tiêu đề và nội dung!", "error");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          source: form.source || "Admin upload"
        })
      });
      setForm(emptyForm);
      setShowAdd(false);
      flash("Thêm tri thức thành công!");
      await loadItems();
    } catch {
      flash("Lỗi khi thêm tri thức!", "error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/knowledge/${deleteId}`, { method: "DELETE" });
      flash("Đã xoá tri thức!");
      setDeleteId(null);
      await loadItems();
    } catch {
      flash("Lỗi khi xoá!", "error");
    }
  };

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as KnowledgeItem[];
      await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      flash(`Đã import ${Array.isArray(payload) ? payload.length : 1} tri thức!`);
      await loadItems();
    } catch {
      flash("Lỗi khi import file!", "error");
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

  return (
    <div>
      {/* Flash Message */}
      {msg && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--r)',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          color: msg.type === 'success' ? 'var(--green)' : 'var(--red)',
        }}>{msg.text}</div>
      )}

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
          }}>📚 Kho tri thức Chatbot</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: 0 }}>
            Dữ liệu huấn luyện cho chatbot — chatbot sẽ tìm kiếm và trích dẫn từ kho này
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.65rem 1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r)',
            color: 'var(--text)',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            📥 Tải JSON
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
            />
          </label>
          <button type="button" className="btn-primary" onClick={() => setShowAdd(true)} style={{ padding: '0.65rem 1.25rem' }}>
            ➕ Thêm tri thức
          </button>
        </div>
      </div>

      {/* Search & Count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <input
          placeholder="🔍 Tìm kiếm tri thức..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          style={{
            flex: 1,
            maxWidth: 400,
            padding: '0.75rem 1rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r)',
            color: 'var(--text)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
          {filteredItems.length} / {items.length} mục
        </span>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Chưa có dữ liệu tri thức</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Thêm tri thức mới hoặc tải lên file JSON</p>
        </div>
      ) : (
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
                  {['Tiêu đề & Nội dung', 'Tags', 'Nguồn', 'Thao tác'].map(h => (
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
                {filteredItems.map((item) => (
                  <tr key={item.id} style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.2s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '1rem 1.25rem', maxWidth: 500 }}>
                      <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '0.35rem', fontSize: '0.9rem' }}>{item.title}</strong>
                      <p style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-3)',
                        lineHeight: 1.5,
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as any,
                      }}>{item.content}</p>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {item.tags.map((tag) => (
                          <span key={tag} style={{
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(168,85,247,0.1)',
                            border: '1px solid rgba(168,85,247,0.2)',
                            borderRadius: 'var(--r-sm)',
                            color: 'var(--purple)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-2)', fontSize: '0.82rem' }}>{item.source}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button
                        type="button"
                        aria-label={`Xóa ${item.title}`}
                        onClick={() => setDeleteId(item.id)}
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
                          fontSize: '0.9rem',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      >🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add Modal ── */}
      {showAdd && (
        <div
          onClick={() => setShowAdd(false)}
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
              width: '100%',
              maxWidth: 640,
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
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
                ➕ Thêm tri thức mới
              </h2>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowAdd(false)}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Tiêu đề *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="VD: Hướng dẫn chọn RAM gaming"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nguồn</label>
                  <input
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    placeholder="VD: Admin upload"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Nội dung *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  placeholder="Nội dung chi tiết về tri thức..."
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Tags (cách nhau bởi dấu phẩy)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="VD: ram, gaming, ddr5"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
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
              <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)} style={{ padding: '0.65rem 1.25rem' }}>Huỷ</button>
              <button type="button" className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ padding: '0.65rem 1.25rem' }}>
                {loading ? "Đang lưu..." : "➕ Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div
          onClick={() => setDeleteId(null)}
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
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
              <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Xoá tri thức?</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Bạn có chắc muốn xoá mục tri thức này?<br />Chatbot sẽ không tìm thấy dữ liệu này nữa.
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
              <button type="button" className="btn-ghost" aria-label="Hủy" onClick={() => setDeleteId(null)} style={{ padding: '0.65rem 1.25rem' }}>Huỷ</button>
              <button
                type="button"
                aria-label="Xóa"
                onClick={handleDelete}
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
              >Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;
