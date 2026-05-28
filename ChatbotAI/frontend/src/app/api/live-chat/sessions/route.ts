import { NextResponse } from "next/server";
import {
  createLiveChatSession,
  getLiveChatStats,
  listLiveChatSessions,
} from "@/lib/liveChatStore";

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || undefined;
    const userId = url.searchParams.get("userId") || undefined;

    const sessions = listLiveChatSessions({
      status: status as any,
      userId: userId || undefined,
    });

    return NextResponse.json({ sessions, total: sessions.length, stats: getLiveChatStats() });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const result = createLiveChatSession({
      userId: body.userId,
      userName: body.userName,
      userEmail: body.userEmail,
      subject: body.subject,
      source: body.source,
      initialMessage: body.initialMessage,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};