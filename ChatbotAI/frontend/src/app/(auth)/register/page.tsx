"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPw) { setError("Mật khẩu xác nhận không khớp"); return; }
    if (password.length < 6) { setError("Mật khẩu tối thiểu 6 ký tự"); return; }
    setLoading(true);
    const result = await register({ email, password, name, phone: phone || undefined });
    setLoading(false);
    if (result.success) { router.push("/"); } else { setError(result.error ?? "Đăng ký thất bại"); }
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '8%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '8%',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 13s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '5%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div className="auth-card" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-logo-icon" style={{
            animation: 'glow-pulse 3s ease-in-out infinite',
          }}>
            PB
          </div>
          <h1>Tạo tài khoản</h1>
          <p>Tham gia cộng đồng <strong style={{ color: 'var(--cyan)' }}>PC Builder Shop</strong> ngay hôm nay</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">
              <span style={{ marginRight: '0.4rem' }}>👤</span> Họ và tên <span style={{ color: 'var(--orange)' }}>*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              <span style={{ marginRight: '0.4rem' }}>✉️</span> Email <span style={{ color: 'var(--orange)' }}>*</span>
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

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">
              <span style={{ marginRight: '0.4rem' }}>📱</span> Số điện thoại <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(tùy chọn)</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="0909 xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Password row */}
          <div className="form-row" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}>
            <div className="form-group">
              <label htmlFor="pw">
                <span style={{ marginRight: '0.4rem' }}>🔐</span> Mật khẩu <span style={{ color: 'var(--orange)' }}>*</span>
              </label>
              <input
                id="pw"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cpw">
                <span style={{ marginRight: '0.4rem' }}>🔒</span> Xác nhận <span style={{ color: 'var(--orange)' }}>*</span>
              </label>
              <input
                id="cpw"
                type="password"
                placeholder="Nhập lại"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password strength hint */}
          {password.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              marginTop: '-0.5rem',
            }}>
              {[1, 2, 3, 4].map((level) => {
                const strength = password.length >= 12 ? 4 : password.length >= 8 ? 3 : password.length >= 6 ? 2 : 1;
                const colors = ['var(--red)', 'var(--orange)', 'var(--cyan)', 'var(--green)'];
                return (
                  <div key={level} style={{
                    flex: 1,
                    height: '3px',
                    borderRadius: '2px',
                    background: level <= strength ? colors[strength - 1] : 'var(--border-2)',
                    transition: 'background 0.3s',
                  }} />
                );
              })}
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--text-3)',
                marginLeft: '0.4rem',
                whiteSpace: 'nowrap',
              }}>
                {password.length >= 12 ? '💪 Mạnh' : password.length >= 8 ? '✅ Tốt' : password.length >= 6 ? '⚠️ Vừa' : '❌ Yếu'}
              </span>
            </div>
          )}

          {/* Benefits highlight */}
          <div style={{
            background: 'rgba(0,212,255,0.04)',
            border: '1px solid rgba(0,212,255,0.12)',
            borderRadius: 'var(--r)',
            padding: '0.85rem 1rem',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              Quyền lợi thành viên
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[
                '🎁 Nhận ưu đãi đặc biệt cho thành viên mới',
                '📦 Theo dõi đơn hàng và lịch sử mua hàng',
                '🤖 Tư vấn AI cấu hình PC miễn phí',
              ].map((item, i) => (
                <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>{item}</div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="button auth-btn"
            disabled={loading}
            style={{ marginTop: '0.25rem' }}
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
                Đang đăng ký…
              </span>
            ) : (
              '✨ Tạo Tài Khoản Ngay'
            )}
          </button>
        </form>

        <div className="auth-card__footer">
          Đã có tài khoản?{' '}
          <Link href="/login">Đăng nhập →</Link>
        </div>
      </div>
    </div>
  );
}
