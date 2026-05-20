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
    const { action, token, productId } = body;
    const headers = authHeaders(request, token);

    if (action === "get") {
      const data = await serverFetch<any>("/api/wishlist", { method: "GET", headers });
      const items = data?.data ?? [];
      return NextResponse.json({ items, wishlist: items });
    }

    if (action === "add") {
      await serverFetch<any>("/api/wishlist", {
        method: "POST",
        headers,
        body: JSON.stringify({ productId }),
      });
      const data = await serverFetch<any>("/api/wishlist", { method: "GET", headers });
      const items = data?.data ?? [];
      return NextResponse.json({ items, wishlist: items });
    }

    if (action === "remove") {
      await serverFetch<any>(`/api/wishlist/${productId}`, {
        method: "DELETE",
        headers,
      });
      const data = await serverFetch<any>("/api/wishlist", { method: "GET", headers });
      const items = data?.data ?? [];
      return NextResponse.json({ items, wishlist: items });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};
