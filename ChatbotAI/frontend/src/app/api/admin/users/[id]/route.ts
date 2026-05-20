import { NextResponse } from "next/server";
import { getAuthHeaders } from "@/lib/auth";
import { serverFetch } from "@/services/http";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const PUT = async (request: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await serverFetch<any>(`/api/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(request),
      body: JSON.stringify(body),
    });

    return NextResponse.json({ user: response?.data, message: response?.message || "Cập nhật thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không thể cập nhật tài khoản" }, { status: 400 });
  }
};

export const DELETE = async (request: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;
    await serverFetch<any>(`/api/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(request),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không thể xóa tài khoản" }, { status: 400 });
  }
};
