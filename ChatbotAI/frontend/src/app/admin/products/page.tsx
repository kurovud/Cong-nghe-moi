"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product, ProductCategory } from "@/types/product.type";

/* ── Danh mục ── */
const CATEGORIES: { value: ProductCategory | ""; label: string }[] = [
  { value: "", label: "Tất cả danh mục" },
  { value: "cpu", label: "CPU" },
  { value: "gpu", label: "GPU" },
  { value: "mainboard", label: "Mainboard" },
  { value: "ram", label: "RAM" },
  { value: "ssd", label: "SSD" },
  { value: "hdd", label: "HDD" },
  { value: "psu", label: "PSU" },
  { value: "case", label: "Case" },
  { value: "cooler", label: "Tản nhiệt" },
  { value: "monitor", label: "Màn hình" },
  { value: "keyboard", label: "Bàn phím" },
  { value: "mouse", label: "Chuột" },
  { value: "headset", label: "Tai nghe" },
  { value: "laptop", label: "Laptop" },
  { value: "prebuilt", label: "PC nguyên bộ" }
];

const EMPTY_FORM: Omit<Product, "id"> & { id?: string } = {
  name: "",
  category: "cpu",
  brand: "",
  price: 0,
  image: "/images/placeholder.png",
  shortDesc: "",
  specs: {},
  stock: 0,
  rating: 5,
  tags: [],
  compatKey: ""
};

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

