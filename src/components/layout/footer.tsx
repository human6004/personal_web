import Link from "next/link";
import { siteConfig } from "@/lib/site";

type FooterProps = {
  name: string;
  tagline: string;
};

export function Footer({ name, tagline }: FooterProps) {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="grid gap-2">
            <p className="text-lg font-semibold tracking-[-0.02em]">
              {name}
            </p>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              {tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Built as a personal portfolio and knowledge blog.
        </p>
      </div>
    </footer>
  );
}
