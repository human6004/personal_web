import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { listCloudinaryResources } from "@/lib/cloudinary/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const url = new URL(request.url);
    const nextCursor = url.searchParams.get("nextCursor") || undefined;

    return NextResponse.json(await listCloudinaryResources(nextCursor));
  } catch {
    return NextResponse.json({ error: "Could not load Cloudinary media" }, { status: 500 });
  }
}
