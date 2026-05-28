"use client";

import { useEffect, useState, useCallback } from "react";

interface FAQItem {
  question: string;
  answer: string;
  tags: string[];
}

export default function FAQAdmin() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<FAQItem>({ question: "", answer: "", tags: [] });
  const [tagInput, setTagInput] = useState("");
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [search, setSearch] = useState("");

  /* ── Bulk import ── */
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");

  const fetchFaqs = useCallback(() => {
    setLoading(true);
    const params = search ? `?q=${encodeURIComponent(search)}` : "";
    fetch(`/api/admin/faq${params}`)
      .then((r) => r.json())
      .then((d) => { setFaqs(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const openAdd = () => {
    setEditIdx(null);
    setForm({ question: "", answer: "", tags: [] });
    setTagInput("");
    setShowModal(true);
  };

  const openEdit = (idx: number) => {
    setEditIdx(idx);
    setForm({ ...faqs[idx], tags: [...faqs[idx].tags] });
    setTagInput("");
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditIdx(null); };

  const addTag = () => {
    if (!tagInput.trim() || form.tags.includes(tagInput.trim())) return;
    setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      flash("Vui lòng nhập câu hỏi và câu trả lời!", "error");
      return;
    }
    setSaving(true);
    try {
      const isEdit = editIdx !== null;
      const body = isEdit ? { index: editIdx, ...form } : form;
      const res = await fetch("/api/admin/faq", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi");
      flash(isEdit ? "Cập nhật thành công!" : "Thêm FAQ thành công!");
      closeModal();
      fetchFaqs();
    } catch (err: any) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteIdx === null) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/faq?index=${deleteIdx}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi xoá");
      flash("Đã xoá FAQ!");
      setDeleteIdx(null);
      fetchFaqs();
    } catch (err: any) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async () => {
    try {
      const items = JSON.parse(importJson);
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi import");
      flash(`Đã import FAQ!`);
      setShowImport(false);
      setImportJson("");
      fetchFaqs();
    } catch (err: any) {
      flash(err.message, "error");
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
          }}>❓ Quản lý FAQ</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: 0 }}>
            Câu hỏi thường gặp — chatbot sẽ dùng dữ liệu này để trả lời khách hàng
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowImport(true)}
            style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >📥 Import JSON</button>
          <button type="button" className="btn-primary" onClick={openAdd} style={{ padding: '0.65rem 1.25rem' }}>
            ➕ Thêm FAQ
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
          placeholder="🔍 Tìm kiếm FAQ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          {faqs.length} câu hỏi
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" />
        </div>
      ) : faqs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❓</div>
          <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Chưa có FAQ</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Nhấn &quot;Thêm FAQ&quot; để bắt đầu</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s var(--ease)',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.65rem', color: 'var(--text)', lineHeight: 1.5 }}>
                    <span style={{
                      color: 'var(--cyan)',
                      fontWeight: 700,
                      marginRight: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.15rem 0.5rem',
                      background: 'rgba(0,212,255,0.1)',
                      borderRadius: 'var(--r-sm)',
                    }}>Q</span>
                    {faq.question}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
                    <span style={{
                      color: 'var(--green)',
                      fontWeight: 700,
                      marginRight: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.15rem 0.5rem',
                      background: 'rgba(16,185,129,0.1)',
                      borderRadius: 'var(--r-sm)',
                    }}>A</span>
                    {faq.answer}
                  </p>
                  {faq.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
                      {faq.tags.map((t) => (
                        <span key={t} style={{
                          padding: '0.2rem 0.6rem',
                          background: 'rgba(168,85,247,0.1)',
                          border: '1px solid rgba(168,85,247,0.2)',
                          borderRadius: 'var(--r-sm)',
                          color: 'var(--purple)',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    aria-label={`Chỉnh sửa câu hỏi ${idx + 1}`}
                    onClick={() => openEdit(idx)}
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
                    aria-label={`Xóa câu hỏi ${idx + 1}`}
                    onClick={() => setDeleteIdx(idx)}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div
          onClick={closeModal}
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
              maxWidth: 560,
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
                {editIdx !== null ? "✏️ Sửa FAQ" : "➕ Thêm FAQ"}
              </h2>
              <button
                type="button"
                aria-label="Đóng"
                onClick={closeModal}
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
                <label style={labelStyle}>Câu hỏi *</label>
                <input
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="VD: Tôi nên mua CPU gì cho gaming?"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Câu trả lời *</label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                  rows={5}
                  placeholder="Nhập câu trả lời chi tiết..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Tags</label>
                {form.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    {form.tags.map((t) => (
                      <span key={t} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.25rem 0.65rem',
                        background: 'rgba(168,85,247,0.1)',
                        border: '1px solid rgba(168,85,247,0.2)',
                        borderRadius: 'var(--r-sm)',
                        color: 'var(--purple)',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                      }}>
                        {t}
                        <button
                          type="button"
                          aria-label={`Xóa tag ${t}`}
                          onClick={() => removeTag(t)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--purple)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            padding: 0,
                            lineHeight: 1,
                          }}
                        >×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    placeholder="Nhập tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                  <button
                    className="btn-secondary"
                    onClick={addTag}
                    type="button"
                    style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                  >＋</button>
                </div>
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
              <button type="button" className="btn-ghost" onClick={closeModal} style={{ padding: '0.65rem 1.25rem' }}>Huỷ</button>
              <button type="button" className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '0.65rem 1.25rem' }}>
                {saving ? "Đang lưu..." : editIdx !== null ? "💾 Cập nhật" : "➕ Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteIdx !== null && (
        <div
          onClick={() => setDeleteIdx(null)}
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
              <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Xoá FAQ?</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Bạn có chắc muốn xoá câu hỏi này?</p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
            }}>
              <button type="button" className="btn-ghost" onClick={() => setDeleteIdx(null)} style={{ padding: '0.65rem 1.25rem' }}>Huỷ</button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
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
              >
                {saving ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import JSON Modal ── */}
      {showImport && (
        <div
          onClick={() => setShowImport(false)}
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
                📥 Import FAQ từ JSON
              </h2>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setShowImport(false)}
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
            <div style={{ padding: '1.5rem' }}>
              <label style={labelStyle}>Dán JSON (mảng hoặc object)</label>
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                rows={10}
                placeholder={`[
  {
    "question": "Câu hỏi?",
    "answer": "Câu trả lời...",
    "tags": ["tag1", "tag2"]
  }
]`}
                style={{
                  ...inputStyle,
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  resize: 'vertical',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
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
              <button type="button" className="btn-ghost" onClick={() => setShowImport(false)} style={{ padding: '0.65rem 1.25rem' }}>Huỷ</button>
              <button type="button" className="btn-primary" onClick={handleImport} style={{ padding: '0.65rem 1.25rem' }}>Nhập dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
