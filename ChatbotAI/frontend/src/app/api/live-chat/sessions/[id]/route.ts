import { NextResponse } from "next/server";
import {
  deleteLiveChatSession,
  closeLiveChatSession,
  getLiveChatSessionSummary,
  reopenLiveChatSession,
  updateLiveChatSession,
} from "@/lib/liveChatStore";

export const GET = async (_request: Request, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    return NextResponse.json({ session: getLiveChatSessionSummary(id) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 404 });
  }
};

export const PATCH = async (request: Request, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await request.json();

    if (body.action === "close") {
      return NextResponse.json({ session: closeLiveChatSession(id) });
    }

    if (body.action === "reopen") {
      return NextResponse.json({ session: reopenLiveChatSession(id) });
    }

    if (body.action === "update") {
      return NextResponse.json({
        session: updateLiveChatSession(id, {
          subject: body.subject,
          status: body.status,
          userName: body.userName,
          userEmail: body.userEmail,
        }),
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
};

export const DELETE = async (_request: Request, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    return NextResponse.json({ session: deleteLiveChatSession(id) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 404 });
  }
};