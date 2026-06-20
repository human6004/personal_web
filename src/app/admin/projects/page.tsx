import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getAllProjects } from "@/lib/content";

export default async function AdminProjectsPage() {
  await requireAdminPage();

  const projects = await getAllProjects({ includeDrafts: true });

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="grid gap-3">
            <p className="eyebrow">Projects</p>
            <h1 className="display-section">Project case studies</h1>
          </div>
          <Link
            href="/admin/projects/new"
            className="brut-card brut-press max-w-fit rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          >
            New project
          </Link>
        </section>

        <section className="grid gap-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/admin/projects/${project.slug}`}
              className="brut-card brut-press grid gap-2 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] md:grid-cols-[1fr_auto] md:items-center"
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
            <div className="brut-card p-5 text-[var(--muted)]">
              Chưa có project nào.
            </div>
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}
