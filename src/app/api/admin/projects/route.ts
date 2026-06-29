import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/content";
import { handleRouteError, requireAdmin } from "@/lib/admin/api";
import { writeProject } from "@/lib/admin/content-store";
import { projectInputSchema } from "@/lib/admin/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const input = projectInputSchema.parse(await request.json());

    if (await getProjectBySlug(input.slug, { includeDrafts: true })) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    await writeProject(input);
    return NextResponse.json({ ok: true, slug: input.slug }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
