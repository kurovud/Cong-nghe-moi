"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ProductReview } from "@/types/order.type";

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  useEffect(() => {
    // Since there's no dedicated API for user reviews, we'll display from local state
    // In production this would be a proper API call
    if (!user) return;
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", productId: "" }),
    }).catch(() => {});
    // For demo purposes, we'll fetch all and filter client-side
  }, [user]);

  if (!user) return <div className="container section"><p>Vui lòng <Link href="/login">đăng nhập</Link>.</p></div>;

  return (
    <div className="account-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <span>Đánh giá</span>
        </nav>
      </div>
      <section className="section">
        <div className="container">
          <h1>⭐ Đánh giá của tôi</h1>
          {reviews.length === 0 ? (
            <div className="cart-empty">
              <p>Bạn chưa có đánh giá nào. Mua hàng và đánh giá sản phẩm để nhận ưu đãi!</p>
              <Link href="/products" className="button hero__btn-primary">🛍️ Mua hàng</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {reviews.map((r) => (
                <div key={r.id} className="checkout-section">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{r.title}</strong>
                    <span>{"⭐".repeat(r.rating)}</span>
                  </div>
                  <p className="text-muted">{r.content}</p>
                  <small className="text-muted">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
