import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getEditablePost } from "@/lib/admin/content-store";
import { requireAdminPage } from "@/lib/admin/server-auth";

type AdminPostEditPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminPostEditPage({
  params
}: AdminPostEditPageProps) {
  await requireAdminPage();

  const { slug } = await params;
  const post = await safeGetPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="grid gap-8">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">Edit post</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {post.title}
          </h1>
        </section>
        <PostForm post={post} />
      </div>
    </AdminShell>
  );
}

async function safeGetPost(slug: string) {
  try {
    return await getEditablePost(slug);
  } catch {
    return null;
  }
}
