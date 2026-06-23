import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import {
  CloudinaryMediaValidationError,
  uploadCloudinaryImage,
  validateCloudinaryImageFile
} from "@/lib/cloudinary/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const formData = await request.formData().catch(() => {
      throw new CloudinaryMediaValidationError("Invalid upload form data.");
    });
    const file = validateCloudinaryImageFile(formData.get("file"));
    const folder = String(formData.get("folder") || "");
    const asset = await uploadCloudinaryImage(file, folder);

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    if (error instanceof CloudinaryMediaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes("Cloudinary is not configured")) {
      return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
    }

    return NextResponse.json({ error: "Could not upload image" }, { status: 500 });
  }
}
