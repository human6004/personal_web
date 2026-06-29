import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/content";
import { handleRouteError, requireAdmin } from "@/lib/admin/api";
import { writePost } from "@/lib/admin/content-store";
import { postInputSchema } from "@/lib/admin/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const input = postInputSchema.parse(await request.json());

    if (await getPostBySlug(input.slug, { includeDrafts: true })) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    await writePost(input);
    return NextResponse.json({ ok: true, slug: input.slug }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
