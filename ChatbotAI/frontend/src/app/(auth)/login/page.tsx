"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error ?? "Đăng nhập thất bại");
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 9s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 11s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-card__header">
          <div className="auth-logo-icon" style={{
            animation: 'glow-pulse 3s ease-in-out infinite',
          }}>
            PB
          </div>
          <h1>Đăng nhập</h1>
          <p>Chào mừng bạn quay lại <strong style={{ color: 'var(--cyan)' }}>PC Builder Shop</strong></p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <span style={{ marginRight: '0.4rem' }}>✉️</span> Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span style={{ marginRight: '0.4rem' }}>🔐</span> Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember me + Forgot password row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '-0.25rem',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.82rem',
              color: 'var(--text-2)',
              userSelect: 'none',
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--cyan)',
                  cursor: 'pointer',
                }}
              />
              Ghi nhớ đăng nhập
            </label>

            <div className="auth-form__links">
              <Link href="/forgot-password">Quên mật khẩu?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="button auth-btn"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}>
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                  flexShrink: 0,
                }} />
                Đang đăng nhập…
              </span>
            ) : (
              '🚀 Đăng nhập'
            )}
          </button>
        </form>

        <div className="auth-card__footer">
          Chưa có tài khoản?{' '}
          <Link href="/register">Đăng ký ngay →</Link>
        </div>

        {/* Demo accounts section */}
        <div className="auth-demo">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.6rem',
            color: 'var(--cyan)',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            🧪 Tài khoản Demo
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: 'var(--r-sm)',
              padding: '0.5rem 0.75rem',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.78rem', marginBottom: '2px' }}>
                👤 Customer
              </div>
              <div style={{ color: 'var(--text-2)', fontSize: '0.75rem' }}>
                demo@pcbuildershop.vn / <span style={{ color: 'var(--cyan)' }}>demo123</span>
              </div>
            </div>
            <div style={{
              background: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.15)',
              borderRadius: 'var(--r-sm)',
              padding: '0.5rem 0.75rem',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.78rem', marginBottom: '2px' }}>
                👑 Admin
              </div>
              <div style={{ color: 'var(--text-2)', fontSize: '0.75rem' }}>
                admin@pcbuildershop.vn / <span style={{ color: 'var(--purple)' }}>admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
