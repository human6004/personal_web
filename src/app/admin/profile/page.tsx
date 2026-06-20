import { AdminShell } from "@/components/admin/admin-shell";
import { ProfileForm } from "@/components/admin/profile-form";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getProfile } from "@/lib/profile";

export default async function AdminProfilePage() {
  await requireAdminPage();

  const profile = await getProfile();

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">Profile</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
            Chỉnh thông tin cá nhân.
          </h1>
          <p className="max-w-2xl leading-7 text-[var(--muted)]">
            Các trường này được lưu vào <code>content/profile.json</code> và được
            public website đọc lại.
          </p>
        </section>
        <ProfileForm profile={profile} />
      </div>
    </AdminShell>
  );
}
