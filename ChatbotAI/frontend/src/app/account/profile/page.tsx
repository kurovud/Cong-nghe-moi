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

  if (!user) return <div className="container section"><p>Vui lòng <Link href="/login">đăng nhập</Link>.</p></div>;

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

  return (
    <div className="account-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <span>Thông tin cá nhân</span>
        </nav>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 600 }}>
          <h1>👤 Thông tin cá nhân</h1>

          <div className="checkout-section">
            <h2>Thông tin cơ bản</h2>
            <div className="form-group">
              <label>Email</label>
              <input value={user.email} disabled />
            </div>
            <div className="form-group">
              <label>Họ và tên</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {msg && <p style={{ marginTop: "0.5rem" }}>{msg}</p>}
            <button type="button" className="button auth-btn" onClick={updateProfile} style={{ marginTop: "1rem" }}>Lưu thay đổi</button>
          </div>

          <div className="checkout-section" style={{ marginTop: "2rem" }}>
            <h2>🔒 Đổi mật khẩu</h2>
            <div className="form-group">
              <label>Mật khẩu hiện tại</label>
              <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            </div>
            {pwMsg && <p style={{ marginTop: "0.5rem" }}>{pwMsg}</p>}
            <button type="button" className="button auth-btn" onClick={changePw} style={{ marginTop: "1rem" }}>Đổi mật khẩu</button>
          </div>
        </div>
      </section>
    </div>
  );
}
