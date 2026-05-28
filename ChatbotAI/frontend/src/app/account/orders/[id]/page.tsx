"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types/order.type";
import { orderApi } from "@/services/conference.api";
import { getAllProducts, getAllPrebuiltPCs } from "@/lib/productStore";
import { resolveProductImage } from "@/lib/product-image";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const toUiStatus = (status?: string) => String(status || "").toLowerCase();

const STATUS_LABELS: Record<string, { label: string; icon: string }> = {
  pending: { label: "Chờ xác nhận", icon: "🕐" },
  confirmed: { label: "Đã xác nhận", icon: "✅" },
  processing: { label: "Đang chuẩn bị", icon: "📦" },
  shipping: { label: "Đang giao hàng", icon: "🚚" },
  delivered: { label: "Hoàn thành", icon: "✨" },
  cancelled: { label: "Đã hủy", icon: "❌" },
  returned: { label: "Đã trả hàng", icon: "↩️" },
};

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  pending:    { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.25)", text: "#f59e0b", glow: "0 0 12px rgba(245, 158, 11, 0.2)" },
  confirmed:  { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)", text: "#10b981", glow: "0 0 12px rgba(16, 185, 129, 0.2)" },
  processing: { bg: "rgba(0, 212, 255, 0.1)",  border: "rgba(0, 212, 255, 0.25)",  text: "#00d4ff", glow: "0 0 12px rgba(0, 212, 255, 0.2)" },
  shipping:   { bg: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.25)", text: "#a855f7", glow: "0 0 12px rgba(168, 85, 247, 0.2)" },
  delivered:  { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)", text: "#10b981", glow: "0 0 12px rgba(16, 185, 129, 0.2)" },
  cancelled:  { bg: "rgba(239, 68, 68, 0.1)",  border: "rgba(239, 68, 68, 0.25)",  text: "#ef4444", glow: "0 0 12px rgba(239, 68, 68, 0.2)" },
  returned:   { bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.25)", text: "#f97316", glow: "0 0 12px rgba(249, 115, 22, 0.2)" },
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  bank_transfer: "Chuyển khoản",
  momo: "Ví MoMo",
  zalopay: "ZaloPay",
  vnpay: "ZaloPay",
  credit_card: "Thẻ tín dụng",
  installment: "Trả góp 0%",
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

