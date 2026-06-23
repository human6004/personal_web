import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getEditablePost } from "@/lib/admin/content-store";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getCloudinaryUploadFolder } from "@/lib/cloudinary/server";

type AdminPostEditPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminPostEditPage({
  params
}: AdminPostEditPageProps) {
  await requireAdminPage();

  const { slug } = await params;
  const post = await safeGetPost(slug);
  const cloudinaryFolder = getCloudinaryUploadFolder();

  if (!post) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">Edit post</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
            {post.title}
          </h1>
        </section>
        <PostForm post={post} cloudinaryFolder={cloudinaryFolder} />
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
