"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { useState } from "react";
import { cartApi } from "@/services/conference.api";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export default function CartPage() {
  const { cart, user, refreshCart } = useAuth();
  const [updating, setUpdating] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string>("");

  const updateQty = async (productId: string, quantity: number) => {
    if (!user) { window.location.href = "/login"; return; }
    setActionError("");
    setUpdating(productId);
    try {
      const target = cart.items.find((item) => item.productId === productId);
      const max = target?.maxStock ?? 999;
      const nextQty = Math.max(1, Math.min(quantity, max));
      const nextItems = cart.items
        .map((item) => item.productId === productId ? { ...item, quantity: nextQty } : item)
        .filter((item) => item.quantity > 0);
      await cartApi.updateItems(nextItems as any[]);
      await refreshCart();
    } catch {
      setActionError("Không thể cập nhật số lượng. Vui lòng thử lại.");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) { window.location.href = "/login"; return; }
    setUpdating(productId);
    try {
      const nextItems = cart.items.filter((item) => item.productId !== productId);
      await cartApi.updateItems(nextItems as any[]);
      await refreshCart();
    } catch {
      setActionError("Không thể xóa sản phẩm.");
    } finally {
      setUpdating(null);
    }
  };

  const clearAll = async () => {
    if (!user) { window.location.href = "/login"; return; }
    try {
      await cartApi.clearCart();
      await refreshCart();
    } catch {
      setActionError("Không thể xóa toàn bộ giỏ hàng.");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - var(--header-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 24px rgba(0,212,255,0.2))' }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Giỏ hàng trống</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem', lineHeight: 1.7 }}>Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và chọn sản phẩm bạn yêu thích!</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: 'var(--r)', background: 'var(--grad-brand)', color: '#fff', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,212,255,0.3)' }}>
              🛍️ Tiếp tục mua hàng
            </Link>
            <Link href="/chat" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: 'var(--r)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
              🤖 Tư vấn AI
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - var(--header-h))', padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--text-3)', transition: 'color 0.2s' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-2)' }}>Giỏ hàng ({cart.totalItems})</span>
        </nav>

        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>
            Giỏ hàng của bạn
          </h1>
          <p style={{ color: 'var(--text-2)' }}>{cart.totalItems} sản phẩm đang chờ thanh toán</p>
        </div>

        {actionError && (
          <div className="auth-error" style={{ marginBottom: '1.5rem' }}>⚠️ {actionError}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          {/* Cart items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.items.map((item) => (
              <div
                key={item.productId}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${updating === item.productId ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                  borderRadius: 'var(--r-xl)',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center',
                  transition: 'all 0.3s',
                  opacity: updating === item.productId ? 0.7 : 1,
                }}
              >
                {/* Image */}
                <div style={{ width: 80, height: 80, borderRadius: 'var(--r)', background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(168,85,247,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {item.image ? (
                    <img loading="lazy" decoding="async" src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>💻</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/products/${item.category}/${item.productId}`}
                    style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4, transition: 'color 0.2s' }}
                  >
                    {item.name}
                  </Link>
                  {item.brand && (
                    <div style={{ marginTop: '0.2rem', fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.brand}</div>
                  )}
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.discountPrice ? (
                      <>
                        <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--cyan)' }}>{formatVND(item.discountPrice)}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', textDecoration: 'line-through' }}>{formatVND(item.price)}</span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--cyan)' }}>{formatVND(item.price)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updating === item.productId}
                    style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: item.quantity <= 1 ? 0.4 : 1 }}
                  >−</button>
                  <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock || updating === item.productId}
                    style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: item.quantity >= item.maxStock ? 0.4 : 1 }}
                  >+</button>
                </div>

                {/* Subtotal */}
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '7rem' }}>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text)' }}>{formatVND((item.discountPrice ?? item.price) * item.quantity)}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>x{item.quantity}</div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  disabled={updating === item.productId}
                  title="Xóa sản phẩm"
                  style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}

            {/* Clear all */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                type="button"
                onClick={clearAll}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', padding: '0.5rem 1rem', borderRadius: 'var(--r-sm)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
              >
                <TrashIcon /> Xóa tất cả
              </button>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-2xl)', padding: '1.75rem', position: 'sticky', top: 'calc(var(--header-h) + 1rem)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              Tóm tắt đơn hàng
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-2)' }}>Tạm tính ({cart.totalItems} sản phẩm)</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>{formatVND(cart.totalPrice + cart.discountTotal)}</span>
              </div>
              {cart.discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-2)' }}>Giảm giá sản phẩm</span>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>-{formatVND(cart.discountTotal)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-2)' }}>Phí vận chuyển</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>{cart.totalPrice >= 2000000 ? 'Miễn phí' : '30.000₫'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border)', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>Tổng cộng</span>
              <span style={{ fontWeight: 900, fontSize: '1.3rem', background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {formatVND(cart.totalPrice)}
              </span>
            </div>

            {/* Free shipping notice */}
            {cart.totalPrice < 2000000 && (
              <div style={{ padding: '0.75rem', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 'var(--r)', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--orange)' }}>
                🚚 Mua thêm {formatVND(2000000 - cart.totalPrice)} để được miễn phí vận chuyển
              </div>
            )}

            <Link
              href="/checkout"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.9rem', borderRadius: 'var(--r)', background: 'var(--grad-brand)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,212,255,0.3)', transition: 'all 0.25s', marginBottom: '0.75rem' }}
            >
              Tiến hành thanh toán →
            </Link>

            <Link
              href="/products"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: 'var(--r)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.2s' }}
            >
              ← Tiếp tục mua hàng
            </Link>

            {/* Trust badges */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[
                { icon: '🔒', text: 'Thanh toán an toàn' },
                { icon: '🚚', text: 'Giao hàng nhanh' },
                { icon: '🔄', text: 'Đổi trả 7 ngày' },
                { icon: '✅', text: 'Chính hãng 100%' },
              ].map((badge) => (
                <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
