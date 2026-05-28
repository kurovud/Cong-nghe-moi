"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AccountPage() {
  const { user, cart, logout } = useAuth();

  if (!user) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - var(--header-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔐</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Vui lòng đăng nhập</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem', lineHeight: 1.7 }}>Bạn cần đăng nhập để xem thông tin tài khoản và quản lý đơn hàng.</p>
          <Link href="/login" style={{ display: 'inline-flex', padding: '0.8rem 2rem', borderRadius: 'var(--r)', background: 'var(--grad-brand)', color: '#fff', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,212,255,0.3)' }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { href: "/account/profile", icon: "👤", title: "Thông tin cá nhân", desc: "Cập nhật họ tên, email, số điện thoại", color: 'var(--cyan)' },
    { href: "/account/orders", icon: "📦", title: "Đơn hàng của tôi", desc: "Theo dõi và quản lý đơn hàng", color: 'var(--purple)' },
    { href: "/account/wishlist", icon: "❤️", title: "Sản phẩm yêu thích", desc: "Danh sách sản phẩm đã lưu", color: '#ef4444' },
    { href: "/account/addresses", icon: "📍", title: "Sổ địa chỉ", desc: "Quản lý địa chỉ giao hàng", color: 'var(--orange)' },
    { href: "/account/reviews", icon: "⭐", title: "Đánh giá của tôi", desc: "Xem và quản lý đánh giá sản phẩm", color: '#f59e0b' },
    { href: "/chat", icon: "💬", title: "Hỗ trợ AI 24/7", desc: "Chat với AI chatbot tư vấn miễn phí", color: 'var(--green)' },
  ];

  const initials = user.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - var(--header-h))', padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ color: 'var(--text-3)' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--cyan)' }}>Tài khoản</span>
        </nav>

        {/* Profile Header */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-2xl)',
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(135deg, rgba(0,212,255,0.04) 0%, rgba(168,85,247,0.03) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid transparent', backgroundImage: 'var(--grad-brand), var(--grad-brand)', boxShadow: '0 0 0 3px var(--surface), 0 0 0 5px rgba(0,212,255,0.3)' }}
                />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'var(--grad-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', fontWeight: 900, color: '#fff',
                  boxShadow: '0 0 24px rgba(0,212,255,0.3)',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {initials}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--bg)', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--cyan)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {user.role === 'admin' ? '🛡️ Quản trị viên' : user.role === 'staff' ? '👔 Nhân viên' : '👤 Thành viên'}
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text)', letterSpacing: '-0.02em', margin: '0 0 0.4rem' }}>
                Xin chào, {user.name}! 👋
              </h1>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                <span>✉️ {user.email}</span>
                {user.phone && <span>📞 {user.phone}</span>}
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
              {[
                { label: 'Giỏ hàng', value: cart.totalItems, color: 'var(--cyan)' },
                { label: 'Địa chỉ', value: user.addresses?.length ?? 0, color: 'var(--purple)' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center', padding: '0.75rem 1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/account/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                ✏️ Chỉnh sửa
              </Link>
              <button
                type="button"
                onClick={logout}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
              >
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Menu grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {menuItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)',
                padding: '1.5rem',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 32px rgba(0,0,0,0.3)`;
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 var(--r-xl) 0 100%', background: `${item.color}08`, pointerEvents: 'none' }} />
                <div style={{ fontSize: '2rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.2))' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.4rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5, marginBottom: '1rem' }}>{item.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: item.color }}>
                  Truy cập <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Admin link */}
        {user.role !== 'customer' && (
          <div style={{ marginTop: '1.5rem', padding: '1rem 1.5rem', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--purple)', marginBottom: '0.25rem' }}>⚡ Khu vực quản trị</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>Quản lý sản phẩm, đơn hàng, chatbot và hệ thống</div>
            </div>
            <Link href="/admin" style={{ display: 'inline-flex', padding: '0.7rem 1.5rem', borderRadius: 'var(--r)', background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.1))', border: '1px solid rgba(168,85,247,0.3)', color: 'var(--purple)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.2s' }}>
              Vào Admin Panel →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
