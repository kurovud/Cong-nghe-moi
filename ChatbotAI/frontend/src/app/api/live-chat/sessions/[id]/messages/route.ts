import { NextResponse } from "next/server";
import {
  addLiveChatMessage,
  getLiveChatMessages,
  getLiveChatSessionSummary,
  markLiveChatMessagesRead,
} from "@/lib/liveChatStore";

export const GET = async (request: Request, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const url = new URL(request.url);
    const role = (url.searchParams.get("role") || "customer") as "customer" | "admin";
    if (role) {
      markLiveChatMessagesRead(id, role);
    }

    return NextResponse.json({
      session: getLiveChatSessionSummary(id),
      messages: getLiveChatMessages(id),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 404 });
  }
};

export const POST = async (request: Request, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await request.json();
    const result = addLiveChatMessage(id, {
      senderRole: body.senderRole,
      senderName: body.senderName,
      content: body.content,
      messageType: body.messageType,
      imageUrl: body.imageUrl,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};