import { NextResponse } from "next/server";
import { getFAQ, addFAQ, updateFAQ, deleteFAQ } from "@/lib/productStore";

export const GET = async () => {
  return NextResponse.json({ faq: getFAQ() });
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Hỗ trợ import hàng loạt
    const items = Array.isArray(body) ? body : [body];

    for (const item of items) {
      if (!item.question || !item.answer) {
        return NextResponse.json(
          { error: "Thiếu trường bắt buộc: question, answer" },
          { status: 400 }
        );
      }
      addFAQ({
        question: item.question,
        answer: item.answer,
        tags: item.tags ?? []
      });
    }

    return NextResponse.json({ message: `Đã thêm ${items.length} FAQ`, faq: getFAQ() });
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
};

export const PUT = async (request: Request) => {
  try {
    const body = await request.json();
    const { index, ...data } = body;
    if (index === undefined) {
      return NextResponse.json({ error: "Thiếu index" }, { status: 400 });
    }
    const updated = updateFAQ(index, data);
    if (!updated) {
      return NextResponse.json({ error: "FAQ không tồn tại" }, { status: 404 });
    }
    return NextResponse.json({ message: "Cập nhật thành công", faq: getFAQ() });
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const index = parseInt(searchParams.get("index") ?? "-1", 10);
  const success = deleteFAQ(index);
  if (!success) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json({ message: "Đã xóa FAQ", faq: getFAQ() });
};
