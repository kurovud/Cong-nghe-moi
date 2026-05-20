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
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Đăng ký</h1>
          <p>Tạo tài khoản để mua hàng và theo dõi đơn hàng</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Họ và tên *</label>
            <input id="name" type="text" placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" type="tel" placeholder="0909 xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pw">Mật khẩu *</label>
              <input id="pw" type="password" placeholder="Tối thiểu 6 ký tự" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="cpw">Xác nhận mật khẩu *</label>
              <input id="cpw" type="password" placeholder="Nhập lại" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="button auth-btn" disabled={loading}>{loading ? "Đang đăng ký…" : "Đăng ký"}</button>
        </form>
        <div className="auth-card__footer">Đã có tài khoản? <Link href="/login">Đăng nhập</Link></div>
      </div>
    </div>
  );
}
