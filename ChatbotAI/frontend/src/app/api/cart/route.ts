import { NextResponse } from "next/server";
import { serverFetch } from "@/services/http";

async function authHeaders(request: Request, token?: string): Promise<Record<string, string>> {
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
    const headers = await authHeaders(request, token);

    const cartRes = await serverFetch<any>("/api/cart", {
      method: "GET",
      headers,
    });
    const currentItems = cartRes?.data ?? [];

    if (action === "get") {
      return NextResponse.json({
        items: currentItems,
        totalItems: currentItems.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0),
        totalPrice: currentItems.reduce((sum: number, item: any) => sum + Number(item.discountPrice ?? item.price ?? 0) * Number(item.quantity || 0), 0),
        discountTotal: currentItems.reduce((sum: number, item: any) => sum + (item.discountPrice ? (Number(item.price) - Number(item.discountPrice)) * Number(item.quantity || 0) : 0), 0),
      });
    }

    if (action === "update") {
      const nextItems = currentItems
        .map((item: any) => item.productId === body.productId ? { ...item, quantity: body.quantity } : item)
        .filter((item: any) => Number(item.quantity) > 0);
      const updated = await serverFetch<any>("/api/cart", {
        method: "PUT",
        headers,
        body: JSON.stringify({ items: nextItems }),
      });
      return NextResponse.json(updated?.data ?? []);
    }

    if (action === "remove") {
      const nextItems = currentItems.filter((item: any) => item.productId !== body.productId);
      const updated = await serverFetch<any>("/api/cart", {
        method: "PUT",
        headers,
        body: JSON.stringify({ items: nextItems }),
      });
      return NextResponse.json(updated?.data ?? []);
    }

    if (action === "add") {
      const qty = Number(body.quantity || 1);
      const existing = currentItems.find((item: any) => item.productId === body.productId);
      const nextItems = existing
        ? currentItems.map((item: any) => item.productId === body.productId ? { ...item, quantity: Number(item.quantity || 0) + qty } : item)
        : [...currentItems, { productId: body.productId, quantity: qty }];
      const updated = await serverFetch<any>("/api/cart", {
        method: "PUT",
        headers,
        body: JSON.stringify({ items: nextItems }),
      });
      return NextResponse.json(updated?.data ?? []);
    }

    if (action === "clear") {
      await serverFetch<any>("/api/cart", {
        method: "DELETE",
        headers,
      });
      return NextResponse.json({ items: [], totalItems: 0, totalPrice: 0, discountTotal: 0 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};
