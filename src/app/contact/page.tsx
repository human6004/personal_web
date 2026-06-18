import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { buildMetadata } from "@/lib/metadata";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Contact",
    description: "Các đường dẫn liên hệ công khai cho website cá nhân.",
    path: "/contact"
  });
}

export default async function ContactPage() {
  const { socials } = await getProfile();
  const links = [
    socials.email ? { label: "Email", href: `mailto:${socials.email}`, external: false } : null,
    socials.github ? { label: "GitHub", href: socials.github, external: true } : null,
    socials.linkedin ? { label: "LinkedIn", href: socials.linkedin, external: true } : null,
    socials.facebook ? { label: "Facebook", href: socials.facebook, external: true } : null,
    socials.cv ? { label: "CV", href: socials.cv, external: true } : null
  ].filter((link): link is { label: string; href: string; external: boolean } =>
    Boolean(link)
  );

  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-4xl gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-6">
        <p className="max-w-fit rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)]">
          Contact
        </p>
        <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
          Kết nối khi có điều đáng nói tiếp.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          V1 không dùng contact form để tránh backend, spam và email service. Khi
          có link thật, chỉ cần cập nhật trong site config.
        </p>
      </section>

      {links.length > 0 ? (
        <section className="grid gap-3">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between rounded-[22px] border border-[var(--line)] bg-[var(--paper)] p-5 text-lg font-medium transition hover:-translate-y-1 hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <span>{item.label}</span>
              <ArrowUpRight aria-hidden />
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 md:p-10">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">
            Chưa thêm link liên hệ công khai
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            Đây là fallback có chủ đích để không bịa email hoặc social link. Khi
            bạn cung cấp email, GitHub, Facebook, LinkedIn hoặc CV, phần này sẽ
            tự hiển thị các CTA tương ứng.
          </p>
        </section>
      )}
    </div>
  );
}
