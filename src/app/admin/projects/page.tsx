import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getAllProjects } from "@/lib/content";

export default async function AdminProjectsPage() {
  await requireAdminPage();

  const projects = await getAllProjects({ includeDrafts: true });

  return (
    <AdminShell>
      <div className="grid gap-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="grid gap-3">
            <p className="text-sm font-medium text-[var(--muted)]">Projects</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Project case studies
            </h1>
          </div>
          <Link
            href="/admin/projects/new"
            className="max-w-fit rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--paper)] transition hover:bg-[var(--accent)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            New project
          </Link>
        </section>

        <section className="grid gap-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/admin/projects/${project.slug}`}
              className="grid gap-2 rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-5 transition hover:-translate-y-1 hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:grid-cols-[1fr_auto] md:items-center"
            >
              <span className="grid gap-1">
                <span className="font-semibold">{project.title}</span>
                <span className="text-sm text-[var(--muted)]">
                  /projects/{project.slug} · {project.year} · {project.role}
                </span>
              </span>
              <span className="text-sm font-medium text-[var(--muted)]">
                {project.draft ? "Draft" : project.featured ? "Featured" : "Published"}
              </span>
            </Link>
          ))}
          {projects.length === 0 ? (
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-6 text-[var(--muted)]">
              Chưa có project nào.
            </div>
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
