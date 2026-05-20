import { NextResponse } from "next/server";
import {
  getAllPrebuiltPCs,
  addPrebuiltPC,
  deletePrebuiltPC,
  updatePrebuiltPC
} from "@/lib/productStore";
import type { PrebuiltPC } from "@/types/product.type";

export const GET = async () => {
  return NextResponse.json({ builds: getAllPrebuiltPCs() });
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    if (!body.name || !body.purpose || !body.price || !body.components) {
      return NextResponse.json(
        { error: "Thiếu trường bắt buộc: name, purpose, price, components" },
        { status: 400 }
      );
    }
    const pc = addPrebuiltPC({
      ...body,
      id: body.id || `build-${Date.now()}`,
      image: body.image ?? "/images/builds/default.jpg",
      rating: body.rating ?? 0,
      description: body.description ?? ""
    });
    return NextResponse.json({ message: "Đã thêm bộ PC", build: pc });
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
};

export const PUT = async (request: Request) => {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }
    const updated = updatePrebuiltPC(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Bộ PC không tồn tại" }, { status: 404 });
    }
    return NextResponse.json({ message: "Cập nhật thành công", build: updated });
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
  const success = deletePrebuiltPC(id);
  if (!success) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json({ message: "Đã xóa bộ PC" });
};
