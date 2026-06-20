import Link from "next/link";
import { siteConfig } from "@/lib/site";

type FooterProps = {
  name: string;
  tagline: string;
};

export function Footer({ name, tagline }: FooterProps) {
  return (
    <footer className="mt-10 border-t-[var(--border-w)] border-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="grid gap-2.5">
            <p className="font-display text-xl font-semibold tracking-[-0.005em]">
              {name}
              <span aria-hidden className="text-[var(--accent)]">.</span>
            </p>
            <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
              {tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="brut-card brut-press rounded-[var(--radius)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="rule" />
        <p className="eyebrow">
          © {new Date().getFullYear()} {name} · Portfolio &amp; knowledge journal
        </p>
      </div>
    </footer>
  );
}
