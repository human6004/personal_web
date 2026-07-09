import { NextResponse } from "next/server";
import {
  adminCookieName,
  createSessionToken,
  getAdminSecrets,
  verifyAdminPassword
} from "@/lib/admin/auth";
import {
  checkAndConsumeLoginAttempt,
  clearLoginAttempts
} from "@/lib/admin/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "";
  }

  return request.headers.get("x-real-ip")?.trim() || "";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = await checkAndConsumeLoginAttempt(ip);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec ?? 900) }
      }
    );
  }

  const { password } = (await request.json().catch(() => ({}))) as {
    password?: string;
  };
  const { password: expectedPassword, sessionSecret } = getAdminSecrets();

  if (
    !password ||
    !expectedPassword ||
    !sessionSecret ||
    !verifyAdminPassword(password, expectedPassword)
  ) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await clearLoginAttempts(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createSessionToken(sessionSecret), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