/* ── Shared card style ── */
const glassCard: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  backdropFilter: "blur(20px)",
  borderRadius: "var(--r-lg)",
  padding: "1.5rem",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentPaid, setRecentPaid] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);

  const readRecentPaidSnapshot = () => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem('recent_paid_order');
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed?.orderId === String(id) ? parsed : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const paymentSuccess = searchParams.get("payment") === "success";
    if (paymentSuccess && typeof window !== "undefined") {
      const parsed = readRecentPaidSnapshot();
      if (parsed) {
        setRecentPaid(true);
        setInvoiceNumber(parsed.invoiceNumber ?? null);
      }
    }

    orderApi.getOrderById(String(id))
      .then((data) => {
        if (data?.data?.id) {
          setOrder(data.data);
        } else if (searchParams.get("payment") === "success") {
          const snapshot = readRecentPaidSnapshot();
          if (snapshot?.order) {
            setOrder(snapshot.order as Order);
            setRecentPaid(true);
            setInvoiceNumber(snapshot.invoiceNumber ?? null);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        if (searchParams.get("payment") === "success") {
          const snapshot = readRecentPaidSnapshot();
          if (snapshot?.order) {
            setOrder(snapshot.order as Order);
            setRecentPaid(true);
            setInvoiceNumber(snapshot.invoiceNumber ?? null);
            setLoading(false);
            return;
          }
        }
        setLoading(false);
      });
  }, [id, searchParams]);

  /* ── Loading ── */
  if (loading) return (
    <div className="container section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="spinner" />
    </div>
  );

  /* ── Not Found ── */
  if (!order) return (
    <div className="container section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        ...glassCard,
        borderRadius: "var(--r-xl)",
        padding: "3.5rem 2.5rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
        }}>🔎</div>
        <h2 style={{ margin: 0, color: "var(--text)", fontFamily: "var(--font-heading)", fontSize: "1.4rem" }}>
          Không tìm thấy đơn hàng
        </h2>
        <p style={{ margin: 0, color: "var(--text-3)", maxWidth: 340 }}>
          Đơn hàng có thể đã bị xóa hoặc ID không hợp lệ.
        </p>
        <Link href="/account/orders" className="btn-secondary" style={{
          marginTop: "0.5rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.65rem 1.5rem",
          borderRadius: "var(--r)",
          fontSize: "0.9rem",
          fontWeight: 600,
          textDecoration: "none",
        }}>
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  );

  const addr = order.shippingAddress;
  const items = (order.items || []).map(resolveOrderItem);
  const paymentIsPaid = recentPaid || toUiStatus(order.paymentStatus) === "paid";
  const statusKey = paymentIsPaid && toUiStatus(order.status) === "pending" ? "confirmed" : toUiStatus(order.status);
  const statusColor = STATUS_COLORS[statusKey] || STATUS_COLORS.pending;
  const statusLabel = STATUS_LABELS[statusKey] || { label: order.status, icon: "📌" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Breadcrumb ── */}
      <div className="container" style={{ paddingTop: "1.5rem" }}>
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account/orders">Đơn hàng</Link><span className="breadcrumb__sep">/</span>
          <span>{order.id}</span>
        </nav>
      </div>

      <section className="section">
        <div className="container" style={{ display: "grid", gap: "1.5rem" }}>

          {/* ═══════════════════════════════════════════════
              ORDER HEADER CARD
          ═══════════════════════════════════════════════ */}
          <div style={{
            ...glassCard,
            borderRadius: "var(--r-xl)",
            padding: "2rem",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Subtle gradient accent */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "var(--grad-brand)",
              borderRadius: "var(--r-xl) var(--r-xl) 0 0",
            }} />

            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}>
              <div>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "999px",
                  background: "rgba(0, 212, 255, 0.08)",
                  border: "1px solid rgba(0, 212, 255, 0.15)",
                  color: "var(--cyan)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "0.65rem",
                }}>
                  📦 Chi tiết đơn hàng
                </span>
                <h1 style={{
                  margin: 0,
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  background: "var(--grad-brand)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}>
                  {order.id}
                </h1>
                <p style={{ margin: "0.4rem 0 0", color: "var(--text-3)", fontSize: "0.9rem" }}>
                  Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              {/* Status Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.1rem",
                borderRadius: "999px",
                background: statusColor.bg,
                border: `1px solid ${statusColor.border}`,
                boxShadow: statusColor.glow,
              }}>
                <span style={{ fontSize: "1.1rem" }}>{statusLabel.icon}</span>
                <span style={{ color: statusColor.text, fontWeight: 700, fontSize: "0.9rem" }}>
                  {statusLabel.label}
                </span>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "0.75rem",
            }}>
              {[
                { label: "Sản phẩm", value: `${items.length} sản phẩm`, icon: "🛒" },
                { label: "Tổng thanh toán", value: formatVND((order as any).totalPrice ?? order.total), icon: "💰" },
                { label: "Thanh toán", value: paymentIsPaid ? "✅ Đã TT" : "🕐 Chưa TT", icon: "💳" },
                { label: "Số hóa đơn", value: invoiceNumber ?? `HD${String(String(id).replace(/\D/g, '').slice(-4) || String(id).slice(-4)).padStart(4, '0')}`, icon: "🧾" },
                { label: "Trạng thái", value: statusLabel.label, icon: statusLabel.icon },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--r)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                  }}
                >
                  <span style={{ color: "var(--text-3)", fontWeight: 600, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {stat.label}
                  </span>
                  <strong style={{ color: "var(--text)", fontSize: "1rem" }}>{stat.value}</strong>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "0.65rem",
              flexWrap: "wrap",
              marginTop: "1.25rem",
            }}>
              <Link href="/account/orders" className="btn-ghost btn-sm" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                textDecoration: "none",
              }}>
                ← Quay lại
              </Link>
              <Link href="/builds" className="btn-secondary btn-sm" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                textDecoration: "none",
              }}>
                🎮 Xem build sẵn
              </Link>
              <Link href="/products" className="btn-primary btn-sm" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                textDecoration: "none",
              }}>
                🛍️ Mua thêm
              </Link>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              MAIN CONTENT: 2-COLUMN LAYOUT
          ═══════════════════════════════════════════════ */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 0.9fr",
            gap: "1.5rem",
            alignItems: "start",
          }}>
            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "grid", gap: "1.5rem" }}>

              {/* Products Card */}
              <div style={{ ...glassCard, borderRadius: "var(--r-xl)" }}>
                <h2 style={{
                  margin: "0 0 1.2rem",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  🛒 <span>Sản phẩm</span>
                  <span style={{
                    marginLeft: "auto",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    background: "rgba(0, 212, 255, 0.08)",
                    border: "1px solid rgba(0, 212, 255, 0.15)",
                    color: "var(--cyan)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}>
                    {items.length}
                  </span>
                </h2>

                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "72px minmax(0, 1fr) auto",
                        gap: "1rem",
                        alignItems: "center",
                        padding: "0.85rem",
                        borderRadius: "var(--r)",
                        border: "1px solid var(--border)",
                        background: "var(--surface-2)",
                        transition: "all 0.25s var(--ease)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-2)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: "var(--r-sm)",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, rgba(0, 212, 255, 0.06), rgba(168, 85, 247, 0.06))",
                        border: "1px solid var(--border)",
                        flexShrink: 0,
                      }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>

                      {/* Product Info */}
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{
                          margin: 0,
                          color: "var(--text)",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {item.name}
                        </h3>
                        <p style={{ margin: "0.25rem 0 0", color: "var(--text-3)", fontSize: "0.82rem" }}>
                          {item.brand} • {item.category}
                        </p>
                        <p style={{ margin: "0.25rem 0 0", color: "var(--text-2)", fontSize: "0.88rem" }}>
                          {formatVND(item.discountPrice ?? item.price)} × {item.quantity}
                        </p>
                      </div>

                      {/* Item Total */}
                      <strong style={{
                        color: "var(--cyan)",
                        whiteSpace: "nowrap",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                      }}>
                        {formatVND((item.discountPrice ?? item.price) * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Card */}
              <div style={{ ...glassCard, borderRadius: "var(--r-xl)" }}>
                <h2 style={{
                  margin: "0 0 1.2rem",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  🧭 Tiến trình đơn hàng
                </h2>

                <div style={{ display: "grid", gap: "0", position: "relative" }}>
                  {(order.timeline || []).map((t, i) => {
                    const key = toUiStatus(t.status);
                    const st = STATUS_LABELS[key] ?? { label: t.status, icon: "📌" };
                    const sc = STATUS_COLORS[key] || STATUS_COLORS.pending;
                    const isLast = i === (order.timeline?.length || 0) - 1;
                    const isNotLastItem = i < (order.timeline?.length || 0) - 1;

                    return (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "40px minmax(0, 1fr)",
                          gap: "0.85rem",
                          paddingBottom: isNotLastItem ? "1.25rem" : 0,
                          position: "relative",
                        }}
                      >
                        {/* Timeline dot & line */}
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          position: "relative",
                        }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: isLast ? sc.bg : "var(--surface-2)",
                            border: `2px solid ${isLast ? sc.border : "var(--border)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.1rem",
                            boxShadow: isLast ? sc.glow : "none",
                            position: "relative",
                            zIndex: 2,
                            flexShrink: 0,
                          }}>
                            {st.icon}
                          </div>
                          {isNotLastItem && (
                            <div style={{
                              width: 2,
                              flexGrow: 1,
                              background: "var(--border-2)",
                              marginTop: 4,
                              borderRadius: 1,
                            }} />
                          )}
                        </div>

                        {/* Timeline content */}
                        <div style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "var(--r)",
                          background: isLast ? sc.bg : "var(--surface-2)",
                          border: `1px solid ${isLast ? sc.border : "var(--border)"}`,
                        }}>
                          <strong style={{
                            color: isLast ? sc.text : "var(--text)",
                            fontSize: "0.95rem",
                          }}>
                            {st.label}
                          </strong>
                          <p style={{ margin: "0.2rem 0 0", color: "var(--text-3)", fontSize: "0.82rem" }}>
                            {new Date(t.timestamp).toLocaleString("vi-VN")}
                          </p>
                          {t.note && (
                            <p style={{ margin: "0.3rem 0 0", color: "var(--text-2)", fontSize: "0.88rem" }}>
                              {t.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "grid", gap: "1.5rem", alignContent: "start" }}>

              {/* Shipping Card */}
              <div style={{ ...glassCard, borderRadius: "var(--r-xl)" }}>
                <h2 style={{
                  margin: "0 0 1rem",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  📍 Giao hàng
                </h2>

                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <p style={{
                    margin: 0,
                    color: "var(--text)",
                    fontWeight: 700,
                    fontSize: "1.02rem",
                  }}>
                    {addr.fullName}
                  </p>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-2)",
                    fontSize: "0.9rem",
                  }}>
                    <span style={{ color: "var(--text-3)" }}>📞</span>
                    {addr.phone}
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-2)",
                    fontSize: "0.9rem",
                  }}>
                    <span style={{ color: "var(--text-3)" }}>📧</span>
                    {addr.email}
                  </div>
                  <div style={{
                    padding: "0.75rem",
                    borderRadius: "var(--r-sm)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text-2)",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    marginTop: "0.25rem",
                  }}>
                    📍 {addr.address}, {addr.ward}, {addr.district}, {addr.province}
                  </div>
                  {order.note && (
                    <div style={{
                      padding: "0.65rem 0.85rem",
                      borderRadius: "var(--r-sm)",
                      background: "rgba(249, 115, 22, 0.06)",
                      border: "1px solid rgba(249, 115, 22, 0.12)",
                      color: "var(--text-2)",
                      fontSize: "0.88rem",
                      marginTop: "0.25rem",
                    }}>
                      📝 {order.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Card */}
              <div style={{ ...glassCard, borderRadius: "var(--r-xl)" }}>
                <h2 style={{
                  margin: "0 0 1rem",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  💳 Thanh toán
                </h2>

                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--r-sm)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}>
                    <span style={{ color: "var(--text-3)", fontSize: "0.88rem" }}>Phương thức</span>
                    <strong style={{ color: "var(--text)", fontSize: "0.92rem" }}>
                      {PAYMENT_LABELS[toUiStatus(order.paymentMethod)] ?? order.paymentMethod}
                    </strong>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--r-sm)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}>
                    <span style={{ color: "var(--text-3)", fontSize: "0.88rem" }}>Trạng thái</span>
                    <span style={{
                      padding: "0.25rem 0.7rem",
                      borderRadius: "999px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      ...(paymentIsPaid
                        ? { background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "var(--green)" }
                        : toUiStatus(order.paymentStatus) === "refunded"
                        ? { background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.2)", color: "#f97316" }
                        : { background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)", color: "#f59e0b" }
                      ),
                    }}>
                      {paymentIsPaid
                        ? "✅ Đã thanh toán"
                        : toUiStatus(order.paymentStatus) === "refunded"
                        ? "↩️ Đã hoàn tiền"
                        : "🕐 Chưa thanh toán"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div style={{
                ...glassCard,
                borderRadius: "var(--r-xl)",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Top gradient accent */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--grad-brand)",
                }} />

                <h2 style={{
                  margin: "0 0 1rem",
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  💰 Tổng kết
                </h2>

                <div style={{ display: "grid", gap: "0.65rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                  }}>
                    <span style={{ color: "var(--text-3)", fontSize: "0.92rem" }}>Tạm tính</span>
                    <strong style={{ color: "var(--text-2)", fontSize: "0.95rem" }}>{formatVND(order.subtotal)}</strong>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                  }}>
                    <span style={{ color: "var(--text-3)", fontSize: "0.92rem" }}>Phí vận chuyển</span>
                    <strong style={{ color: "var(--text-2)", fontSize: "0.95rem" }}>{formatVND(order.shippingFee)}</strong>
                  </div>

                  {order.discount > 0 && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      alignItems: "center",
                    }}>
                      <span style={{ color: "var(--green)", fontSize: "0.92rem" }}>
                        Giảm giá {order.couponCode && `(${order.couponCode})`}
                      </span>
                      <strong style={{ color: "var(--green)", fontSize: "0.95rem" }}>
                        -{formatVND(order.discount)}
                      </strong>
                    </div>
                  )}

                  {/* Total */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    paddingTop: "0.75rem",
                    marginTop: "0.25rem",
                    borderTop: "1px solid var(--border-2)",
                  }}>
                    <span style={{
                      color: "var(--text)",
                      fontSize: "1rem",
                      fontWeight: 700,
                    }}>
                      Tổng thanh toán
                    </span>
                    <strong style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      background: "var(--grad-brand)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                      {formatVND((order as any).totalPrice ?? order.total)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Cancel / Additional Actions */}
              {(statusKey === "pending" || statusKey === "confirmed") && (
                <div style={{
                  ...glassCard,
                  borderRadius: "var(--r-xl)",
                  border: "1px solid rgba(239, 68, 68, 0.12)",
                  background: "rgba(239, 68, 68, 0.04)",
                  textAlign: "center",
                }}>
                  <p style={{
                    margin: "0 0 0.75rem",
                    color: "var(--text-3)",
                    fontSize: "0.88rem",
                  }}>
                    Bạn có thể hủy đơn hàng khi đang ở trạng thái chờ xác nhận.
                  </p>
                  <button
                    style={{
                      padding: "0.6rem 1.5rem",
                      borderRadius: "var(--r)",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      color: "var(--red)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.25s var(--ease)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
                      e.currentTarget.style.boxShadow = "0 0 16px rgba(239, 68, 68, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    ❌ Hủy đơn hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
