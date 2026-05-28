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

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: 'rgba(249,115,22,0.1)', color: 'var(--orange)', border: 'rgba(249,115,22,0.25)' },
  confirmed: { bg: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: 'rgba(0,212,255,0.25)' },
  processing: { bg: 'rgba(168,85,247,0.1)', color: 'var(--purple)', border: 'rgba(168,85,247,0.25)' },
  shipping: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
  delivered: { bg: 'rgba(16,185,129,0.1)', color: 'var(--green)', border: 'rgba(16,185,129,0.25)' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: 'rgba(239,68,68,0.25)' },
};

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

  const statCards = [
    { icon: '📊', value: stats.totalOrders, label: 'Tổng đơn', gradient: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))' },
    { icon: '⏳', value: stats.pendingOrders, label: 'Chờ xử lý', gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))' },
    { icon: '✅', value: stats.completedOrders, label: 'Hoàn thành', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))' },
    { icon: '💰', value: formatVND(stats.totalRevenue), label: 'Doanh thu', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 0.35rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>📦 Quản lý đơn hàng</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', margin: 0 }}>Theo dõi và quản lý tất cả đơn hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: s.gradient,
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s var(--ease)',
          }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>{s.icon}</span>
            <strong style={{
              display: 'block',
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text)',
              marginBottom: '0.25rem',
            }}>{s.value}</strong>
            <span style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Chưa có đơn hàng nào</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Đơn hàng mới sẽ xuất hiện tại đây</p>
        </div>
      ) : (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-2)' }}>
                  {['Mã đơn', 'Khách hàng', 'SP', 'Tổng tiền', 'Thanh toán', 'Trạng thái', 'Ngày tạo', 'Hành động'].map(h => (
                    <th key={h} style={{
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      color: 'var(--text-3)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: 'var(--surface-2)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.2s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ color: 'var(--cyan)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{order.id}</strong>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div>
                        <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{order.shippingAddress.fullName}</span>
                        <span style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>{order.shippingAddress.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        background: 'var(--surface-2)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--r-sm)',
                        color: 'var(--text)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}>{order.items.length}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{formatVND(order.total)}</strong>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--r-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: order.paymentStatus === "paid" ? 'rgba(16,185,129,0.1)' : 'rgba(249,115,22,0.1)',
                        color: order.paymentStatus === "paid" ? 'var(--green)' : 'var(--orange)',
                        border: `1px solid ${order.paymentStatus === "paid" ? 'rgba(16,185,129,0.25)' : 'rgba(249,115,22,0.25)'}`,
                      }}>
                        {order.paymentStatus === "paid" ? "✅ Đã TT" : "🕐 Chưa TT"}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          background: STATUS_COLORS[order.status]?.bg || 'var(--surface-2)',
                          color: STATUS_COLORS[order.status]?.color || 'var(--text)',
                          border: `1px solid ${STATUS_COLORS[order.status]?.border || 'var(--border)'}`,
                          borderRadius: 'var(--r-sm)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                          fontFamily: 'var(--font)',
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-2)', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <a
                          href={`/account/orders/${order.id}`}
                          target="_blank"
                          aria-label={`Xem đơn ${order.id}`}
                          style={{
                            width: 34,
                            height: 34,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--r-sm)',
                            background: 'rgba(0,212,255,0.1)',
                            border: '1px solid rgba(0,212,255,0.2)',
                            color: 'var(--cyan)',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.2)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
                        >👁️</a>
                        <button
                          type="button"
                          aria-label={`Xóa đơn ${order.id}`}
                          onClick={() => deleteOrder(order.id)}
                          style={{
                            width: 34,
                            height: 34,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--r-sm)',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: 'var(--red)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '1rem 1.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--r)',
          color: 'var(--text)',
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease',
        }}>{toast}</div>
      )}
    </div>
  );
}
