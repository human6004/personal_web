import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminCookieName, getAdminSecrets, verifySessionToken } from "./auth";

export function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function isAdminRequest(request: Request) {
  const { sessionSecret } = getAdminSecrets();
  const token = getCookieValue(request, adminCookieName);

  return verifySessionToken(token, sessionSecret);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function validationErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export function serverErrorResponse() {
  return NextResponse.json({ error: "Could not save content" }, { status: 500 });
}

export function requireAdmin(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  return null;
}
