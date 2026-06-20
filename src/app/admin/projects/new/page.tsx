import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdminPage } from "@/lib/admin/server-auth";

export default async function NewAdminProjectPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">New project</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
            Tạo project mới.
          </h1>
        </section>
        <ProjectForm />
      </div>
    </AdminShell>
  );
}
