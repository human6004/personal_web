import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Chặn CSRF-logout: chỉ chấp nhận POST cùng origin. Không có token nên dựa vào
// Origin/Referer header (browser luôn set cho request có credential từ site khác).
// Thiếu cả hai -> từ chối (an toàn hơn cho phép).
function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("host");
  if (!host) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return false;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
