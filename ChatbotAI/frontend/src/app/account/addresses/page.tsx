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

  if (!user) return <div className="container section"><p>Vui lòng <Link href="/login">đăng nhập</Link>.</p></div>;

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

  return (
    <div className="account-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <span>Sổ địa chỉ</span>
        </nav>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>📍 Sổ địa chỉ</h1>
            <button type="button" className="button btn-sm" onClick={() => setShowForm(!showForm)}>{showForm ? "Hủy" : "+ Thêm địa chỉ"}</button>
          </div>

          {showForm && (
            <div className="checkout-section" style={{ marginTop: "1rem" }}>
              <div className="form-row">
                <div className="form-group"><label>Họ tên</label><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                <div className="form-group"><label>SĐT</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Tỉnh/TP</label><input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} /></div>
                <div className="form-group"><label>Quận/Huyện</label><input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></div>
                <div className="form-group"><label>Phường/Xã</label><input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Địa chỉ</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <button type="button" className="button auth-btn" onClick={addAddr} style={{ marginTop: "0.75rem" }}>Lưu địa chỉ</button>
            </div>
          )}

          {addresses.length === 0 ? (
            <p className="text-muted" style={{ marginTop: "2rem" }}>Chưa có địa chỉ nào.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
              {addresses.map((a, i) => (
                <div key={i} className="checkout-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p><strong>{a.fullName}</strong> — {a.phone}</p>
                    <p className="text-muted">{a.address}, {a.ward}, {a.district}, {a.province}</p>
                  </div>
                  <button type="button" className="cart-item__remove" aria-label="Xóa địa chỉ" onClick={() => removeAddr(i)}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
