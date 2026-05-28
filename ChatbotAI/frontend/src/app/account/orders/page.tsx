"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Order } from "@/types/order.type";
import { orderApi } from "@/services/conference.api";
import { getAllProducts, getAllPrebuiltPCs } from "@/lib/productStore";
import { resolveProductImage } from "@/lib/product-image";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Chờ xác nhận", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  confirmed: { label: "Đã xác nhận", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  processing: { label: "Đang chuẩn bị", color: "#00d4ff", bg: "rgba(0,212,255,0.12)" },
  shipping: { label: "Đang giao", color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
  delivered: { label: "Hoàn thành", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  cancelled: { label: "Đã hủy", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  returned: { label: "Đã trả", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};

const productLookup = new Map<string, any>();
getAllProducts().forEach((product) => productLookup.set(product.id, product));
getAllPrebuiltPCs().forEach((product) => productLookup.set(product.id, { ...product, category: "prebuilt" }));

const resolveOrderItem = (item: any) => {
  const product = productLookup.get(item.productId);
  const price = Number(item.discountPrice ?? product?.discountPrice ?? item.price ?? product?.price ?? 0);
  const originalPrice = Number(item.price ?? product?.price ?? price);

  return {
    ...item,
    name: item.name || product?.name || item.productId,
    brand: item.brand || product?.brand || "PC Builder Shop",
    category: item.category || product?.category || "prebuilt",
    price: Number.isFinite(originalPrice) ? originalPrice : 0,
    discountPrice: Number.isFinite(price) ? price : undefined,
    image: resolveProductImage(item.image ?? product?.image, item.category || product?.category),
  };
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    orderApi.getMyOrders({ page: 1, limit: 50 })
      .then((data) => { setOrders(data.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="container section" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
      <p style={{ color: "var(--text-2)" }}>
        Vui lòng <Link href="/login" style={{ color: "var(--cyan)" }}>đăng nhập</Link> để xem đơn hàng.
      </p>
    </div>
  );

  const hydratedOrders = orders.map((order: any) => ({
    ...order,
    items: (order.items ?? []).map(resolveOrderItem),
  }));

  const totalRevenue = hydratedOrders.reduce((sum, order: any) => sum + Number(order.totalPrice ?? order.total ?? 0), 0);
  const pendingCount = hydratedOrders.filter((order) => String(order.status || '').toLowerCase() === 'pending').length;
  const completedCount = hydratedOrders.filter((order) => String(order.status || '').toLowerCase() === 'delivered').length;

  return (
    <div className="account-page order-page">
      {/* Breadcrumb */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(5,13,26,0.8)",
        backdropFilter: "blur(12px)",
      }}>
        <div className="container" style={{ padding: "0.75rem 1.5rem" }}>
          <nav className="breadcrumb">
            <Link href="/" style={{ color: "var(--text-2)", textDecoration: "none", fontSize: "0.875rem" }}>Trang chủ</Link>
            <span className="breadcrumb__sep" style={{ color: "var(--text-2)", margin: "0 0.5rem" }}>›</span>
            <Link href="/account" style={{ color: "var(--text-2)", textDecoration: "none", fontSize: "0.875rem" }}>Tài khoản</Link>
            <span className="breadcrumb__sep" style={{ color: "var(--text-2)", margin: "0 0.5rem" }}>›</span>
            <span style={{ color: "var(--orange)", fontSize: "0.875rem", fontWeight: 600 }}>Đơn hàng</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">

          {/* Page Header + Stats */}
          <div className="glass-card" style={{
            padding: "1.75rem",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* BG glow */}
            <div style={{
              position: "absolute", top: -80, right: -80,
              width: 240, height: 240, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                background: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.25)",
                color: "#f97316",
                fontWeight: 700,
                fontSize: "0.8rem",
                marginBottom: "0.75rem",
              }}>
                🧾 Lịch sử mua hàng
              </div>
              <h1 style={{
                margin: "0 0 0.5rem",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #f97316 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Đơn hàng của tôi
              </h1>
              <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 680 }}>
                Theo dõi trạng thái, xem chi tiết và quản lý toàn bộ đơn hàng của bạn.
              </p>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}>
              {[
                { label: "Tổng đơn", value: orders.length, icon: "📦", color: "#00d4ff" },
                { label: "Chờ xử lý", value: pendingCount, icon: "⏳", color: "#f59e0b" },
                { label: "Hoàn thành", value: completedCount, icon: "✅", color: "#10b981" },
                { label: "Tổng giá trị", value: formatVND(totalRevenue), icon: "💰", color: "#a855f7" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: "1rem",
                  borderRadius: "14px",
                  border: `1px solid ${stat.color}20`,
                  background: `${stat.color}06`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                }}>
                  <span style={{ fontSize: "1.2rem" }}>{stat.icon}</span>
                  <strong style={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    color: stat.color,
                  }}>
                    {stat.value}
                  </strong>
                  <span style={{ color: "var(--text-2)", fontWeight: 600, fontSize: "0.8rem" }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <Link href="/products" className="btn-secondary" style={{ textDecoration: "none", padding: "0.55rem 1rem", fontSize: "0.85rem" }}>
                🛍️ Tiếp tục mua
              </Link>
              <Link href="/builds" className="btn-secondary" style={{ textDecoration: "none", padding: "0.55rem 1rem", fontSize: "0.85rem" }}>
                🎮 Xem build sẵn
              </Link>
              <Link href="/services" className="btn-secondary" style={{ textDecoration: "none", padding: "0.55rem 1rem", fontSize: "0.85rem" }}>
                🛠️ Đặt dịch vụ
              </Link>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
              padding: "4rem 0", color: "var(--text-2)",
            }}>
              <div style={{
                width: 40, height: 40,
                borderRadius: "50%",
                border: "3px solid var(--border)",
                borderTopColor: "var(--cyan)",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ margin: 0 }}>Đang tải đơn hàng…</p>
            </div>
          ) : hydratedOrders.length === 0 ? (
            /* Empty state */
            <div className="glass-card" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
              padding: "4rem 2rem",
              textAlign: "center",
              border: "1px dashed rgba(249,115,22,0.2)",
            }}>
              <div style={{
                width: 100, height: 100,
                borderRadius: "50%",
                background: "rgba(249,115,22,0.06)",
                border: "2px solid rgba(249,115,22,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "3rem",
                boxShadow: "0 0 40px rgba(249,115,22,0.1)",
              }}>
                📦
              </div>
              <div>
                <h2 style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #f97316, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Chưa có đơn hàng nào
                </h2>
                <p style={{ margin: 0, color: "var(--text-2)", maxWidth: 500, lineHeight: 1.6 }}>
                  Hãy chọn một sản phẩm, một build sẵn hoặc dịch vụ để bắt đầu đặt hàng.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/products" className="btn-primary" style={{ textDecoration: "none" }}>🛍️ Mua hàng ngay</Link>
                <Link href="/builds" className="btn-secondary" style={{ textDecoration: "none" }}>🎮 Xem build sẵn</Link>
                <Link href="/services" className="btn-secondary" style={{ textDecoration: "none" }}>🛠️ Xem dịch vụ</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {hydratedOrders.map((order: any) => {
                const statusKey = String(order.status || "").toLowerCase();
                const st = STATUS_LABELS[statusKey] ?? { label: order.status || "Không rõ", color: "#888", bg: "rgba(136,136,136,0.1)" };
                const firstItems = (order.items || []).slice(0, 3);
                const isExpanded = expandedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="glass-card"
                    style={{
                      padding: 0,
                      overflow: "hidden",
                      transition: "box-shadow 0.25s ease",
                    }}
                  >
                    {/* Order Card Header — clickable */}
                    <div
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      style={{
                        padding: "1.25rem 1.5rem",
                        cursor: "pointer",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                        {/* Product thumbnails */}
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          {firstItems.map((item: any) => (
                            <div key={item.productId} style={{
                              width: 52, height: 52,
                              borderRadius: "10px",
                              overflow: "hidden",
                              border: "1px solid var(--border)",
                              background: "rgba(255,255,255,0.02)",
                              flexShrink: 0,
                            }}>
                              <img loading="lazy" decoding="async" src={item.image} alt={item.name} title={item.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div style={{
                              width: 52, height: 52,
                              borderRadius: "10px",
                              border: "1px dashed var(--border)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "var(--text-2)",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              background: "rgba(255,255,255,0.02)",
                            }}>
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        {/* Order info */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                            <span style={{ color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, fontFamily: "monospace" }}>
                              #{order.id?.slice(-8)?.toUpperCase() || order.id}
                            </span>
                            {/* Status badge */}
                            <span style={{
                              padding: "0.25rem 0.7rem",
                              borderRadius: "999px",
                              background: st.bg,
                              color: st.color,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              border: `1px solid ${st.color}30`,
                            }}>
                              {st.label}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ color: "var(--text-2)", fontSize: "0.82rem" }}>
                              📅 {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                            <span style={{ color: "var(--text-2)", fontSize: "0.82rem" }}>
                              📦 {order.items.length} sản phẩm
                            </span>
                            <span style={{ color: "var(--text-2)", fontSize: "0.82rem" }}>
                              👤 {order.shippingAddress?.fullName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                        <strong style={{
                          fontWeight: 900,
                          fontSize: "1.1rem",
                          background: "linear-gradient(135deg, #00d4ff, #a855f7)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>
                          {formatVND(order.totalPrice ?? order.total ?? 0)}
                        </strong>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <Link
                            href={`/account/orders/${order.id}`}
                            onClick={e => e.stopPropagation()}
                            style={{
                              padding: "0.35rem 0.75rem",
                              borderRadius: "8px",
                              background: "rgba(0,212,255,0.1)",
                              border: "1px solid rgba(0,212,255,0.2)",
                              color: "var(--cyan)",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              textDecoration: "none",
                              transition: "all 0.2s",
                            }}
                          >
                            Chi tiết →
                          </Link>
                          <span style={{
                            color: "var(--text-2)",
                            fontSize: "0.85rem",
                            transition: "transform 0.2s",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            display: "inline-block",
                          }}>
                            ▾
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable items list */}
                    {isExpanded && (
                      <div style={{
                        borderTop: "1px solid var(--border)",
                        padding: "1rem 1.5rem",
                        background: "rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        animation: "fadeIn 0.2s ease",
                      }}>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Sản phẩm trong đơn
                        </p>
                        {order.items.map((item: any) => (
                          <div key={item.productId} style={{
                            display: "grid",
                            gridTemplateColumns: "48px 1fr auto",
                            gap: "0.75rem",
                            alignItems: "center",
                            padding: "0.625rem",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid var(--border)",
                          }}>
                            <div style={{
                              width: 48, height: 48,
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: "1px solid var(--border)",
                            }}>
                              <img loading="lazy" decoding="async" src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{item.name}</p>
                              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-2)" }}>
                                {item.brand} · x{item.quantity}
                              </p>
                            </div>
                            <span style={{
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              color: "var(--cyan)",
                              whiteSpace: "nowrap",
                            }}>
                              {formatVND((item.discountPrice ?? item.price) * item.quantity)}
                            </span>
                          </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="btn-primary"
                            style={{ textDecoration: "none", padding: "0.6rem 1.25rem", fontSize: "0.875rem" }}
                          >
                            Xem đơn hàng đầy đủ →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
