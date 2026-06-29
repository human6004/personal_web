"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { clsx } from "clsx";
import { siteConfig } from "@/lib/site";

type HeaderProps = {
  name: string;
};

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
          {siteConfig.navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "rounded-[var(--radius)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] sm:px-3.5",
                  active
                    ? "bg-[var(--pop)]"
                    : "hover:bg-[var(--accent)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
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

      <div
        className={clsx(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out md:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          aria-hidden={!open}
          className={clsx(
            "min-h-0 overflow-hidden border-b-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)]",
            open ? "" : "pointer-events-none"
          )}
        >
          {siteConfig.navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                tabIndex={open ? undefined : -1}
                className={clsx(
                  "flex min-h-[48px] items-center border-t-[var(--border-w)] border-[var(--ink)] px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ink)] sm:px-6",
                  active ? "bg-[var(--pop)]" : ""
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
