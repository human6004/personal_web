import { NextResponse } from "next/server";
import {
  adminCookieName,
  createSessionToken,
  getAdminSecrets,
  verifyAdminPassword
} from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
