import Link from "next/link";
import { siteConfig } from "@/lib/site";

type HeaderProps = {
  name: string;
};

export function Header({ name }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(247,247,243,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-[-0.02em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          {name}
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
