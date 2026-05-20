"use client";

import { useEffect, useState, useCallback } from "react";
import type { PrebuiltPC } from "@/types/product.type";

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const PURPOSES = ["Gaming", "Văn phòng", "Đồ họa", "Streaming", "Học tập", "Lập trình"];

const EMPTY: Omit<PrebuiltPC, "id"> & { id?: string } = {
  name: "",
  purpose: "Gaming",
  price: 0,
  image: "/images/placeholder.png",
  components: { cpu: "", gpu: "", mainboard: "", ram: "", storage: "", psu: "", case: "", cooler: "" },
  description: "",
  rating: 5
};

export default function BuildsAdmin() {
  const [builds, setBuilds] = useState<PrebuiltPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<(Omit<PrebuiltPC, "id"> & { id?: string }) | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PrebuiltPC | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchBuilds = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/builds")
      .then((r) => r.json())
      .then((d) => { setBuilds(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBuilds(); }, [fetchBuilds]);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const openAdd = () => { setEditing({ ...EMPTY, components: { ...EMPTY.components } }); setShowModal(true); };
  const openEdit = (b: PrebuiltPC) => { setEditing({ ...b, components: { ...b.components } }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const updateField = (field: string, value: any) => {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const updateComponent = (key: string, value: string) => {
    setEditing((prev) =>
      prev ? { ...prev, components: { ...prev.components, [key]: value } } : prev
    );
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isEdit = !!editing.id;
      const res = await fetch("/api/admin/builds", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi");
      flash(isEdit ? "Cập nhật thành công!" : "Thêm PC Build thành công!");
      closeModal();
      fetchBuilds();
    } catch (err: any) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/builds?id=${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi xoá");
      flash("Đã xoá PC Build!");
      setDeleteTarget(null);
      fetchBuilds();
    } catch (err: any) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const compLabels: Record<string, string> = {
    cpu: "CPU",
    gpu: "GPU",
    mainboard: "Mainboard",
    ram: "RAM",
    storage: "Ổ cứng",
    psu: "Nguồn PSU",
    case: "Vỏ case",
    cooler: "Tản nhiệt"
  };

  return (
    <div>
      {msg && <div className={`notice notice--${msg.type}`} style={{ marginBottom: "1rem" }}>{msg.text}</div>}

      <div className="admin-page-header">
        <div>
          <h1>🖥️ Quản lý PC Build sẵn</h1>
          <p>Tạo và quản lý các bộ PC gợi ý cho khách hàng</p>
        </div>
        <button type="button" className="btn btn--primary" aria-label="Thêm PC Build" onClick={openAdd}>➕ Thêm PC Build</button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : builds.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🖥️</div>
          <h3>Chưa có PC Build</h3>
          <p>Nhấn &quot;Thêm PC Build&quot; để bắt đầu</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {builds.map((b) => (
            <div key={b.id} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>{b.name}</h3>
                  <span className="badge badge--purple">{b.purpose}</span>
                </div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button type="button" className="btn btn--sm" aria-label={`Chỉnh sửa ${b.name}`} onClick={() => openEdit(b)}>✏️</button>
                  <button type="button" className="btn btn--sm btn--danger" aria-label={`Xóa ${b.name}`} onClick={() => setDeleteTarget(b)}>🗑️</button>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.75rem" }}>{b.description}</p>
              <div style={{ fontSize: "0.82rem", display: "grid", gap: "0.25rem" }}>
                {Object.entries(b.components).map(([k, v]) => (
                  <div key={k}>
                    <strong>{compLabels[k] || k}:</strong> {v}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "var(--primary)", fontSize: "1.1rem" }}>{fmt(b.price)}</strong>
                <span>⭐ {b.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && editing && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
              <h2>{editing.id ? "✏️ Sửa PC Build" : "➕ Thêm PC Build"}</h2>
              <button type="button" className="modal__close" aria-label="Đóng" onClick={closeModal}>×</button>
            </div>
            <div className="modal__body">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên build *</label>
                  <input value={editing.name} onChange={(e) => updateField("name", e.target.value)} placeholder="VD: PC Gaming Pro RTX 4070" />
                </div>
                <div className="form-group">
                  <label>Mục đích sử dụng</label>
                  <select value={editing.purpose} onChange={(e) => updateField("purpose", e.target.value)}>
                    {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input type="number" value={editing.price} onChange={(e) => updateField("price", Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <input type="number" min={1} max={5} step={0.1} value={editing.rating} onChange={(e) => updateField("rating", Number(e.target.value))} />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea value={editing.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Mô tả chi tiết về bộ PC..." />
              </div>

              <div className="form-group">
                <label>Hình ảnh URL</label>
                <input value={editing.image} onChange={(e) => updateField("image", e.target.value)} />
              </div>

              <h4 style={{ margin: "1rem 0 0.5rem", fontSize: "0.95rem" }}>🔧 Linh kiện</h4>
              <div className="form-row">
                {Object.keys(compLabels).map((key) => (
                  <div className="form-group" key={key}>
                    <label>{compLabels[key]}</label>
                    <input
                      value={(editing.components as any)[key] || ""}
                      onChange={(e) => updateComponent(key, e.target.value)}
                      placeholder={`VD: ${key === "cpu" ? "AMD Ryzen 7 7800X3D" : ""}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" aria-label="Hủy" onClick={closeModal}>Huỷ</button>
              <button type="button" className="btn btn--primary" aria-label="Lưu" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : editing.id ? "💾 Cập nhật" : "➕ Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal__body">
              <div className="confirm-dialog">
                <div className="confirm-dialog__icon">🗑️</div>
                <h3>Xoá PC Build?</h3>
                <p>
                  Bạn có chắc muốn xoá <strong>{deleteTarget.name}</strong>?
                  <br />Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" aria-label="Hủy" onClick={() => setDeleteTarget(null)}>Huỷ</button>
              <button type="button" className="btn btn--danger" aria-label="Xoá" onClick={handleDelete} disabled={saving}>
                {saving ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
