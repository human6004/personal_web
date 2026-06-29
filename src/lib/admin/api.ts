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

function validationErrorResponse(error: unknown) {
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

function serverErrorResponse() {
  return NextResponse.json({ error: "Could not save content" }, { status: 500 });
}

function isInvalidSlugError(error: unknown): error is Error {
  return error instanceof Error && error.message.startsWith("Invalid slug");
}

function isMalformedJsonError(error: unknown) {
  return error instanceof SyntaxError;
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (isInvalidSlugError(error)) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (isMalformedJsonError(error)) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  console.error("Admin route error:", error);
  return serverErrorResponse();
}

export function requireAdmin(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  return null;
}