/* ══════════════════════════════════════ */
export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(Omit<Product, "id"> & { id?: string }) | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  /* ── Specs editor state ── */
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [tagInput, setTagInput] = useState("");

  /* ── Bulk import ── */
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");

  const getAuthHeaders = (withJson = false): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    return {
      ...(withJson ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (catFilter) params.set("category", catFilter);
    fetch(`/api/admin/products?${params}`, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, catFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── Flash message ── */
  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  /* ── Open modal ── */
  const openAdd = () => { setEditingProduct({ ...EMPTY_FORM }); setShowModal(true); };
  const openEdit = (p: Product) => { setEditingProduct({ ...p }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); setSpecKey(""); setSpecVal(""); setTagInput(""); };

  /* ── Save (add / edit) ── */
  const handleSave = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const isEdit = !!editingProduct.id;
      const url = isEdit ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi");
      flash(isEdit ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
      closeModal();
      fetchProducts();
    } catch (err: any) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Lỗi xoá");
      flash("Đã xoá sản phẩm!");
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: any) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Bulk import ── */
  const handleImport = async () => {
    try {
      const items = JSON.parse(importJson);
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(items)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi import");
      flash(`Đã import ${data.data?.length || 0} sản phẩm!`);
      setShowImport(false);
      setImportJson("");
      fetchProducts();
    } catch (err: any) {
      flash(err.message, "error");
    }
  };

  /* ── Form field updater ── */
  const updateField = (field: string, value: any) => {
    setEditingProduct((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const addSpec = () => {
    if (!specKey.trim()) return;
    setEditingProduct((prev) =>
      prev ? { ...prev, specs: { ...prev.specs, [specKey.trim()]: specVal.trim() } } : prev
    );
    setSpecKey("");
    setSpecVal("");
  };

  const removeSpec = (key: string) => {
    setEditingProduct((prev) => {
      if (!prev) return prev;
      const s = { ...prev.specs };
      delete s[key];
      return { ...prev, specs: s };
    });
  };

  const addTag = () => {
    if (!tagInput.trim() || !editingProduct) return;
    if (!editingProduct.tags.includes(tagInput.trim())) {
      updateField("tags", [...editingProduct.tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (t: string) => {
    if (!editingProduct) return;
    updateField("tags", editingProduct.tags.filter((x) => x !== t));
  };

  /* ══════════════════════════════════════ */
  return (
    <div>
      {/* Flash message */}
      {msg && <div className={`notice notice--${msg.type}`} style={{ marginBottom: "1rem" }}>{msg.text}</div>}

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>📦 Quản lý sản phẩm</h1>
          <p>Thêm, sửa, xoá linh kiện, laptop và phụ kiện</p>
        </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className="btn" onClick={() => setShowImport(true)}>📥 Import JSON</button>
          <button type="button" className="btn btn--primary" onClick={openAdd}>➕ Thêm sản phẩm</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <input
          className="admin-toolbar__search"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-toolbar__select"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          {products.length} sản phẩm
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📦</div>
          <h3>Chưa có sản phẩm</h3>
          <p>Nhấn &quot;Thêm sản phẩm&quot; để bắt đầu</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Rating</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong style={{ display: "block" }}>{p.name}</strong>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{p.brand} · {p.id}</span>
                  </td>
                  <td><span className="badge badge--blue">{p.category.toUpperCase()}</span></td>
                  <td>
                    {p.discountPrice ? (
                      <>
                        <span style={{ textDecoration: "line-through", color: "var(--muted)", fontSize: "0.8rem" }}>{fmt(p.price)}</span>
                        <br />{fmt(p.discountPrice)}
                      </>
                    ) : fmt(p.price)}
                  </td>
                  <td>
                    <span className={`badge ${p.stock > 10 ? "badge--green" : p.stock > 0 ? "badge--yellow" : "badge--red"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>⭐ {p.rating}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <button type="button" className="btn btn--sm" aria-label={`Chỉnh sửa ${p.name}`} onClick={() => openEdit(p)}>✏️</button>
                      <button type="button" className="btn btn--sm btn--danger" aria-label={`Xóa ${p.name}`} onClick={() => setDeleteTarget(p)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && editingProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editingProduct.id ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h2>
              <button type="button" className="modal__close" aria-label="Đóng" onClick={closeModal}>×</button>
            </div>
            <div className="modal__body">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    value={editingProduct.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="VD: AMD Ryzen 7 7800X3D"
                  />
                </div>
                <div className="form-group">
                  <label>Thương hiệu *</label>
                  <input
                    value={editingProduct.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                    placeholder="VD: AMD"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select value={editingProduct.category} onChange={(e) => updateField("category", e.target.value)}>
                    {CATEGORIES.filter((c) => c.value).map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Compat Key</label>
                  <input
                    value={editingProduct.compatKey || ""}
                    onChange={(e) => updateField("compatKey", e.target.value)}
                    placeholder="VD: AM5"
                  />
                  <p className="form-hint">Khoá tương thích (socket, chipset...)</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => updateField("price", Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Giá khuyến mãi</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ""}
                    onChange={(e) => updateField("discountPrice", e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tồn kho</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => updateField("stock", Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={editingProduct.rating}
                    onChange={(e) => updateField("rating", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả ngắn</label>
                <textarea
                  value={editingProduct.shortDesc}
                  onChange={(e) => updateField("shortDesc", e.target.value)}
                  placeholder="Mô tả ngắn gọn về sản phẩm..."
                />
              </div>

              <div className="form-group">
                <label>Hình ảnh URL</label>
                <input
                  value={editingProduct.image}
                  onChange={(e) => updateField("image", e.target.value)}
                />
              </div>

              {/* ── Specs ── */}
              <div className="form-group">
                <label>Thông số kỹ thuật</label>
                {Object.entries(editingProduct.specs).length > 0 && (
                  <div className="tag-list" style={{ marginBottom: "0.5rem" }}>
                    {Object.entries(editingProduct.specs).map(([k, v]) => (
                      <span key={k} className="tag-item">
                        {k}: {v}
                        <button type="button" aria-label={`Xóa thông số ${k}`} onClick={() => removeSpec(k)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    placeholder="Tên (VD: Cores)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    placeholder="Giá trị (VD: 8 nhân)"
                    value={specVal}
                    onChange={(e) => setSpecVal(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn--sm" onClick={addSpec} type="button">＋</button>
                </div>
              </div>

              {/* ── Tags ── */}
              <div className="form-group">
                <label>Tags</label>
                {editingProduct.tags.length > 0 && (
                  <div className="tag-list" style={{ marginBottom: "0.5rem" }}>
                    {editingProduct.tags.map((t) => (
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
                {saving ? "Đang lưu..." : editingProduct.id ? "💾 Cập nhật" : "➕ Thêm"}
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
                <h3>Xoá sản phẩm?</h3>
                <p>
                  Bạn có chắc muốn xoá <strong>{deleteTarget.name}</strong>?
                  <br />Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" onClick={() => setDeleteTarget(null)}>Huỷ</button>
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
              <h2>📥 Import sản phẩm từ JSON</h2>
              <button type="button" className="modal__close" aria-label="Đóng" onClick={() => setShowImport(false)}>×</button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label>Dán JSON (mảng hoặc object)</label>
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  rows={12}
                  placeholder={`[
  {
    "name": "...",
    "category": "cpu",
    "brand": "...",
    "price": 10000000,
    "image": "/images/placeholder.png",
    "shortDesc": "...",
    "specs": { "Cores": "8" },
    "stock": 50,
    "rating": 5,
    "tags": ["gaming"]
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
