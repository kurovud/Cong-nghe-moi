import { NextResponse } from "next/server";
import { getNotifications, markAsRead, markAllRead, getUnreadCount } from "@/lib/notificationStore";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { action, userId = "guest" } = body;

    if (action === "get") {
      const notifications = getNotifications(userId);
      const unreadCount = getUnreadCount(userId);
      return NextResponse.json({ notifications, unreadCount });
    }

    if (action === "read") {
      markAsRead(userId, body.notifId);
      return NextResponse.json({ success: true });
    }

    if (action === "read_all") {
      markAllRead(userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
