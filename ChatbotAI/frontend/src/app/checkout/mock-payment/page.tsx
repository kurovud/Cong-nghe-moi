"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderApi } from "@/services/conference.api";

export default function MockPaymentPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [method, setMethod] = useState<string>("unknown");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("orderId") || undefined);
    setMethod(params.get("method") || "unknown");
  }, []);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!orderId) {
    return <div className="container section"><h2>Yêu cầu không hợp lệ</h2><p>Không tìm thấy mã đơn hàng.</p></div>;
  }

  const simulateSuccess = async () => {
    setProcessing(true);
    try {
      // On success, mark order as confirmed (backend should also set payment status when integrated)
      await orderApi.updateOrderStatus(orderId, { status: "confirmed", paymentStatus: "paid" });
      setMessage("Thanh toán thành công. Chuyển đến trang đơn hàng...");
      setTimeout(() => router.push(`/account/orders/${orderId}`), 1200);
    } catch (err: any) {
      setMessage(err?.message || "Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setProcessing(false);
    }
  };

  const simulateFailure = () => {
    setMessage("Giao dịch bị huỷ (mô phỏng). Vui lòng thử lại hoặc chọn phương thức khác.");
  };

  return (
    <div className="container section">
      <h1>Mô phỏng cổng thanh toán — {method}</h1>
      <p>Đơn hàng: <strong>{orderId}</strong></p>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button type="button" className="button btn--primary" onClick={simulateSuccess} disabled={processing}>Thanh toán thành công (mô phỏng)</button>
        <button type="button" className="button" onClick={simulateFailure} disabled={processing}>Huỷ giao dịch (mô phỏng)</button>
      </div>
      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </div>
  );
}
