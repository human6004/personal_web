import { AdminShell } from "@/components/admin/admin-shell";
import { MediaLibrary } from "@/components/admin/media/media-library";
import { requireAdminPage } from "@/lib/admin/server-auth";
import { getCloudinaryUploadFolder } from "@/lib/cloudinary/server";

export default async function AdminMediaPage() {
  await requireAdminPage();
  const cloudinaryFolder = getCloudinaryUploadFolder();

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="grid gap-3">
          <p className="text-sm font-medium text-[var(--muted)]">Media</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.015em] md:text-4xl">
            Cloudinary media library.
          </h1>
          <p className="max-w-2xl leading-7 text-[var(--muted)]">
            Upload images, copy URLs, and reuse assets for covers, MDX content,
            and the homepage avatar.
          </p>
        </section>
        <MediaLibrary folder={cloudinaryFolder} />
      </div>
    </AdminShell>
  );
}
