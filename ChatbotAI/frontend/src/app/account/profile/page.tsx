"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

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
          Vui lòng <Link href="/login" style={{ color: "var(--cyan)", fontWeight: 600 }}>đăng nhập</Link> để xem thông tin cá nhân.
        </p>
      </div>
    </div>
  );

  const updateProfile = async () => {
    const r = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_profile", token, name, phone }),
    });
    const data = await r.json();
    setMsg(data.error ? `❌ ${data.error}` : "✅ Cập nhật thành công!");
  };

  const changePw = async () => {
    if (newPw.length < 6) { setPwMsg("Mật khẩu tối thiểu 6 ký tự"); return; }
    const r = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", token, oldPassword: oldPw, newPassword: newPw }),
    });
    const data = await r.json();
    setPwMsg(data.error ? `❌ ${data.error}` : "✅ Đổi mật khẩu thành công!");
    if (!data.error) { setOldPw(""); setNewPw(""); }
  };

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

  const inputDisabledStyle: React.CSSProperties = {
    ...inputStyle,
    opacity: 0.5,
    cursor: "not-allowed",
    background: "rgba(255,255,255,0.02)",
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

  const cardStyle: React.CSSProperties = {
    padding: "1.75rem",
    borderRadius: "var(--r-lg)",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    backdropFilter: "blur(20px)",
  };

  const msgBadge = (text: string, isError: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    marginTop: "0.75rem",
    padding: "0.55rem 1rem",
    borderRadius: "var(--r-sm)",
    background: isError ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
    border: `1px solid ${isError ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`,
    color: isError ? "var(--red)" : "var(--green)",
    fontWeight: 600,
    fontSize: "0.9rem",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <span>Thông tin cá nhân</span>
        </nav>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 640 }}>

          {/* Avatar Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "var(--grad-brand)",
              padding: 3,
              marginBottom: "1rem",
              boxShadow: "var(--shadow-cyan)",
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "var(--bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--cyan)",
                letterSpacing: "0.05em",
              }}>
                {initials}
              </div>
            </div>
            <h1 style={{
              margin: 0,
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}>
              <span className="gradient-text">Thông tin cá nhân</span>
            </h1>
            <p style={{ margin: "0.5rem 0 0", color: "var(--text-3)", fontSize: "0.9rem" }}>
              Quản lý thông tin cá nhân và bảo mật tài khoản
            </p>
          </div>

          {/* Profile Info Card */}
          <div style={cardStyle}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{
                width: 36,
                height: 36,
                borderRadius: "var(--r-sm)",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}>👤</span>
              <h2 style={{
                margin: 0,
                fontFamily: "var(--font-heading)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text)",
              }}>Thông tin cơ bản</h2>
            </div>

            <div style={{ display: "grid", gap: "1.1rem" }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  value={user.email}
                  disabled
                  style={inputDisabledStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Họ và tên</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--cyan)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Số điện thoại</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--cyan)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {msg && (
              <div style={msgBadge(msg, msg.includes("❌"))}>
                {msg}
              </div>
            )}

            <button
              type="button"
              onClick={updateProfile}
              style={{
                marginTop: "1.5rem",
                width: "100%",
                padding: "0.85rem 1.5rem",
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
              Lưu thay đổi
            </button>
          </div>

          {/* Password Change Card */}
          <div style={{ ...cardStyle, marginTop: "1.5rem" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{
                width: 36,
                height: 36,
                borderRadius: "var(--r-sm)",
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}>🔒</span>
              <h2 style={{
                margin: 0,
                fontFamily: "var(--font-heading)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text)",
              }}>Đổi mật khẩu</h2>
            </div>

            <div style={{ display: "grid", gap: "1.1rem" }}>
              <div>
                <label style={labelStyle}>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={oldPw}
                  onChange={(e) => setOldPw(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--purple)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--purple)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {pwMsg && (
              <div style={msgBadge(pwMsg, pwMsg.includes("❌"))}>
                {pwMsg}
              </div>
            )}

            <button
              type="button"
              onClick={changePw}
              style={{
                marginTop: "1.5rem",
                width: "100%",
                padding: "0.85rem 1.5rem",
                borderRadius: "var(--r)",
                background: "transparent",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "var(--purple)",
                fontWeight: 700,
                fontSize: "0.95rem",
                fontFamily: "var(--font-heading)",
                cursor: "pointer",
                transition: "all 0.2s var(--ease)",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(168,85,247,0.1)";
                e.currentTarget.style.borderColor = "var(--purple)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Đổi mật khẩu
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
