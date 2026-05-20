"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="account-page">
        <div className="container section">
          <div className="cart-empty">
            <h2>🔐 Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để xem thông tin tài khoản.</p>
            <Link href="/login" className="button hero__btn-primary">Đăng nhập</Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { href: "/account/profile", icon: "👤", title: "Thông tin cá nhân", desc: "Cập nhật họ tên, email, số điện thoại" },
    { href: "/account/orders", icon: "📦", title: "Đơn hàng của tôi", desc: "Theo dõi và quản lý đơn hàng" },
    { href: "/account/wishlist", icon: "❤️", title: "Sản phẩm yêu thích", desc: "Danh sách sản phẩm đã lưu" },
    { href: "/account/addresses", icon: "📍", title: "Sổ địa chỉ", desc: "Quản lý địa chỉ giao hàng" },
    { href: "/account/reviews", icon: "⭐", title: "Đánh giá của tôi", desc: "Xem và quản lý đánh giá sản phẩm" },
    { href: "/chat", icon: "💬", title: "Hỗ trợ AI", desc: "Chat với AI chatbot hỗ trợ tư vấn" },
  ];

  return (
    <div className="account-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="breadcrumb__sep">/</span>
          <span>Tài khoản</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          <div className="account-header">
            <div className="account-avatar">
              {user.avatar ? <img src={user.avatar} alt={`${user.name} avatar`} /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
            </div>
            <div>
              <h1>Xin chào, {user.name}! 👋</h1>
              <p className="text-muted">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-3">
            {menuItems.map((item) => (
              <Link href={item.href} key={item.href} className="account-menu-card">
                <span className="account-menu-card__icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
