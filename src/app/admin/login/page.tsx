import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { hasAdminSession } from "@/lib/admin/server-auth";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-lg content-center gap-8 px-4 py-16 sm:px-6">
      <section className="grid gap-3">
        <p className="text-sm font-medium text-[var(--muted)]">Local admin</p>
        <h1 className="text-4xl font-semibold tracking-[-0.05em]">
          Đăng nhập để chỉnh nội dung.
        </h1>
        <p className="leading-7 text-[var(--muted)]">
          Mật khẩu được đọc từ file <code>.env.local</code>. Admin này chỉ ghi file
          local trong project, không dùng database hay CMS online.
        </p>
      </section>
      <LoginForm />
      <Link
        href="/"
        className="max-w-fit text-sm font-medium text-[var(--muted)] transition hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        Back to website
      </Link>
    </div>
  );
}
