import { NextResponse } from "next/server";
import { normalizeProductImageList } from "@/lib/product-image";
import { assembleBuildByBudget } from "@/lib/assemblyEngine";
import { searchProducts, getPrebuiltByBudget } from "@/lib/productStore";

const API_GATEWAY =
  process.env.API_GATEWAY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

function normalizeMessage(input: string) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function extractBudget(message: string): number | undefined {
  const normalized = normalizeMessage(message);
  const range = normalized.match(/(\d+[\.,]?\d*)\s*[-–]\s*(\d+[\.,]?\d*)\s*(trieu|m|k|nghin)?/i);
  if (range) {
    const multiplier = /k|nghin/i.test(range[3] || "") ? 1_000 : /trieu|m/i.test(range[3] || "") ? 1_000_000 : 1;
    return Math.floor(((Number(range[1].replace(/\.|,/g, "")) + Number(range[2].replace(/\.|,/g, ""))) / 2) * multiplier);
  }

  const under = normalized.match(/(duoi|nho hon|duoi khoang)\s*(\d+[\.,]?\d*)\s*(k|nghin|trieu|m)?/i);
  if (under) {
    const multiplier = /k|nghin/i.test(under[3] || "") ? 1_000 : /trieu|m/i.test(under[3] || "") ? 1_000_000 : 1;
    return Math.floor(Number(under[2].replace(/\.|,/g, "")) * multiplier);
  }

  return undefined;
}

function buildFallbackChat(message: string, sessionId?: string) {
  const normalized = normalizeMessage(message);
  const budget = extractBudget(normalized);
  const wantsBuild = /build|cau hinh|may tinh|pc|gaming|render|workstation/.test(normalized);
  const wantsProduct = /mua|tim|san pham|linh kien|cpu|gpu|ram|ssd|mainboard|vga/.test(normalized);

  const products = wantsProduct ? searchProducts(normalized, 6) : [];
  const prebuilt = budget ? getPrebuiltByBudget(budget).slice(0, 3) : [];
  const build = wantsBuild && budget ? assembleBuildByBudget(budget, normalized.includes("gaming") ? "gaming" : "general") : null;

  const hints = normalizeProductImageList([
    ...products,
    ...prebuilt.map((pc) => ({
      id: pc.id,
      name: pc.name,
      category: "prebuilt",
      brand: "PC Builder Shop",
      price: pc.price,
      image: pc.image,
      shortDesc: pc.description,
      rating: pc.rating,
      specs: pc.components,
    })),
    ...(build?.selected ?? []),
  ]);

  const answer = budget
    ? `Mình đã gợi ý cấu hình theo khoảng ngân sách ${new Intl.NumberFormat("vi-VN").format(budget)}đ. Nếu muốn, mình có thể tối ưu lại theo game, đồ họa hoặc văn phòng.`
    : wantsProduct
      ? `Mình đã lọc một số sản phẩm phù hợp với từ khóa bạn vừa nhập. Nếu muốn, bạn có thể nói rõ hơn về nhu cầu hoặc ngân sách để mình lọc sát hơn.`
      : `Mình chưa có đủ thông tin để tư vấn chính xác. Bạn có thể nói rõ ngân sách, mục đích dùng, hoặc tên linh kiện cần tìm.`;

  return {
    answer,
    responseId: `local_${Date.now()}`,
    agent: "advisor",
    intent: budget ? "build_pc" : wantsProduct ? "product_inquiry" : "general_support",
    contentType: "text",
    products: hints,
    assemblySteps: build?.steps ?? [],
    sources: ["local-fallback"],
    conversationId: sessionId || `conv_${Date.now()}`,
    suggestedQuestions: budget
      ? ["Tối ưu build gaming 20 triệu", "So sánh Intel và AMD", "Gợi ý mainboard tương thích"]
      : ["Tư vấn cấu hình PC gaming", "So sánh RTX 4060 Ti và RX 7600", "Linh kiện nào tốt dưới 10 triệu?"],
  };
}

export const POST = async (request: Request) => {
  let body: any = {};
  try {
    body = await request.json();
    const payload = {
      message: body?.message,
      sessionId: body?.conversationId || body?.sessionId,
    };

    const upstream = await fetch(`${API_GATEWAY}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(buildFallbackChat(String(payload.message || ""), payload.sessionId));
    }

    const d = data?.data || {};
    return NextResponse.json({
      answer: d.message || "",
      responseId: d.responseId,
      agent: d.agent,
      intent: d.intent || "general",
      contentType: "text",
      products: d.products || [],
      sources: ["chat-service"],
      conversationId: d.sessionId || payload.sessionId,
      suggestedQuestions: d.suggestedQuestions || [],
    });
  } catch {
    return NextResponse.json(buildFallbackChat(String(body?.message || ""), body?.conversationId || body?.sessionId));
  }
};
