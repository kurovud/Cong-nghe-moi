"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { useState } from "react";
import { cartApi } from "@/services/conference.api";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

export default function CartPage() {
  const { cart, user, refreshCart } = useAuth();
  const [updating, setUpdating] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string>("");

  const updateQty = async (productId: string, quantity: number) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
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
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setActionError("");
    setUpdating(productId);
    try {
      const nextItems = cart.items.filter((item) => item.productId !== productId);
      await cartApi.updateItems(nextItems as any[]);
      await refreshCart();
    } catch {
      setActionError("Không thể xóa sản phẩm khỏi giỏ hàng.");
    } finally {
      setUpdating(null);
    }
  };

  const clearAll = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setActionError("");
    try {
      await cartApi.clearCart();
      await refreshCart();
    } catch {
      setActionError("Không thể xóa toàn bộ giỏ hàng.");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container section">
          <div className="cart-empty">
            <span className="cart-empty__icon">GIỎ</span>
            <h2>Giỏ hàng trống</h2>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link href="/products" className="button hero__btn-primary">
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className="breadcrumb__sep">/</span>
          <span>Giỏ hàng ({cart.totalItems})</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          <h1>🛒 Giỏ hàng của bạn</h1>
          {actionError && <p className="checkout-coupon__msg">{actionError}</p>}

          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.productId} className={`cart-item ${updating === item.productId ? "cart-item--updating" : ""}`}>
                  <div className="cart-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item__info">
                    <Link href={`/products/${item.category}/${item.productId}`} className="cart-item__name">
                      {item.name}
                    </Link>
                    <span className="cart-item__brand">{item.brand}</span>
                    <div className="cart-item__pricing">
                      {item.discountPrice ? (
                        <>
                          <span className="cart-item__price cart-item__price--sale">{formatVND(item.discountPrice)}</span>
                          <span className="cart-item__price cart-item__price--old">{formatVND(item.price)}</span>
                        </>
                      ) : (
                        <span className="cart-item__price">{formatVND(item.price)}</span>
                      )}
                    </div>
                  </div>
                  <div className="cart-item__qty">
                    <button type="button" onClick={() => updateQty(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.productId, item.quantity + 1)} disabled={item.quantity >= item.maxStock}>+</button>
                  </div>
                  <div className="cart-item__subtotal">
                    {formatVND((item.discountPrice ?? item.price) * item.quantity)}
                  </div>
                  <button type="button" className="cart-item__remove" onClick={() => removeItem(item.productId)} title="Xóa">
                    🗑️
                  </button>
                </div>
              ))}
              <button type="button" className="cart-clear" onClick={clearAll}>Xóa tất cả</button>
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3>📋 Tóm tắt đơn hàng</h3>
              <div className="cart-summary__row">
                <span>Tạm tính ({cart.totalItems} sản phẩm)</span>
                <span>{formatVND(cart.totalPrice + cart.discountTotal)}</span>
              </div>
              {cart.discountTotal > 0 && (
                <div className="cart-summary__row cart-summary__row--discount">
                  <span>Giảm giá sản phẩm</span>
                  <span>-{formatVND(cart.discountTotal)}</span>
                </div>
              )}
              <div className="cart-summary__row cart-summary__row--total">
                <span>Tổng cộng</span>
                <span>{formatVND(cart.totalPrice)}</span>
              </div>
              <Link href="/checkout" className="button auth-btn">
                Tiến hành thanh toán →
              </Link>
              <Link href="/products" className="cart-summary__continue">
                ← Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
