"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/site";

type HeaderProps = {
  name: string;
};

export function Header({ name }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-[-0.005em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        >
          {name}
          <span aria-hidden className="text-[var(--accent)]">.</span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] sm:px-3.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="brut-card brut-press grid h-9 w-9 place-items-center rounded-[var(--radius)] bg-[var(--surface)] text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] md:hidden"
        >
          {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-b-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)] md:hidden"
        >
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[48px] items-center border-t-[var(--border-w)] border-[var(--ink)] px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ink)] sm:px-6"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
