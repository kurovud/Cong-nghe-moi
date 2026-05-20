"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  bank_transfer: "Chuyển khoản",
  momo: "Ví MoMo",
  zalopay: "ZaloPay",
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

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getOrderById(String(id))
      .then((data) => { if (data?.data?.id) setOrder(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container section"><div className="products-loading"><div className="spinner" /></div></div>;
  if (!order) return <div className="container section"><div className="order-empty"><div className="order-empty__icon">🔎</div><h2>Không tìm thấy đơn hàng</h2><Link href="/account/orders" className="button btn-sm">← Quay lại</Link></div></div>;

  const addr = order.shippingAddress;
  const items = (order.items || []).map(resolveOrderItem);

  return (
    <div className="account-page order-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account/orders">Đơn hàng</Link><span className="breadcrumb__sep">/</span>
          <span>{order.id}</span>
        </nav>
      </div>

      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gap: "1rem",
              padding: "1.4rem",
              borderRadius: "24px",
              border: "1px solid rgba(255,143,31,0.12)",
              background: "linear-gradient(135deg, rgba(255,250,252,0.96), rgba(247,251,255,0.98))",
              boxShadow: "0 18px 48px rgba(18,32,51,0.08)",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  padding: "0.42rem 0.8rem",
                  borderRadius: "999px",
                  background: "rgba(255,179,193,0.22)",
                  color: "#162033",
                  fontWeight: 800,
                  border: "1px solid rgba(255,143,31,0.12)",
                }}
              >
                📦 Chi tiết đơn hàng
              </span>
              <h1 style={{ margin: "0.6rem 0 0", color: "#162033", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>{order.id}</h1>
              <p style={{ margin: "0.45rem 0 0", color: "#4a5568" }}>Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.8rem" }}>
              {[
                { label: "Sản phẩm", value: items.length },
                { label: "Tổng thanh toán", value: formatVND((order as any).totalPrice ?? order.total) },
                { label: "Thanh toán", value: toUiStatus(order.paymentStatus) === "paid" ? "Đã TT" : "Chưa TT" },
                { label: "Trạng thái", value: STATUS_LABELS[toUiStatus(order.status)]?.label ?? order.status },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "0.95rem 1rem",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,143,31,0.12)",
                    background: "rgba(255,255,255,0.82)",
                    display: "grid",
                    gap: "0.35rem",
                  }}
                >
                  <span style={{ color: "#7c8fa6", fontWeight: 700, fontSize: "0.88rem" }}>{stat.label}</span>
                  <strong style={{ color: "#162033", fontSize: "1.1rem" }}>{stat.value}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/account/orders" className="button btn-sm">← Quay lại danh sách</Link>
              <Link href="/builds" className="button btn-sm">🎮 Xem build sẵn</Link>
              <Link href="/products" className="button btn-sm">🛍️ Mua thêm</Link>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: "1rem" }}>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ padding: "1.3rem", borderRadius: "22px", border: "1px solid rgba(255,143,31,0.12)", background: "rgba(255,255,255,0.82)" }}>
                <h2 style={{ marginTop: 0, color: "#162033" }}>🛒 Sản phẩm ({items.length})</h2>
                <div style={{ display: "grid", gap: "0.9rem" }}>
                  {items.map((item) => (
                    <div key={item.productId} style={{ display: "grid", gridTemplateColumns: "76px minmax(0, 1fr) auto", gap: "0.9rem", alignItems: "center", padding: "0.85rem", borderRadius: "18px", border: "1px solid rgba(255,143,31,0.10)", background: "linear-gradient(135deg, rgba(255,250,252,0.95), rgba(247,251,255,0.97))" }}>
                      <div style={{ width: 76, height: 76, borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,179,193,0.14), rgba(183,216,255,0.14))" }}>
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: 0, color: "#162033", fontSize: "1rem" }}>{item.name}</h3>
                        <p style={{ margin: "0.3rem 0 0", color: "#7c8fa6" }}>{item.brand} • {item.category}</p>
                        <p style={{ margin: "0.3rem 0 0", color: "#4a5568" }}>{formatVND(item.discountPrice ?? item.price)} x {item.quantity}</p>
                      </div>
                      <strong style={{ color: "#162033", whiteSpace: "nowrap" }}>{formatVND((item.discountPrice ?? item.price) * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "1.3rem", borderRadius: "22px", border: "1px solid rgba(255,143,31,0.12)", background: "rgba(255,255,255,0.82)" }}>
                <h2 style={{ marginTop: 0, color: "#162033" }}>🧭 Tiến trình đơn hàng</h2>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {(order.timeline || []).map((t, i) => {
                    const key = toUiStatus(t.status);
                    const st = STATUS_LABELS[key] ?? { label: t.status, icon: "📌" };
                    return (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "36px minmax(0, 1fr)", gap: "0.8rem", padding: "0.85rem", borderRadius: "16px", border: "1px solid rgba(255,143,31,0.10)", background: i === (order.timeline?.length || 0) - 1 ? "rgba(255,179,193,0.12)" : "rgba(255,255,255,0.78)" }}>
                        <span style={{ fontSize: "1.1rem" }}>{st.icon}</span>
                        <div>
                          <strong style={{ color: "#162033" }}>{st.label}</strong>
                          <p style={{ margin: "0.2rem 0 0", color: "#7c8fa6" }}>{new Date(t.timestamp).toLocaleString("vi-VN")}</p>
                          {t.note && <p style={{ margin: "0.2rem 0 0", color: "#4a5568" }}>{t.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
              <div style={{ padding: "1.3rem", borderRadius: "22px", border: "1px solid rgba(255,143,31,0.12)", background: "rgba(255,255,255,0.82)" }}>
                <h2 style={{ marginTop: 0, color: "#162033" }}>📍 Giao hàng</h2>
                <p style={{ margin: 0, color: "#162033", fontWeight: 700 }}>{addr.fullName}</p>
                <p style={{ margin: "0.35rem 0 0", color: "#4a5568" }}>{addr.phone}</p>
                <p style={{ margin: "0.35rem 0 0", color: "#4a5568" }}>{addr.email}</p>
                <p style={{ margin: "0.35rem 0 0", color: "#4a5568", lineHeight: 1.55 }}>{addr.address}, {addr.ward}, {addr.district}, {addr.province}</p>
                {order.note && <p style={{ margin: "0.5rem 0 0", color: "#7c8fa6" }}>📝 {order.note}</p>}
              </div>

              <div style={{ padding: "1.3rem", borderRadius: "22px", border: "1px solid rgba(255,143,31,0.12)", background: "rgba(255,255,255,0.82)" }}>
                <h2 style={{ marginTop: 0, color: "#162033" }}>💳 Thanh toán</h2>
                <p style={{ margin: 0, color: "#4a5568" }}>Phương thức: <strong style={{ color: "#162033" }}>{PAYMENT_LABELS[toUiStatus(order.paymentMethod)] ?? order.paymentMethod}</strong></p>
                <p style={{ margin: "0.5rem 0 0", color: "#4a5568" }}>Trạng thái: <strong style={{ color: "#162033" }}>{toUiStatus(order.paymentStatus) === "paid" ? "✅ Đã thanh toán" : toUiStatus(order.paymentStatus) === "refunded" ? "↩️ Đã hoàn tiền" : "🕐 Chưa thanh toán"}</strong></p>
              </div>

              <div style={{ padding: "1.3rem", borderRadius: "22px", border: "1px solid rgba(255,143,31,0.12)", background: "rgba(255,255,255,0.82)" }}>
                <h2 style={{ marginTop: 0, color: "#162033" }}>💰 Tổng kết</h2>
                <div style={{ display: "grid", gap: "0.65rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}><span>Tạm tính</span><strong>{formatVND(order.subtotal)}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}><span>Phí vận chuyển</span><strong>{formatVND(order.shippingFee)}</strong></div>
                  {order.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", color: "#ff6b9d" }}><span>Giảm giá {order.couponCode && `(${order.couponCode})`}</span><strong>-{formatVND(order.discount)}</strong></div>}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", paddingTop: "0.45rem", borderTop: "1px solid rgba(255,143,31,0.12)" }}><span><strong>Tổng thanh toán</strong></span><strong style={{ color: "#162033", fontSize: "1.08rem" }}>{formatVND((order as any).totalPrice ?? order.total)}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
