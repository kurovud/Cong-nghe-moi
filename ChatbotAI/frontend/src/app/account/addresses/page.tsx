"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ShippingAddress } from "@/types/order.type";

export default function AddressesPage() {
  const { user, token } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddress[]>(user?.addresses ?? []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ShippingAddress>({ fullName: "", phone: "", email: "", province: "", district: "", ward: "", address: "" });

  if (!user) return (
    <div className="container section">
      <div style={{
        padding: "2rem",
        borderRadius: "var(--r-lg)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        textAlign: "center",
      }}>
        <p style={{ margin: 0, color: "var(--text-2)" }}>
          Vui lòng <Link href="/login" style={{ color: "var(--cyan)", fontWeight: 600 }}>đăng nhập</Link> để xem sổ địa chỉ.
        </p>
      </div>
    </div>
  );

  const addAddr = async () => {
    const r = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_address", token, address: form }),
    });
    const data = await r.json();
    if (data.user) { setAddresses(data.user.addresses); setShowForm(false); setForm({ fullName: "", phone: "", email: "", province: "", district: "", ward: "", address: "" }); }
  };

  const removeAddr = async (index: number) => {
    const r = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove_address", token, index }),
    });
    const data = await r.json();
    if (data.user) setAddresses(data.user.addresses);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "var(--r-sm)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-2)",
    color: "var(--text)",
    fontSize: "0.95rem",
    fontFamily: "var(--font)",
    outline: "none",
    transition: "border-color 0.2s var(--ease), box-shadow 0.2s var(--ease)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.4rem",
    color: "var(--text-2)",
    fontSize: "0.88rem",
    fontWeight: 600,
    fontFamily: "var(--font)",
    letterSpacing: "0.02em",
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--cyan)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.15)";
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--border-2)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <span>Sổ địa chỉ</span>
        </nav>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 740 }}>

          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{
                width: 44,
                height: 44,
                borderRadius: "var(--r)",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
              }}>📍</span>
              <div>
                <h1 style={{
                  margin: 0,
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}>
                  <span className="gradient-text">Sổ địa chỉ</span>
                </h1>
                <span style={{
                  color: "var(--text-3)",
                  fontSize: "0.85rem",
                }}>
                  {addresses.length} địa chỉ đã lưu
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "0.65rem 1.2rem",
                borderRadius: "var(--r)",
                background: showForm ? "transparent" : "var(--grad-brand)",
                border: showForm ? "1px solid var(--border-2)" : "none",
                color: showForm ? "var(--text-2)" : "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                fontFamily: "var(--font-heading)",
                cursor: "pointer",
                transition: "all 0.2s var(--ease)",
                boxShadow: showForm ? "none" : "var(--shadow-cyan)",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {showForm ? "✕ Hủy" : "+ Thêm địa chỉ"}
            </button>
          </div>

          {/* Add Address Form */}
          {showForm && (
            <div style={{
              padding: "1.5rem",
              borderRadius: "var(--r-lg)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              marginBottom: "1.5rem",
              animation: "fadeIn 0.3s var(--ease)",
            }}>
              <h3 style={{
                margin: "0 0 1.25rem",
                fontFamily: "var(--font-heading)",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--cyan)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                ✨ Thêm địa chỉ mới
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Họ tên</label>
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                </div>
                <div>
                  <label style={labelStyle}>SĐT</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                <div>
                  <label style={labelStyle}>Tỉnh/TP</label>
                  <input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                </div>
                <div>
                  <label style={labelStyle}>Quận/Huyện</label>
                  <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                </div>
                <div>
                  <label style={labelStyle}>Phường/Xã</label>
                  <input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <label style={labelStyle}>Địa chỉ</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} onFocus={handleInputFocus} onBlur={handleInputBlur} />
              </div>

              <button
                type="button"
                onClick={addAddr}
                style={{
                  marginTop: "1.25rem",
                  width: "100%",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "var(--r)",
                  background: "var(--grad-brand)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  fontFamily: "var(--font-heading)",
                  cursor: "pointer",
                  transition: "transform 0.2s var(--ease), box-shadow 0.2s var(--ease)",
                  boxShadow: "var(--shadow-cyan)",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,212,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-cyan)";
                }}
              >
                Lưu địa chỉ
              </button>
            </div>
          )}

          {/* Address List */}
          {addresses.length === 0 ? (
            <div style={{
              display: "grid",
              placeItems: "center",
              gap: "1rem",
              minHeight: 320,
              textAlign: "center",
              padding: "2rem",
              borderRadius: "var(--r-xl)",
              border: "1px dashed var(--border-2)",
              background: "var(--surface)",
              backdropFilter: "blur(20px)",
            }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                animation: "pulse 2s infinite",
              }}>
                📍
              </div>
              <h2 style={{
                margin: 0,
                fontFamily: "var(--font-heading)",
                color: "var(--text)",
                fontSize: "1.3rem",
                fontWeight: 700,
              }}>Chưa có địa chỉ nào</h2>
              <p style={{
                margin: 0,
                color: "var(--text-3)",
                maxWidth: 420,
                lineHeight: 1.6,
                fontSize: "0.9rem",
              }}>
                Thêm địa chỉ giao hàng để checkout nhanh hơn và quản lý đơn hàng thuận tiện.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--r)",
                  background: "var(--grad-brand)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-heading)",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-cyan)",
                }}
              >
                + Thêm địa chỉ đầu tiên
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {addresses.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1.25rem",
                    borderRadius: "var(--r-lg)",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    backdropFilter: "blur(20px)",
                    transition: "all 0.25s var(--ease)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", minWidth: 0 }}>
                    <span style={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: "var(--r-sm)",
                      background: "rgba(0,212,255,0.08)",
                      border: "1px solid rgba(0,212,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}>📍</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        flexWrap: "wrap",
                        marginBottom: "0.3rem",
                      }}>
                        <strong style={{
                          color: "var(--text)",
                          fontFamily: "var(--font-heading)",
                          fontSize: "1rem",
                        }}>{a.fullName}</strong>
                        <span style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          background: "rgba(0,212,255,0.1)",
                          border: "1px solid rgba(0,212,255,0.2)",
                          color: "var(--cyan)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}>{a.phone}</span>
                      </div>
                      <p style={{
                        margin: 0,
                        color: "var(--text-3)",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                      }}>
                        {a.address}, {a.ward}, {a.district}, {a.province}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Xóa địa chỉ"
                    onClick={() => removeAddr(i)}
                    style={{
                      flexShrink: 0,
                      width: 38,
                      height: 38,
                      borderRadius: "var(--r-sm)",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "var(--red)",
                      fontSize: "1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s var(--ease)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.18)";
                      e.currentTarget.style.borderColor = "var(--red)";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                      e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
