import { NextResponse } from "next/server";
import { serverFetch } from "@/services/http";

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

    /* ── Create order ── */
    if (action === "create") {
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
    }

    /* ── Get user orders ── */
    if (action === "list") {
      const response = await serverFetch<any>("/api/orders", {
        method: "GET",
        headers,
      });
      return NextResponse.json({ orders: response?.data ?? [] });
    }

    /* ── Get single order ── */
    if (action === "get") {
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
    }

    /* ── Update status (admin) ── */
    if (action === "update_status") {
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
    }

    if (action === "delete") {
      await serverFetch<any>(`/api/orders/${body.orderId}`, {
        method: "DELETE",
        headers,
      });
      return NextResponse.json({ success: true });
    }

    /* ── Validate coupon ── */
    if (action === "validate_coupon") {
      const result = await serverFetch<any>("/api/coupons/validate", {
        method: "POST",
        headers,
        body: JSON.stringify({ code: body.code, subtotal: body.subtotal }),
      });
      return NextResponse.json(result?.data ?? result);
    }

    /* ── Calculate shipping ── */
    if (action === "calc_shipping") {
      const subtotal = Number(body.subtotal || 0);
      const fee = subtotal >= 2_000_000 ? 0 : 30_000;
      return NextResponse.json({ fee });
    }

    /* ── Stats ── */
    if (action === "stats") {
      const result = await serverFetch<any>("/api/orders/stats", {
        method: "GET",
        headers,
      });
      return NextResponse.json(result?.data ?? result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};
