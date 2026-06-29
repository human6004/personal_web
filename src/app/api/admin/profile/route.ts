import { NextResponse } from "next/server";
import { handleRouteError, requireAdmin } from "@/lib/admin/api";
import { writeEditableProfile } from "@/lib/admin/content-store";
import { profileInputSchema } from "@/lib/admin/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const input = profileInputSchema.parse(await request.json());
    await writeEditableProfile(input);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
