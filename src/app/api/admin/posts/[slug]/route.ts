import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/content";
import { handleRouteError, requireAdmin } from "@/lib/admin/api";
import { writePost } from "@/lib/admin/content-store";
import { validateSlug } from "@/lib/admin/paths";
import { postInputSchema } from "@/lib/admin/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const { slug } = await context.params;
    const previousSlug = validateSlug(slug);
    const input = postInputSchema.parse(await request.json());

    if (
      input.slug !== previousSlug &&
      await getPostBySlug(input.slug, { includeDrafts: true })
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    await writePost(input, previousSlug);
    return NextResponse.json({ ok: true, slug: input.slug });
  } catch (error) {
    return handleRouteError(error);
  }
}
