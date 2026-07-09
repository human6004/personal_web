import Link from "next/link";
import {
  EnvelopeSimple,
  FacebookLogo,
  FileText,
  GithubLogo,
  LinkedinLogo
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { siteConfig } from "@/lib/site";
import type { EditableProfile } from "@/lib/profile";

type FooterProps = {
  name: string;
  tagline: string;
  socials: EditableProfile["socials"];
};

type SocialLink = {
  label: string;
  href: string;
  icon: Icon;
  external: boolean;
};

function buildSocials(socials: FooterProps["socials"]): SocialLink[] {
  return [
    socials.email
      ? { label: "Email", href: `mailto:${socials.email}`, icon: EnvelopeSimple, external: false }
      : null,
    socials.github
      ? { label: "GitHub", href: socials.github, icon: GithubLogo, external: true }
      : null,
    socials.linkedin
      ? { label: "LinkedIn", href: socials.linkedin, icon: LinkedinLogo, external: true }
      : null,
    socials.facebook
      ? { label: "Facebook", href: socials.facebook, icon: FacebookLogo, external: true }
      : null,
    socials.cv ? { label: "CV", href: socials.cv, icon: FileText, external: true } : null
  ].filter((link): link is SocialLink => Boolean(link));
}

export function Footer({ name, tagline, socials }: FooterProps) {
  const socialLinks = buildSocials(socials);

  return (
    <footer className="mt-10 border-t-[var(--border-w)] border-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="grid gap-2.5">
            <p className="font-display text-xl font-semibold tracking-[-0.005em]">
              {name}
              <span aria-hidden className="text-[var(--accent)]">
                .
              </span>
            </p>
            <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
              {tagline}
            </p>
            {socialLinks.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {socialLinks.map(({ label, href, icon: Glyph, external }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="brut-card brut-press grid h-9 w-9 place-items-center rounded-[var(--radius)] text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
                  >
                    <Glyph size={18} weight="bold" aria-hidden />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-2">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="brut-card brut-press rounded-[var(--radius)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="rule" />
        <p className="eyebrow eyebrow--plain">
          © {new Date().getFullYear()} {name} · Portfolio &amp; knowledge journal
        </p>
      </div>
    </footer>
  );
}
