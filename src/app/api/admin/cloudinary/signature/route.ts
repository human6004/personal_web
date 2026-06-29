import { NextResponse } from "next/server";
import { handleRouteError, requireAdmin } from "@/lib/admin/api";
import { signCloudinaryUploadParams } from "@/lib/cloudinary/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const body = (await request.json()) as { paramsToSign?: unknown };
    const signature = signCloudinaryUploadParams(body.paramsToSign);

    return NextResponse.json({ signature });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid Cloudinary")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes("not configured")) {
      return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
    }

    return handleRouteError(error);
  }
}
