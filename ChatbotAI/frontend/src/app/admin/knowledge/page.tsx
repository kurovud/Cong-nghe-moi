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

  return (
    <div>
      {msg && <div className={`notice notice--${msg.type}`} style={{ marginBottom: "1rem" }}>{msg.text}</div>}

      <div className="admin-page-header">
        <div>
          <h1>📚 Kho tri thức Chatbot</h1>
          <p>Dữ liệu huấn luyện cho chatbot — chatbot sẽ tìm kiếm và trích dẫn từ kho này</p>
        </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
          <label className="btn" style={{ cursor: "pointer" }}>
            📥 Tải JSON
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
            />
          </label>
          <button type="button" className="btn btn--primary" onClick={() => setShowAdd(true)}>➕ Thêm tri thức</button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-toolbar__search"
          placeholder="Tìm kiếm tri thức..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          {filteredItems.length} / {items.length} mục
        </span>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📚</div>
          <h3>Chưa có dữ liệu tri thức</h3>
          <p>Thêm tri thức mới hoặc tải lên file JSON</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tiêu đề & Nội dung</th>
                <th>Tags</th>
                <th>Nguồn</th>
                <th style={{ width: 80 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>{item.title}</strong>
                    <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5, maxWidth: 500, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as any }}>
                      {item.content}
                    </p>
                  </td>
                  <td>
                    <div className="tag-list">
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag-item">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: "0.82rem" }}>{item.source}</td>
                  <td>
                    <button type="button" className="btn btn--sm btn--danger" aria-label={`Xóa ${item.title}`} onClick={() => setDeleteId(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Modal ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
              <h2>➕ Thêm tri thức mới</h2>
              <button type="button" className="modal__close" aria-label="Đóng" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <div className="modal__body">
              <div className="form-row">
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="VD: Hướng dẫn chọn RAM gaming"
                  />
                </div>
                <div className="form-group">
                  <label>Nguồn</label>
                  <input
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    placeholder="VD: Admin upload"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Nội dung *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  placeholder="Nội dung chi tiết về tri thức..."
                />
              </div>
              <div className="form-group">
                <label>Tags (cách nhau bởi dấu phẩy)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="VD: ram, gaming, ddr5"
                />
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" onClick={() => setShowAdd(false)}>Huỷ</button>
              <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Đang lưu..." : "➕ Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal__body">
              <div className="confirm-dialog">
                <div className="confirm-dialog__icon">🗑️</div>
                <h3>Xoá tri thức?</h3>
                <p>Bạn có chắc muốn xoá mục tri thức này?<br />Chatbot sẽ không tìm thấy dữ liệu này nữa.</p>
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" aria-label="Hủy" onClick={() => setDeleteId(null)}>Huỷ</button>
              <button type="button" className="btn btn--danger" aria-label="Xóa" onClick={handleDelete}>Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;
