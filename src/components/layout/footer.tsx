import Link from "next/link";
import { siteConfig } from "@/lib/site";

type FooterProps = {
  name: string;
  tagline: string;
};

export function Footer({ name, tagline }: FooterProps) {
  return (
    <footer className="mt-12 border-t-[2.5px] border-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="grid gap-3">
            <p className="font-display text-2xl font-bold tracking-[-0.01em]">
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
                className="brut-card brut-press rounded-[var(--radius)] px-3 py-2 text-sm font-bold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
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
