import { NextResponse } from "next/server";
import { updateProfile, changePassword, addAddress, removeAddress, getUserByToken } from "@/lib/userStore";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { action, token } = body;

    const user = getUserByToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (action === "update_profile") {
      const updated = updateProfile(user.id, {
        name: body.name,
        phone: body.phone,
      });
      return NextResponse.json({ user: updated });
    }

    if (action === "change_password") {
      const ok = changePassword(user.email, body.oldPassword, body.newPassword);
      if (!ok) return NextResponse.json({ error: "Mật khẩu cũ không đúng" }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    if (action === "add_address") {
      const updated = addAddress(user.id, body.address);
      return NextResponse.json({ user: updated });
    }

    if (action === "remove_address") {
      const updated = removeAddress(user.id, body.index);
      return NextResponse.json({ user: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
