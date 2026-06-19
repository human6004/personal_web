import Link from "next/link";
import { siteConfig } from "@/lib/site";

type HeaderProps = {
  name: string;
};

export function Header({ name }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b-[2.5px] border-[var(--ink)] bg-[var(--surface)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-[-0.01em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        >
          {name}
          <span aria-hidden className="text-[var(--accent)]">.</span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius)] px-3 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
