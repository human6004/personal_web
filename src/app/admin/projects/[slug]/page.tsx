import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { getEditableProject } from "@/lib/admin/content-store";
import { requireAdminPage } from "@/lib/admin/server-auth";

type AdminProjectEditPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProjectEditPage({
  params
}: AdminProjectEditPageProps) {
  await requireAdminPage();

  const { slug } = await params;
  const project = await safeGetProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">Edit project</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
            {project.title}
          </h1>
        </section>
        <ProjectForm project={project} />
      </div>
    </AdminShell>
  );
}

async function safeGetProject(slug: string) {
  try {
    return await getEditableProject(slug);
  } catch {
    return null;
  }
}
