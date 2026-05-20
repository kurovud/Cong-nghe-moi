import { NextResponse } from "next/server";

const API_GATEWAY =
  process.env.API_GATEWAY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
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
      return NextResponse.json(
        data || {
          success: false,
          error: { message: "Khong the ket noi chat service" },
        },
        { status: upstream.status }
      );
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
    return NextResponse.json(
      {
        answer: "Xin loi, he thong chat dang ban. Vui long thu lai sau.",
        contentType: "text",
        intent: "unknown",
        conversationId: `conv_${Date.now()}`,
        sources: [],
        suggestedQuestions: ["Tu van cau hinh PC theo ngan sach"],
      },
      { status: 500 }
    );
  }
};
