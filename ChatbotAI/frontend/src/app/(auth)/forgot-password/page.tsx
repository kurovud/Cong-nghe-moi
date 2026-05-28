"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="auth-page">
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.07), transparent 70%)', animation: 'float 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)', animation: 'float 11s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="auth-card">
        {sent ? (
          <>
            <div className="auth-card__header">
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.8rem', boxShadow: '0 0 24px rgba(16,185,129,0.2)' }}>
                ✉️
              </div>
              <h1>Kiểm tra email</h1>
              <p>Link đặt lại mật khẩu đã được gửi đến</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--r)', textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>{email}</span>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', textAlign: 'center', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn trong email. Nếu không thấy, hãy kiểm tra thư mục spam.
            </p>
            <Link href="/login" className="auth-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 'var(--r)', background: 'var(--grad-brand)', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
              ← Quay lại đăng nhập
            </Link>
          </>
        ) : (
          <>
            <div className="auth-card__header">
              <div className="auth-logo-icon" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.15))', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--cyan)', fontSize: '1.5rem' }}>
                🔑
              </div>
              <h1>Quên mật khẩu?</h1>
              <p>Nhập email để nhận link đặt lại mật khẩu</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Địa chỉ Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Đang gửi…
                  </span>
                ) : "Gửi link đặt lại mật khẩu"}
              </button>
            </form>
          </>
        )}

        <div className="auth-card__footer">
          <Link href="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
