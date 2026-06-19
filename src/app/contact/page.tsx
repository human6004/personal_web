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
        <p className="eyebrow">Contact</p>
        <h1 className="display-hero">
          Kết nối khi có điều <em>đáng nói tiếp.</em>
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
              className="brut-card brut-press flex items-center justify-between p-5 text-lg font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              <span>{item.label}</span>
              <ArrowUpRight aria-hidden />
            </Link>
          ))}
        </section>
      ) : (
        <section className="brut-card p-6 md:p-10">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em]">
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
