import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  EnvelopeSimple,
  FacebookLogo,
  FileText,
  GithubLogo,
  LinkedinLogo
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
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

type ContactLink = {
  label: string;
  hint: string;
  href: string;
  icon: Icon;
  external: boolean;
};

export default async function ContactPage() {
  const { socials } = await getProfile();
  const links: ContactLink[] = [
    socials.email
      ? {
          label: "Email",
          hint: socials.email,
          href: `mailto:${socials.email}`,
          icon: EnvelopeSimple,
          external: false
        }
      : null,
    socials.github
      ? { label: "GitHub", hint: "Xem code & project", href: socials.github, icon: GithubLogo, external: true }
      : null,
    socials.linkedin
      ? { label: "LinkedIn", hint: "Kết nối công việc", href: socials.linkedin, icon: LinkedinLogo, external: true }
      : null,
    socials.facebook
      ? { label: "Facebook", hint: "Trò chuyện thân mật", href: socials.facebook, icon: FacebookLogo, external: true }
      : null,
    socials.cv
      ? { label: "CV", hint: "Hồ sơ đầy đủ", href: socials.cv, icon: FileText, external: true }
      : null
  ].filter((link): link is ContactLink => Boolean(link));

  return (
    <div className="mx-auto grid min-h-[66dvh] max-w-4xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-5">
        <p className="eyebrow">Contact</p>
        <h1 className="display-hero">
          Kết nối khi có điều <em>đáng nói tiếp.</em>
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
          Mình đọc mọi lời nhắn về công nghệ, học tập, ý tưởng project hoặc chỉ
          để chào hỏi. Chọn kênh tiện nhất bên dưới.
        </p>
      </section>

      {links.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {links.map(({ label, hint, href, icon: Glyph, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="brut-card brut-press flex items-center gap-3.5 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--accent-soft)]">
                <Glyph size={20} weight="bold" aria-hidden />
              </span>
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="font-semibold">{label}</span>
                <span className="mono truncate text-xs text-[var(--muted)]">
                  {hint}
                </span>
              </span>
              <ArrowUpRight aria-hidden size={16} weight="bold" />
            </Link>
          ))}
        </section>
      ) : (
        <section className="brut-card p-5 md:p-8">
          <h2 className="font-display text-xl font-semibold tracking-[-0.005em]">
            Sắp có thêm kênh liên hệ
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            Các đường dẫn email, GitHub, LinkedIn, Facebook và CV sẽ xuất hiện ở
            đây ngay khi được cập nhật.
          </p>
        </section>
      )}
    </div>
  );
}
