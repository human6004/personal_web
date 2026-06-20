import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getAllPosts } from "@/lib/content";

export default async function AdminPostsPage() {
  await requireAdminPage();

  const posts = await getAllPosts({ includeDrafts: true });

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="grid gap-3">
            <p className="eyebrow">Posts</p>
            <h1 className="display-section">Blog posts</h1>
          </div>
          <Link
            href="/admin/posts/new"
            className="brut-card brut-press max-w-fit rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          >
            New post
          </Link>
        </section>

        <section className="grid gap-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/admin/posts/${post.slug}`}
              className="brut-card brut-press grid gap-2 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] md:grid-cols-[1fr_auto] md:items-center"
            >
              <span className="grid gap-1">
                <span className="font-semibold">{post.title}</span>
                <span className="text-sm text-[var(--muted)]">
                  /blog/{post.slug} · {post.category} · {post.date}
                </span>
              </span>
              <span className="text-sm font-medium text-[var(--muted)]">
                {post.draft ? "Draft" : "Published"}
              </span>
            </Link>
          ))}
          {posts.length === 0 ? (
            <div className="brut-card p-5 text-[var(--muted)]">
              Chưa có bài viết nào.
            </div>
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
