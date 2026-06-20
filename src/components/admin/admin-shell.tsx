import Link from "next/link";
import { LogoutButton } from "./logout-button";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/profile", label: "Profile" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--paper)]">
      <header className="border-b-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3.5 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="grid gap-1">
            <Link
              href="/admin"
              className="font-display text-lg font-semibold tracking-[-0.005em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              Local Admin
            </Link>
            <p className="text-sm text-[var(--muted)]">
              Edit local MDX and profile JSON on this machine.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="brut-card brut-press rounded-[var(--radius)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
