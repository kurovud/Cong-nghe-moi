"use client";

import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/types/order.type";
import { orderApi } from "@/services/conference.api";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Xác nhận" },
  { value: "processing", label: "Đang chuẩn bị" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Hoàn thành" },
  { value: "cancelled", label: "Hủy đơn" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const res = await orderApi.getAllOrders();
      const statsRes = await orderApi.getOrderStats();
      setOrders(res?.data ?? []);
      const raw = statsRes?.data ?? statsRes ?? {};
      const totalRevenue = Number(raw.totalRevenue ?? raw.total ?? 0);
      const totalOrders = Number(raw.totalOrders ?? raw.count ?? 0);
      const pendingOrders = Number(raw.pendingOrders ?? (raw.byStatus && (raw.byStatus.pending || raw.byStatus.PENDING)) ?? 0);
      const completedOrders = Number(raw.completedOrders ?? (raw.byStatus && (raw.byStatus.delivered || raw.byStatus.DELIVERED)) ?? 0);
      setStats({ totalRevenue, totalOrders, pendingOrders, completedOrders });
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    // optimistic UI update
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await orderApi.updateOrderStatus(orderId, { status });
      showToast(`Cập nhật trạng thái đơn ${orderId} → ${status}`);
      // try refresh stats only
      const statsRes = await orderApi.getOrderStats();
      setStats(statsRes?.data ?? statsRes ?? stats);
    } catch (err: any) {
      console.error("Failed to update status", err);
      showToast(err?.message || "Cập nhật trạng thái thất bại");
      // rollback
      fetchAll();
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm(`Xóa đơn hàng ${orderId}?`)) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : undefined;
    await fetch("/api/orders", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: "delete", orderId, token }),
    });
    fetchAll();
  };

  return (
    <div>
      <h1>📦 Quản lý đơn hàng</h1>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: "2rem" }}>
        <div className="stat-card"><span className="stat-card__icon">📊</span><strong>{stats.totalOrders}</strong><span>Tổng đơn</span></div>
        <div className="stat-card"><span className="stat-card__icon">⏳</span><strong>{stats.pendingOrders}</strong><span>Chờ xử lý</span></div>
        <div className="stat-card"><span className="stat-card__icon">✅</span><strong>{stats.completedOrders}</strong><span>Hoàn thành</span></div>
        <div className="stat-card"><span className="stat-card__icon">💰</span><strong>{formatVND(stats.totalRevenue)}</strong><span>Doanh thu</span></div>
      </div>

      {loading ? (
        <div className="products-loading"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <p className="text-muted">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SP</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.shippingAddress.fullName}<br /><small className="text-muted">{order.shippingAddress.phone}</small></td>
                  <td>{order.items.length}</td>
                  <td><strong>{formatVND(order.total)}</strong></td>
                  <td>{order.paymentStatus === "paid" ? "✅ Đã TT" : "🕐 Chưa TT"}</td>
                  <td>
                    <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)} className="admin-select">
                      {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <a href={`/account/orders/${order.id}`} target="_blank" className="button btn-sm" aria-label={`Xem đơn ${order.id}`}>👁️</a>
                      <button type="button" className="button btn-sm btn--danger" aria-label={`Xóa đơn ${order.id}`} onClick={() => deleteOrder(order.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
