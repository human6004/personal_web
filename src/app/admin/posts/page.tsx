import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getAllPosts } from "@/lib/content";

export default async function AdminPostsPage() {
  await requireAdminPage();

  const posts = await getAllPosts({ includeDrafts: true });

  return (
    <AdminShell>
      <div className="grid gap-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="grid gap-3">
            <p className="text-sm font-medium text-[var(--muted)]">Posts</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Blog posts
            </h1>
          </div>
          <Link
            href="/admin/posts/new"
            className="max-w-fit rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--paper)] transition hover:bg-[var(--accent)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            New post
          </Link>
        </section>

        <section className="grid gap-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/admin/posts/${post.slug}`}
              className="grid gap-2 rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-5 transition hover:-translate-y-1 hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:grid-cols-[1fr_auto] md:items-center"
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
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-6 text-[var(--muted)]">
              Chưa có bài viết nào.
            </div>
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
