import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { requireAdminPage } from "@/lib/admin/server-auth";

export default async function NewAdminPostPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <div className="grid gap-8">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">New post</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Tạo bài viết mới.
          </h1>
        </section>
        <PostForm />
      </div>
    </AdminShell>
  );
}
