import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdminPage } from "@/lib/admin/server-auth";

export default async function NewAdminProjectPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <div className="grid gap-8">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">New project</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Tạo project mới.
          </h1>
        </section>
        <ProjectForm />
      </div>
    </AdminShell>
  );
}
