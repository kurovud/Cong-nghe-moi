"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderApi, paymentApi } from "@/services/conference.api";
import type { Order } from "@/types/order.type";

const METHOD_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  bank_transfer: { label: "Chuyển khoản ngân hàng", icon: "🏦", color: "var(--cyan)" },
  momo: { label: "Ví MoMo", icon: "📱", color: "#d63384" },
  zalopay: { label: "Ví ZaloPay", icon: "💳", color: "#0068ff" },
  credit_card: { label: "Thẻ tín dụng / Ghi nợ", icon: "💳", color: "var(--purple)" },
  unknown: { label: "Thanh toán online", icon: "💰", color: "var(--cyan)" },
};

const buildFallbackQrUrl = (orderId: string, method: string, amount: number) => {
  const payload = encodeURIComponent(JSON.stringify({ orderId, method, amount }));
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${payload}`;
};

export default function MockPaymentPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [method, setMethod] = useState<string>("unknown");
  const [order, setOrder] = useState<Order | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const waitForPaidSync = async (targetOrderId: string) => {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const refreshed = await orderApi.getOrderById(targetOrderId);
      const current = refreshed?.data;
      if (current && String(current.paymentStatus || '').toLowerCase() === 'paid') {
        setOrder(current);
        return true;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 750));
    }
    return false;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("orderId"));
    setMethod(params.get("method") || "unknown");
    const nextAmount = Number(params.get("amount") || 0);
    setAmount(Number.isFinite(nextAmount) ? nextAmount : 0);
  }, []);

  const pm = METHOD_LABELS[method] ?? METHOD_LABELS.unknown;

  const currency = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + '₫';

  const orderItems = order?.items ?? [];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + Number((item.discountPrice ?? item.price) * item.quantity || 0),
    0
  );
  const shippingFee = Number(order?.shippingFee ?? 0);
  const discount = Number(order?.discount ?? 0);
  const total = Number(order?.total ?? amount ?? 0);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    const loadPayment = async () => {
      setLoading(true);

      try {
        const response = await orderApi.getOrderById(orderId);
        const currentOrder = response?.data ?? null;
        if (cancelled) return;

        setOrder(currentOrder);

        const total = Number(currentOrder?.total ?? amount ?? 0);
        const paymentResp = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ amount: total, currency: "VND", method }),
        });
        const paymentJson = await paymentResp.json().catch(() => ({}));

        if (cancelled) return;
        setPaymentId(paymentJson?.payment?.id ?? orderId);
        setQrUrl(paymentJson?.qrUrl ?? buildFallbackQrUrl(orderId, method, total));
      } catch (err: any) {
        if (cancelled) return;
        const fallbackAmount = Number(amount || 0);
        setOrder(null);
        setPaymentId(orderId);
        setQrUrl(buildFallbackQrUrl(orderId, method, fallbackAmount));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPayment();

    return () => {
      cancelled = true;
    };
  }, [orderId, method, amount]);

  if (!orderId) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - var(--header-h))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>Yêu cầu không hợp lệ</h2>
          <p style={{ color: 'var(--text-2)' }}>Không tìm thấy mã đơn hàng.</p>
        </div>
      </div>
    );
  }

  const markPaid = async () => {
    setPaying(true);
    setPayError(null);
    try {
      await paymentApi.confirmPayment({
        orderId,
        method,
        amount: Number(order?.total ?? amount ?? 0),
        paymentId: paymentId ?? orderId,
      });

      // Best-effort invoice email generation; never block payment success.
      const invoiceResp = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId ?? orderId, to: order?.shippingAddress?.email }),
      }).catch(() => null);
      const invoiceJson = invoiceResp ? await invoiceResp.json().catch(() => null) : null;

      if (typeof window !== 'undefined') {
        const invoiceNumber = invoiceJson?.invoice?.id || `HD${String(Date.now()).slice(-4)}`;
        sessionStorage.setItem('recent_paid_order', JSON.stringify({
          orderId,
          invoiceNumber,
          at: Date.now(),
          order: {
            ...(order ?? {}),
            id: orderId,
            paymentStatus: 'paid',
            status: order?.status ?? 'confirmed',
          },
        }));
      }

      const synced = await waitForPaidSync(orderId);

      setPaid(true);

      setRedirecting(true);
      window.setTimeout(() => {
        router.replace(`/account/orders/${orderId}?payment=success`);
      }, 2500);
    } catch (error: any) {
      const message = String(error?.message || "");
      if (message.toLowerCase().includes('notfound') || message.toLowerCase().includes('not found')) {
        setPayError("Không tìm thấy cổng xác nhận. Hệ thống đang thử đồng bộ lại, vui lòng bấm lại sau 1-2 giây.");
      } else {
        setPayError(message || "Thanh toán chưa được đồng bộ, vui lòng thử lại");
      }
      setPaid(false);
      return;
    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - var(--header-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Background effects */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05), transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
      </div>

      <div style={{
        position: 'relative', maxWidth: 480, width: '100%',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-2xl)', padding: '2.5rem',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
      }}>
        {/* Payment icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.5rem',
          background: `${pm.color}15`, border: `2px solid ${pm.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', boxShadow: `0 0 24px ${pm.color}20`,
        }}>
          {pm.icon}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem',
          color: 'var(--text)', textAlign: 'center', marginBottom: '0.4rem',
          letterSpacing: '-0.02em',
        }}>
          Cổng thanh toán
        </h1>
        <p style={{ textAlign: 'center', color: pm.color, fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {pm.label}
        </p>

        {/* Order info */}
        <div style={{
          padding: '1rem', borderRadius: 'var(--r)', marginBottom: '1.5rem',
          background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>Mã đơn hàng</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--cyan)', fontSize: '0.85rem' }}>{orderId}</span>
        </div>

        <div style={{
          padding: '1rem', borderRadius: 'var(--r)', marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          display: 'grid', gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>Tổng thanh toán</span>
            <strong style={{ color: 'var(--text)' }}>{new Intl.NumberFormat('vi-VN').format(Number(order?.total ?? amount ?? 0))}₫</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>Trạng thái đơn</span>
            <strong style={{ color: order?.paymentStatus === 'paid' ? 'var(--green)' : 'var(--text)' }}>{order?.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}</strong>
          </div>
        </div>

        {/* Dev notice */}
        <div style={{
          padding: '0.75rem', borderRadius: 'var(--r)', marginBottom: '1.5rem',
          background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)',
          fontSize: '0.78rem', color: 'var(--orange)', textAlign: 'center', lineHeight: 1.6,
        }}>
          ⚠️ Đây là QR thanh toán. Vui lòng thanh toán trong ứng dụng MoMo và chờ hệ thống/cổng thanh toán xác nhận.
        </div>

        {loading ? (
          <div style={{ padding: '1.5rem', borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: 22, height: 22, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--cyan)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
            <div style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Đang tạo mã QR thanh toán...</div>
          </div>
        ) : (
          <>
            <div style={{
              padding: '1.2rem', borderRadius: 'var(--r-lg)',
              background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)',
              textAlign: 'center', marginBottom: '1rem',
            }}>
              <p style={{ margin: '0 0 0.75rem', color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Quét QR bên dưới để thanh toán bằng {pm.label.toLowerCase()}.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Payment" style={{ width: 220, height: 220, borderRadius: 16, border: '1px solid var(--border)', background: '#fff', display: 'block' }} />
                ) : (
                  <div style={{ width: 220, height: 220, borderRadius: 16, border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>
                    Đang tạo QR...
                  </div>
                )}
              </div>
            </div>

            <div style={{
              padding: '1rem', borderRadius: 'var(--r-lg)',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              textAlign: 'center', color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.6,
            }}>
              Đây là màn giả lập. Khi bấm nút thanh toán thành công, hệ thống sẽ hiển thị phiếu đơn mua để kiểm tra luồng sau thanh toán.
            </div>

            {!paid ? (
              <button
                type="button"
                onClick={markPaid}
                disabled={paying}
                style={{
                  width: '100%', marginTop: '0.75rem', padding: '0.95rem', borderRadius: 'var(--r)',
                  background: 'linear-gradient(135deg, #10b981, #22c55e)', color: '#fff', fontWeight: 800,
                  fontSize: '0.92rem', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.25s',
                  boxShadow: '0 10px 24px rgba(16,185,129,0.22)',
                  opacity: paying ? 0.75 : 1,
                }}
              >
                {paying ? "Đang xác nhận thanh toán..." : "✅ Thanh toán thành công"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push(`/account/orders/${orderId}`)}
                style={{
                  width: '100%', marginTop: '0.75rem', padding: '0.9rem', borderRadius: 'var(--r)',
                  background: 'var(--grad-brand)', color: '#fff', fontWeight: 700,
                  fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.25s',
                }}
              >
                {redirecting ? "Đang chuyển sang trang đơn hàng..." : "Xem trạng thái đơn hàng"}
              </button>
            )}

            {paid && (
              <div style={{
                marginTop: '1rem',
                padding: '1.1rem',
                borderRadius: '18px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(16,185,129,0.06))',
                border: '1px solid rgba(16,185,129,0.22)',
                boxShadow: '0 20px 40px rgba(16,185,129,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.9rem', borderBottom: '1px dashed rgba(16,185,129,0.25)' }}>
                  <div>
                    <div style={{ color: 'var(--green)', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '0.04em' }}>HÓA ĐƠN THANH TOÁN</div>
                    <div style={{ color: 'var(--text-2)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Phiếu đơn mua hàng điện tử</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--green)', fontWeight: 800 }}>Đã thanh toán thành công</div>
                    <div style={{ color: 'var(--text-2)', fontSize: '0.8rem' }}>{new Date().toLocaleString('vi-VN')}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Mã đơn</span>
                    <strong style={{ color: 'var(--text)' }}>{orderId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Phương thức</span>
                    <strong style={{ color: 'var(--text)' }}>{pm.label}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Tổng tiền</span>
                    <strong style={{ color: 'var(--text)' }}>{currency(Number(order?.total ?? amount ?? 0))}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Mã thanh toán</span>
                    <strong style={{ color: 'var(--text)' }}>{paymentId ?? orderId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-2)' }}>Trạng thái</span>
                    <strong style={{ color: 'var(--green)' }}>Đã thanh toán thành công</strong>
                  </div>
                </div>

                {orderItems.length ? (
                  <div style={{ marginTop: '0.9rem', overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 110px', gap: '0.75rem', padding: '0.8rem 0.9rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-2)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span>Sản phẩm</span>
                      <span style={{ textAlign: 'right' }}>SL</span>
                      <span style={{ textAlign: 'right' }}>Thành tiền</span>
                    </div>
                    <div style={{ display: 'grid' }}>
                      {orderItems.map((item) => (
                        <div key={item.productId} style={{ display: 'grid', gridTemplateColumns: '1fr 72px 110px', gap: '0.75rem', padding: '0.8rem 0.9rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.84rem', alignItems: 'center' }}>
                          <div style={{ color: 'var(--text)' }}>{item.name}</div>
                          <div style={{ textAlign: 'right', color: 'var(--text-2)' }}>x{item.quantity}</div>
                          <strong style={{ textAlign: 'right', color: 'var(--text)' }}>{currency((item.discountPrice ?? item.price) * item.quantity)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(16,185,129,0.25)' }}>
                  <div style={{ display: 'grid', gap: '0.55rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: 'var(--text-2)' }}>Tạm tính</span>
                      <strong style={{ color: 'var(--text)' }}>{currency(subtotal)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: 'var(--text-2)' }}>Phí vận chuyển</span>
                      <strong style={{ color: 'var(--text)' }}>{currency(shippingFee)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: 'var(--text-2)' }}>Giảm giá</span>
                      <strong style={{ color: 'var(--text)' }}>-{currency(discount)}</strong>
                    </div>
                    <div style={{ height: 1, background: 'rgba(16,185,129,0.18)', margin: '0.2rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '1rem' }}>
                      <span style={{ color: 'var(--green)', fontWeight: 800 }}>Tổng cộng</span>
                      <strong style={{ color: 'var(--green)', fontSize: '1.05rem' }}>{currency(total)}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.9rem', padding: '0.85rem', borderRadius: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.16)', color: 'var(--text-2)', fontSize: '0.84rem', lineHeight: 1.6 }}>
                    Đơn hàng đã thanh toán thành công và đang được chuyển sang trạng thái xử lý, chuẩn bị hàng và giao hàng.
                  </div>
                </div>
              </div>
            )}

            {payError && (
              <div style={{
                marginTop: '0.85rem',
                padding: '0.75rem 0.9rem',
                borderRadius: 'var(--r)',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.22)',
                color: '#ef4444',
                fontSize: '0.84rem',
                textAlign: 'center',
              }}>
                {payError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
