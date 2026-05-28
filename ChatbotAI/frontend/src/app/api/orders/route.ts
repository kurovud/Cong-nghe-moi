import { NextResponse } from "next/server";
import { serverFetch } from "@/services/http";
import {
  createOrder,
  getAllCoupons,
  getAllOrders,
  getOrderById,
  getOrderStats,
  getOrdersByUser,
  updateOrderStatus,
  updatePaymentStatus,
  validateCoupon,
  calcShippingFee,
} from "@/lib/orderStore";

function authHeaders(request: Request, token?: string): Record<string, string> {
  const headerToken = request.headers.get("authorization");
  if (headerToken?.startsWith("Bearer ")) {
    return { Authorization: headerToken };
  }
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { action, token } = body;
    const headers = authHeaders(request, token);

    const localUserId = String(body.userId || body.user?.id || "guest");

    const buildLocalOrderResponse = (order: any) => NextResponse.json(order);

    /* ── Create order ── */
    if (action === "create") {
      try {
        const response = await serverFetch<any>("/api/orders", {
          method: "POST",
          headers,
          body: JSON.stringify({
            items: body.items,
            shippingAddress: body.shippingAddress,
            paymentMethod: body.paymentMethod,
            couponCode: body.couponCode,
            note: body.note,
          }),
        });
        return NextResponse.json(response?.data ?? response);
      } catch {
        const subtotal = Number(body.subtotal || 0);
        const shippingFee = Number.isFinite(Number(body.shippingFee)) ? Number(body.shippingFee) : calcShippingFee(body.shippingAddress);
        const discount = Number(body.discount || 0);
        const order = createOrder({
          userId: localUserId,
          items: body.items || [],
          shippingAddress: body.shippingAddress,
          paymentMethod: body.paymentMethod,
          subtotal,
          shippingFee,
          discount,
          couponCode: body.couponCode,
          note: body.note,
        });
        return buildLocalOrderResponse(order);
      }
    }

    /* ── Get user orders ── */
    if (action === "list") {
      try {
        const response = await serverFetch<any>("/api/orders", {
          method: "GET",
          headers,
        });
        return NextResponse.json({ orders: response?.data ?? [] });
      } catch {
        const orders = getOrdersByUser(localUserId);
        return NextResponse.json({ orders });
      }
    }

    /* ── Get single order ── */
    if (action === "get") {
      try {
        const response = await serverFetch<any>(`/api/orders/${body.orderId}`, {
          method: "GET",
          headers,
        });
        const order = response?.data;
        if (!order)
          return NextResponse.json(
            { error: "Không tìm thấy đơn hàng" },
            { status: 404 }
          );
        return NextResponse.json(order);
      } catch {
        const order = getOrderById(String(body.orderId));
        if (!order) {
          return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
        }
        return NextResponse.json(order);
      }
    }

    /* ── Update status (admin) ── */
    if (action === "update_status") {
      try {
        const response = await serverFetch<any>(`/api/orders/${body.orderId}/status`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ status: body.status, paymentStatus: body.paymentStatus, note: body.note }),
        });
        const order = response?.data;
        if (!order)
          return NextResponse.json(
            { error: "Không tìm thấy đơn hàng" },
            { status: 404 }
          );
        return NextResponse.json(order);
      } catch {
        const order = updateOrderStatus(String(body.orderId), String(body.status).toLowerCase() as any, body.note);
        if (!order) return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
        if (body.paymentStatus) updatePaymentStatus(String(body.orderId), String(body.paymentStatus).toLowerCase() as any);
        return NextResponse.json(order);
      }
    }

    if (action === "delete") {
      try {
        await serverFetch<any>(`/api/orders/${body.orderId}`, {
          method: "DELETE",
          headers,
        });
        return NextResponse.json({ success: true });
      } catch {
        return NextResponse.json({ success: true, source: "local-fallback" });
      }
    }

    /* ── Validate coupon ── */
    if (action === "validate_coupon") {
      try {
        const result = await serverFetch<any>("/api/coupons/validate", {
          method: "POST",
          headers,
          body: JSON.stringify({ code: body.code, subtotal: body.subtotal }),
        });
        return NextResponse.json(result?.data ?? result);
      } catch {
        return NextResponse.json(validateCoupon(String(body.code || ""), Number(body.subtotal || 0)));
      }
    }

    /* ── Calculate shipping ── */
    if (action === "calc_shipping") {
      const subtotal = Number(body.subtotal || 0);
      const fee = subtotal >= 2_000_000 ? 0 : 30_000;
      return NextResponse.json({ fee });
    }

    /* ── Stats ── */
    if (action === "stats") {
      try {
        const result = await serverFetch<any>("/api/orders/stats", {
          method: "GET",
          headers,
        });
        return NextResponse.json(result?.data ?? result);
      } catch {
        return NextResponse.json(getOrderStats());
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};
