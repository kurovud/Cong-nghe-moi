"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Quên mật khẩu</h1>
          <p>Nhập email để nhận link đặt lại mật khẩu</p>
        </div>
        {sent ? (
          <div className="auth-success">
            <p>Email đặt lại mật khẩu đã được gửi đến <strong>{email}</strong></p>
            <p>Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.</p>
            <Link href="/login" className="button auth-btn" style={{ marginTop: "1rem" }}>← Quay lại đăng nhập</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="button auth-btn">Gửi link đặt lại mật khẩu</button>
          </form>
        )}
        <div className="auth-card__footer"><Link href="/login">← Quay lại đăng nhập</Link></div>
      </div>
    </div>
  );
}
