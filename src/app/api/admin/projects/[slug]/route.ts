import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/content";
import { handleRouteError, requireAdmin } from "@/lib/admin/api";
import { writeProject } from "@/lib/admin/content-store";
import { validateSlug } from "@/lib/admin/paths";
import { projectInputSchema } from "@/lib/admin/schemas";

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
    const input = projectInputSchema.parse(await request.json());

    if (
      input.slug !== previousSlug &&
      await getProjectBySlug(input.slug, { includeDrafts: true })
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    await writeProject(input, previousSlug);
    return NextResponse.json({ ok: true, slug: input.slug });
  } catch (error) {
    return handleRouteError(error);
  }
}
