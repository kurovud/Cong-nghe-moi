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

  return (
    <div>
      {msg && <div className={`notice notice--${msg.type}`} style={{ marginBottom: "1rem" }}>{msg.text}</div>}

      <div className="admin-page-header">
        <div>
          <h1>❓ Quản lý FAQ</h1>
          <p>Câu hỏi thường gặp — chatbot sẽ dùng dữ liệu này để trả lời khách hàng</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className="btn" onClick={() => setShowImport(true)}>📥 Import JSON</button>
          <button type="button" className="btn btn--primary" onClick={openAdd}>➕ Thêm FAQ</button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-toolbar__search"
          placeholder="Tìm kiếm FAQ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          {faqs.length} câu hỏi
        </span>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : faqs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">❓</div>
          <h3>Chưa có FAQ</h3>
          <p>Nhấn &quot;Thêm FAQ&quot; để bắt đầu</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--primary)" }}>Q:</span> {faq.question}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>
                    <strong>A:</strong> {faq.answer}
                  </p>
                  {faq.tags.length > 0 && (
                    <div className="tag-list" style={{ marginTop: "0.5rem" }}>
                      {faq.tags.map((t) => (
                        <span key={t} className="tag-item">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                  <button type="button" className="btn btn--sm" aria-label={`Chỉnh sửa câu hỏi ${idx + 1}`} onClick={() => openEdit(idx)}>✏️</button>
                  <button type="button" className="btn btn--sm btn--danger" aria-label={`Xóa câu hỏi ${idx + 1}`} onClick={() => setDeleteIdx(idx)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
              <h2>{editIdx !== null ? "✏️ Sửa FAQ" : "➕ Thêm FAQ"}</h2>
              <button type="button" className="modal__close" aria-label="Đóng" onClick={closeModal}>×</button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label>Câu hỏi *</label>
                <input
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="VD: Tôi nên mua CPU gì cho gaming?"
                />
              </div>
              <div className="form-group">
                <label>Câu trả lời *</label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                  rows={5}
                  placeholder="Nhập câu trả lời chi tiết..."
                />
              </div>
              <div className="form-group">
                <label>Tags</label>
                {form.tags.length > 0 && (
                  <div className="tag-list" style={{ marginBottom: "0.5rem" }}>
                    {form.tags.map((t) => (
                      <span key={t} className="tag-item">
                          {t}
                          <button type="button" aria-label={`Xóa tag ${t}`} onClick={() => removeTag(t)}>×</button>
                        </span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    placeholder="Nhập tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn--sm" onClick={addTag} type="button">＋</button>
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" onClick={closeModal}>Huỷ</button>
              <button type="button" className="btn btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : editIdx !== null ? "💾 Cập nhật" : "➕ Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteIdx !== null && (
        <div className="modal-overlay" onClick={() => setDeleteIdx(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal__body">
              <div className="confirm-dialog">
                <div className="confirm-dialog__icon">🗑️</div>
                <h3>Xoá FAQ?</h3>
                <p>Bạn có chắc muốn xoá câu hỏi này?</p>
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" onClick={() => setDeleteIdx(null)}>Huỷ</button>
              <button type="button" className="btn btn--danger" onClick={handleDelete} disabled={saving}>
                {saving ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import JSON Modal ── */}
      {showImport && (
        <div className="modal-overlay" onClick={() => setShowImport(false)}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>📥 Import FAQ từ JSON</h2>
              <button type="button" className="modal__close" aria-label="Đóng" onClick={() => setShowImport(false)}>×</button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label>Dán JSON (mảng hoặc object)</label>
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
                  style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
                />
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" onClick={() => setShowImport(false)}>Huỷ</button>
              <button type="button" className="btn btn--primary" onClick={handleImport}>Nhập dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
