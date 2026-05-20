import { NextResponse } from "next/server";
import { getAuthHeaders } from "@/lib/auth";
import { serverFetch } from "@/services/http";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const response = await serverFetch<any>("/api/products", {
      method: "GET",
      params: {
        page: Number(searchParams.get("page") ?? "1"),
        limit: Number(searchParams.get("limit") ?? "50"),
        category: searchParams.get("category") || undefined,
        q: searchParams.get("q") || undefined,
      },
      headers: getAuthHeaders(request),
    });

    return NextResponse.json({
      products: response?.data ?? [],
      ...(response?.pagination ?? {}),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không tải được danh sách sản phẩm" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const headers = getAuthHeaders(request);
    const items = Array.isArray(body) ? body : [body];

    const created: any[] = [];
    for (const item of items) {
      const response = await serverFetch<any>("/api/products", {
        method: "POST",
        headers,
        body: JSON.stringify(item),
      });
      if (response?.data) created.push(response.data);
    }

    return NextResponse.json({
      message: `Đã thêm ${created.length} sản phẩm`,
      products: created,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Dữ liệu không hợp lệ" }, { status: 400 });
  }
};
