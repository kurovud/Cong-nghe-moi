import { NextResponse } from "next/server";
import { getAuthHeaders } from "@/lib/auth";
import { serverFetch } from "@/services/http";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Chi tiết 1 sản phẩm
export const GET = async (_request: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const response = await serverFetch<any>(`/api/products/${id}`, { method: "GET" });
    return NextResponse.json({ product: response?.data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Sản phẩm không tồn tại" }, { status: 404 });
  }
};

// PUT: Cập nhật sản phẩm
export const PUT = async (request: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await serverFetch<any>(`/api/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(request),
      body: JSON.stringify(body),
    });
    return NextResponse.json({ message: "Cập nhật thành công", product: response?.data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Dữ liệu không hợp lệ" }, { status: 400 });
  }
};

// DELETE: Xóa sản phẩm
export const DELETE = async (request: Request, { params }: RouteParams) => {
  try {
    const { id } = await params;
    await serverFetch<any>(`/api/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(request),
    });
    return NextResponse.json({ message: "Đã xóa sản phẩm" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Sản phẩm không tồn tại" }, { status: 404 });
  }
};
