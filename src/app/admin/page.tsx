import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getAllPosts, getAllProjects } from "@/lib/content";

const quickActions = [
  {
    href: "/admin/posts/new",
    title: "New post",
    body: "Tạo bài viết hoặc ghi chú mới bằng MDX."
  },
  {
    href: "/admin/projects/new",
    title: "New project",
    body: "Tạo project mới với repo, demo và case study."
  },
  {
    href: "/admin/profile",
    title: "Edit profile",
    body: "Sửa tagline, social links, homepage và about."
  }
];

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const posts = await getAllPosts({ includeDrafts: true });
  const projects = await getAllProjects({ includeDrafts: true });
  const draftPosts = posts.filter((post) => post.draft).length;
  const draftProjects = projects.filter((project) => project.draft).length;

  return (
    <AdminShell>
      <div className="grid gap-8">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">Dashboard</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
            Nội dung local của website.
          </h1>
          <p className="max-w-2xl leading-7 text-[var(--muted)]">
            Khu này dùng để viết nhanh vào <code>content/posts</code>,{" "}
            <code>content/projects</code> và <code>content/profile.json</code>.
            V1 không xóa file, chỉ dùng draft để ẩn khỏi public site.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Posts" value={posts.length} />
          <StatCard label="Draft posts" value={draftPosts} />
          <StatCard label="Projects" value={projects.length} />
          <StatCard label="Draft projects" value={draftProjects} />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickActions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="brut-card brut-press grid gap-2.5 p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              <span className="font-display text-lg font-semibold tracking-[-0.005em]">
                {item.title}
              </span>
              <span className="text-sm leading-6 text-[var(--muted)]">{item.body}</span>
            </Link>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="brut-card p-5">
      <p className="text-sm font-semibold text-[var(--muted)]">{label}</p>
      <p className="mt-2.5 font-display text-3xl font-semibold tracking-[-0.015em]">{value}</p>
    </div>
  );
}
