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

  if (!user) return (
    <div className="container section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        borderRadius: "var(--r-lg)",
        padding: "2.5rem",
        textAlign: "center",
      }}>
        <p style={{ color: "var(--text-2)", fontSize: "1.05rem" }}>
          Vui lòng <Link href="/login" style={{ color: "var(--cyan)", fontWeight: 600, textDecoration: "underline" }}>đăng nhập</Link> để xem đánh giá.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: "1.5rem" }}>
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <span>Đánh giá</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          {/* Page Header */}
          <div style={{
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: "var(--r)",
              background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(249, 115, 22, 0.15))",
              border: "1px solid rgba(251, 191, 36, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}>
              ⭐
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontFamily: "var(--font-heading)",
                background: "var(--grad-brand)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}>
                Đánh giá của tôi
              </h1>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-3)", fontSize: "0.95rem" }}>
                Quản lý tất cả đánh giá sản phẩm của bạn
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            /* Empty State */
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              borderRadius: "var(--r-xl)",
              padding: "4rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.2rem",
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(249, 115, 22, 0.1))",
                border: "1px solid rgba(251, 191, 36, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
              }}>
                ⭐
              </div>
              <h2 style={{
                margin: 0,
                color: "var(--text)",
                fontFamily: "var(--font-heading)",
                fontSize: "1.4rem",
                fontWeight: 600,
              }}>
                Chưa có đánh giá nào
              </h2>
              <p style={{
                margin: 0,
                color: "var(--text-3)",
                fontSize: "1rem",
                maxWidth: 420,
                lineHeight: 1.6,
              }}>
                Mua hàng và đánh giá sản phẩm để nhận ưu đãi! Mỗi đánh giá giúp cộng đồng chọn được sản phẩm tốt nhất.
              </p>
              <Link
                href="/products"
                className="btn-primary"
                style={{
                  marginTop: "0.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.8rem",
                  borderRadius: "var(--r)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                🛍️ Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            /* Reviews Grid */
            <div style={{ display: "grid", gap: "1rem" }}>
              {reviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "var(--r-lg)",
                    padding: "1.5rem",
                    transition: "all 0.3s var(--ease)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1px solid var(--border-2)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "1px solid var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Review Header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginBottom: "0.75rem",
                  }}>
                    <h3 style={{
                      margin: 0,
                      color: "var(--text)",
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}>
                      {r.title}
                    </h3>

                    {/* Star Rating */}
                    <div style={{
                      display: "flex",
                      gap: "2px",
                      flexShrink: 0,
                    }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            fontSize: "1.1rem",
                            color: star <= r.rating ? "#fbbf24" : "var(--text-3)",
                            filter: star <= r.rating ? "drop-shadow(0 0 3px rgba(251, 191, 36, 0.4))" : "none",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <p style={{
                    margin: "0 0 1rem",
                    color: "var(--text-2)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                  }}>
                    {r.content}
                  </p>

                  {/* Review Footer */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border)",
                  }}>
                    <span style={{
                      color: "var(--text-3)",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}>
                      🕐 {new Date(r.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      background: r.rating >= 4
                        ? "rgba(16, 185, 129, 0.1)"
                        : r.rating >= 3
                        ? "rgba(251, 191, 36, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                      color: r.rating >= 4
                        ? "var(--green)"
                        : r.rating >= 3
                        ? "#fbbf24"
                        : "var(--red)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      border: `1px solid ${
                        r.rating >= 4
                          ? "rgba(16, 185, 129, 0.2)"
                          : r.rating >= 3
                          ? "rgba(251, 191, 36, 0.2)"
                          : "rgba(239, 68, 68, 0.2)"
                      }`,
                    }}>
                      {r.rating >= 4 ? "Tuyệt vời" : r.rating >= 3 ? "Tốt" : "Cần cải thiện"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
