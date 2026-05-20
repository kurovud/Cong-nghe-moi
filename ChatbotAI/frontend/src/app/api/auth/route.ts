import { NextResponse } from "next/server";
import { login, register, getUserByToken, logout } from "@/lib/userStore";

/* POST /api/auth — login, register, logout, me */
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "login") {
      const result = login(body.email, body.password);
      if (!result)
        return NextResponse.json(
          { error: "Email hoặc mật khẩu không đúng" },
          { status: 401 }
        );
      return NextResponse.json(result);
    }

    if (action === "register") {
      const result = register({
        email: body.email,
        password: body.password,
        name: body.name,
        phone: body.phone,
      });
      if ("error" in result)
        return NextResponse.json({ error: result.error }, { status: 400 });
      return NextResponse.json(result);
    }

    if (action === "logout") {
      if (body.token) logout(body.token);
      return NextResponse.json({ success: true });
    }

    if (action === "me") {
      const user = getUserByToken(body.token);
      if (!user)
        return NextResponse.json(
          { error: "Phiên đăng nhập hết hạn" },
          { status: 401 }
        );
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
