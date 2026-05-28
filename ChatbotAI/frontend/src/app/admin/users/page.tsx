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
    return (
      <div style={{
        padding: '2rem',
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 'var(--r)',
        color: 'var(--red)',
        textAlign: 'center',
        fontWeight: 600,
      }}>Chỉ quản trị viên mới được quản lý người dùng.</div>
    );
  }

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

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
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
          }}>👥 Quản lý người dùng</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: 0 }}>Thêm, sửa, xóa tài khoản khách hàng và nhân viên</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          aria-label="Thêm tài khoản"
          onClick={openCreate}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
        >➕ Thêm tài khoản</button>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {[
          { value: summary.customers, label: 'Khách hàng', icon: '👤', gradient: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.04))' },
          { value: summary.staff, label: 'Nhân viên', icon: '🛠️', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))' },
          { value: summary.disabled, label: 'Tài khoản bị khóa/chờ', icon: '🔒', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))' },
        ].map(s => (
          <div key={s.label} style={{
            background: s.gradient,
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.25rem 1.5rem',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: '1.25rem', marginBottom: '0.35rem', display: 'block' }}>{s.icon}</span>
            <strong style={{
              display: 'block',
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text)',
            }}>{s.value}</strong>
            <span style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          value={query}
          placeholder="🔍 Tìm theo tên hoặc email..."
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
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
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" />
        </div>
      ) : users.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Không tìm thấy người dùng</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Thử thay đổi từ khoá tìm kiếm</p>
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
                  {['Họ tên', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map(h => (
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
                {users.map((u) => (
                  <tr key={u.id} style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.2s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: u.role === 'STAFF' ? 'var(--grad-brand)' : 'linear-gradient(135deg, var(--green), #059669)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#fff',
                          flexShrink: 0,
                        }}>{u.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                        <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-2)', fontSize: '0.88rem' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--r-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: u.role === "STAFF" ? 'rgba(0,212,255,0.1)' : 'rgba(16,185,129,0.1)',
                        color: u.role === "STAFF" ? 'var(--cyan)' : 'var(--green)',
                        border: `1px solid ${u.role === "STAFF" ? 'rgba(0,212,255,0.25)' : 'rgba(16,185,129,0.25)'}`,
                      }}>
                        {u.role === "STAFF" ? "Nhân viên" : "Khách hàng"}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--r-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: u.status === "ACTIVE" ? 'rgba(16,185,129,0.1)' : u.status === "INACTIVE" ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)',
                        color: u.status === "ACTIVE" ? 'var(--green)' : u.status === "INACTIVE" ? 'var(--orange)' : 'var(--red)',
                        border: `1px solid ${u.status === "ACTIVE" ? 'rgba(16,185,129,0.25)' : u.status === "INACTIVE" ? 'rgba(249,115,22,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      }}>
                        <span style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: u.status === "ACTIVE" ? 'var(--green)' : u.status === "INACTIVE" ? 'var(--orange)' : 'var(--red)',
                        }} />
                        {u.status === "ACTIVE" ? "Hoạt động" : u.status === "INACTIVE" ? "Tạm dừng" : "Khóa"}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-2)', fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          aria-label={`Chỉnh sửa ${u.email}`}
                          onClick={() => openEdit(u)}
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
                            fontSize: '0.9rem',
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.2)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
                        >✏️</button>
                        <button
                          type="button"
                          aria-label={`Xóa ${u.email}`}
                          onClick={() => deleteUser(u)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
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
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--r-xl)',
              width: '100%',
              maxWidth: 520,
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
                {editing ? "✏️ Cập nhật tài khoản" : "➕ Tạo tài khoản mới"}
              </h2>
              <button
                type="button"
                aria-label="Đóng"
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
                <label style={labelStyle}>Họ tên</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} style={inputStyle} />
              </div>
              {!editing && (
                <div>
                  <label style={labelStyle}>Mật khẩu</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              )}
              <div>
                <label style={labelStyle}>Số điện thoại</label>
                <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Vai trò</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as ManagedRole }))}
                    style={selectStyle}
                  >
                    <option value="USER">Khách hàng</option>
                    <option value="STAFF">Nhân viên</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ManagedStatus }))}
                    style={selectStyle}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tạm dừng</option>
                    <option value="BANNED">Khóa</option>
                  </select>
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
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '0.65rem 1.25rem' }}>Hủy</button>
              <button type="button" className="btn-primary" onClick={submitForm} disabled={saving} style={{ padding: '0.65rem 1.25rem' }}>
                {saving ? "Đang lưu..." : "💾 Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
