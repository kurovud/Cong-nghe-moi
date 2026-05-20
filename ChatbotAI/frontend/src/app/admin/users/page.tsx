"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

type ManagedRole = "USER" | "STAFF";
type ManagedStatus = "ACTIVE" | "INACTIVE" | "BANNED";

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: ManagedRole | "ADMIN";
  status: ManagedStatus;
  createdAt: string;
}

const defaultForm = {
  email: "",
  name: "",
  phone: "",
  password: "",
  role: "USER" as ManagedRole,
  status: "ACTIVE" as ManagedStatus,
};

const UsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getAuthHeaders = (withJson = false): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    return {
      ...(withJson ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const flash = (text: string, type: "success" | "error" = "success") => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      const res = await fetch(`/api/admin/users?${params.toString()}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được danh sách người dùng");
      setUsers((data.users || []).filter((u: ManagedUser) => u.role !== "ADMIN"));
    } catch (error: any) {
      flash(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  const summary = useMemo(() => {
    const customers = users.filter((u) => u.role === "USER").length;
    const staff = users.filter((u) => u.role === "STAFF").length;
    const disabled = users.filter((u) => u.status !== "ACTIVE").length;
    return { customers, staff, disabled };
  }, [users]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (target: ManagedUser) => {
    setEditing(target);
    setForm({
      email: target.email,
      name: target.name,
      phone: target.phone || "",
      password: "",
      role: target.role === "STAFF" ? "STAFF" : "USER",
      status: target.status,
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        email: form.email,
        name: form.name,
        phone: form.phone || undefined,
        role: form.role,
        status: form.status,
      };

      let url = "/api/admin/users";
      let method = "POST";
      if (editing) {
        url = `/api/admin/users/${editing.id}`;
        method = "PUT";
      } else {
        payload.password = form.password;
      }

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Thao tác thất bại");

      flash(editing ? "Cập nhật người dùng thành công" : "Tạo người dùng thành công");
      setShowForm(false);
      setForm(defaultForm);
      setEditing(null);
      await fetchUsers();
    } catch (error: any) {
      flash(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (target: ManagedUser) => {
    if (!confirm(`Xóa tài khoản ${target.email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${target.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa thất bại");
      flash("Xóa người dùng thành công");
      await fetchUsers();
    } catch (error: any) {
      flash(error.message, "error");
    }
  };

  if (!user || user.role !== "admin") {
    return <div className="notice notice--error">Chỉ quản trị viên mới được quản lý người dùng.</div>;
  }

  return (
    <div>
      {msg && <div className={`notice notice--${msg.type}`}>{msg.text}</div>}

      <div className="admin-page-header">
        <div>
          <h1>👥 Quản lý người dùng</h1>
          <p>Thêm, sửa, xóa tài khoản khách hàng và nhân viên</p>
        </div>
        <button type="button" className="btn btn--primary" aria-label="Thêm tài khoản" onClick={openCreate}>➕ Thêm tài khoản</button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: "1rem" }}>
        <div className="stat-card"><strong>{summary.customers}</strong><span>Khách hàng</span></div>
        <div className="stat-card"><strong>{summary.staff}</strong><span>Nhân viên</span></div>
        <div className="stat-card"><strong>{summary.disabled}</strong><span>Tài khoản bị khóa/chờ</span></div>
      </div>

      <div className="admin-toolbar" style={{ marginBottom: "1rem" }}>
        <input
          className="admin-toolbar__search"
          value={query}
          placeholder="Tìm theo tên hoặc email..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "STAFF" ? "badge--blue" : "badge--green"}`}>
                      {u.role === "STAFF" ? "Nhân viên" : "Khách hàng"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === "ACTIVE" ? "badge--green" : u.status === "INACTIVE" ? "badge--yellow" : "badge--red"}`}>
                      {u.status === "ACTIVE" ? "Hoạt động" : u.status === "INACTIVE" ? "Tạm dừng" : "Khóa"}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button type="button" className="btn btn--sm" aria-label={`Chỉnh sửa ${u.email}`} onClick={() => openEdit(u)}>✏️</button>
                      <button type="button" className="btn btn--sm btn--danger" aria-label={`Xóa ${u.email}`} onClick={() => deleteUser(u)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editing ? "Cập nhật tài khoản" : "Tạo tài khoản mới"}</h2>
              <button type="button" className="modal__close" aria-label="Đóng" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label>Họ tên</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              {!editing && (
                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Số điện thoại</label>
                <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Vai trò</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as ManagedRole }))}
                  >
                    <option value="USER">Khách hàng</option>
                    <option value="STAFF">Nhân viên</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ManagedStatus }))}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tạm dừng</option>
                    <option value="BANNED">Khóa</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Hủy</button>
              <button type="button" className="btn btn--primary" onClick={submitForm} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
