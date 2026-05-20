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
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Đăng nhập</h1>
          <p>Chào mừng bạn quay lại PC Builder Shop</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="auth-form__links">
            <Link href="/forgot-password">Quên mật khẩu?</Link>
          </div>
          <button type="submit" className="button auth-btn" disabled={loading}>
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>

        <div className="auth-card__footer">
          Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
        </div>

        <div className="auth-demo">
          <p><strong>Tài khoản demo:</strong></p>
          <p>Customer: demo@pcbuildershop.vn / demo123</p>
          <p>Admin: admin@pcbuildershop.vn / admin123</p>
        </div>
      </div>
    </div>
  );
}
