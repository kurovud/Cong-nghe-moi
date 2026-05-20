import { NextResponse } from "next/server";
import { getAuthHeaders } from "@/lib/auth";
import { serverFetch } from "@/services/http";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const response = await serverFetch<any>("/api/users", {
      method: "GET",
      headers: getAuthHeaders(request),
      params: {
        page: Number(searchParams.get("page") ?? "1"),
        limit: Number(searchParams.get("limit") ?? "20"),
        search: searchParams.get("search") || undefined,
      },
    });

    return NextResponse.json({
      users: response?.data ?? [],
      ...(response?.pagination ?? {}),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không tải được danh sách người dùng" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const response = await serverFetch<any>("/api/users", {
      method: "POST",
      headers: getAuthHeaders(request),
      body: JSON.stringify(body),
    });

    return NextResponse.json({ user: response?.data, message: response?.message || "Tạo tài khoản thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không thể tạo tài khoản" }, { status: 400 });
  }
};
