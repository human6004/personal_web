import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import {
  CloudinaryMediaValidationError,
  deleteCloudinaryImages
} from "@/lib/cloudinary/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { publicIds?: unknown };
    await deleteCloudinaryImages(body.publicIds as string[]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CloudinaryMediaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes("Cloudinary is not configured")) {
      return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
    }

    return NextResponse.json({ error: "Could not delete image" }, { status: 500 });
  }
}
