"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Order } from "@/types/order.type";
import { orderApi } from "@/services/conference.api";
import { getAllProducts, getAllPrebuiltPCs } from "@/lib/productStore";
import { resolveProductImage } from "@/lib/product-image";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "#f59e0b" },
  confirmed: { label: "Đã xác nhận", color: "#3b82f6" },
  processing: { label: "Đang chuẩn bị", color: "#8b5cf6" },
  shipping: { label: "Đang giao", color: "#06b6d4" },
  delivered: { label: "Hoàn thành", color: "#10b981" },
  cancelled: { label: "Đã hủy", color: "#ef4444" },
  returned: { label: "Đã trả", color: "#6b7280" },
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

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    orderApi.getMyOrders({ page: 1, limit: 50 })
      .then((data) => { setOrders(data.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="container section"><p>Vui lòng <Link href="/login">đăng nhập</Link>.</p></div>;

  const hydratedOrders = orders.map((order: any) => ({
    ...order,
    items: (order.items ?? []).map(resolveOrderItem),
  }));

  const totalRevenue = hydratedOrders.reduce((sum, order: any) => sum + Number(order.totalPrice ?? order.total ?? 0), 0);
  const pendingCount = hydratedOrders.filter((order) => String(order.status || '').toLowerCase() === 'pending').length;
  const completedCount = hydratedOrders.filter((order) => String(order.status || '').toLowerCase() === 'delivered').length;

  return (
    <div className="account-page order-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link><span className="breadcrumb__sep">/</span>
          <Link href="/account">Tài khoản</Link><span className="breadcrumb__sep">/</span>
          <span>Đơn hàng</span>
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
                🧾 Lịch sử mua hàng
              </span>
              <h1 style={{ margin: "0.6rem 0 0", color: "#162033", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                Đơn hàng của tôi
              </h1>
              <p style={{ margin: "0.45rem 0 0", color: "#4a5568", lineHeight: 1.6, maxWidth: 780 }}>
                Theo dõi trạng thái, xem nhanh các đơn gần nhất và mở chi tiết trong giao diện gọn, sáng và dễ đọc hơn.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "0.8rem",
              }}
            >
              {[
                { label: "Tổng đơn", value: orders.length },
                { label: "Chờ xử lý", value: pendingCount },
                { label: "Hoàn thành", value: completedCount },
                { label: "Tổng giá trị", value: formatVND(totalRevenue) },
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
              <Link href="/products" className="button btn-sm">🛍️ Tiếp tục mua</Link>
              <Link href="/builds" className="button btn-sm">🎮 Xem build sẵn</Link>
              <Link href="/services" className="button btn-sm">🛠️ Đặt dịch vụ</Link>
            </div>
          </div>

          {loading ? (
            <div className="products-loading"><div className="spinner" /><p>Đang tải…</p></div>
          ) : hydratedOrders.length === 0 ? (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                gap: "0.9rem",
                minHeight: 320,
                textAlign: "center",
                padding: "1.5rem",
                borderRadius: "20px",
                border: "1px dashed rgba(255,143,31,0.18)",
                background: "linear-gradient(135deg, rgba(255,250,252,0.9), rgba(247,251,255,0.92))",
              }}
            >
              <div style={{ fontSize: "3rem" }}>📦</div>
              <h2 style={{ margin: 0, color: "#162033" }}>Chưa có đơn hàng nào</h2>
              <p style={{ margin: 0, color: "#4a5568", maxWidth: 520 }}>
                Hãy chọn một sản phẩm, một build sẵn hoặc dịch vụ để bắt đầu đặt hàng.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/products" className="button hero__btn-primary">🛍️ Mua hàng</Link>
                <Link href="/builds" className="button btn-sm">🎮 Xem build sẵn</Link>
                <Link href="/services" className="button btn-sm">🛠️ Xem dịch vụ</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {hydratedOrders.map((order: any) => {
                const statusKey = String(order.status || "").toLowerCase();
                const st = STATUS_LABELS[statusKey] ?? { label: order.status || "Không rõ", color: "#888" };
                const firstItems = (order.items || []).slice(0, 3);
                return (
                  <Link
                    href={`/account/orders/${order.id}`}
                    key={order.id}
                    style={{
                      display: "grid",
                      gap: "1rem",
                      padding: "1rem",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,143,31,0.12)",
                      background: "rgba(255,255,255,0.82)",
                      boxShadow: "0 10px 28px rgba(18,32,51,0.06)",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <span style={{ color: "#7c8fa6", fontWeight: 700, fontSize: "0.86rem" }}>Mã đơn</span>
                        <h3 style={{ margin: "0.2rem 0 0", color: "#162033", fontSize: "1.05rem" }}>{order.id}</h3>
                      </div>
                      <span style={{ background: st.color, color: "#fff", padding: "0.45rem 0.8rem", borderRadius: 999, fontWeight: 700 }}>
                        {st.label}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "1rem", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                        {firstItems.map((item: any) => (
                          <div key={item.productId} style={{ width: 70, height: 70, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,143,31,0.10)", background: "linear-gradient(135deg, rgba(255,179,193,0.12), rgba(183,216,255,0.12))" }}>
                            <img src={item.image} alt={item.name} title={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div style={{ width: 70, height: 70, borderRadius: 14, display: "grid", placeItems: "center", border: "1px dashed rgba(255,143,31,0.18)", color: "#162033", fontWeight: 700, background: "rgba(255,255,255,0.76)" }}>
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "grid", justifyItems: "end", gap: "0.3rem", color: "#4a5568" }}>
                        <span>{order.items.length} sản phẩm</span>
                        <span>{order.shippingAddress.fullName}</span>
                        <strong style={{ color: "#162033", fontSize: "1.1rem" }}>{formatVND(order.totalPrice ?? order.total ?? 0)}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", color: "#7c8fa6", fontSize: "0.92rem" }}>
                      <span>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                      <span style={{ color: "#ff6b9d", fontWeight: 700 }}>Xem chi tiết →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
