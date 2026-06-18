import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { getAdminContent } from "@/lib/admin/content-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  return NextResponse.json(await getAdminContent());
}
