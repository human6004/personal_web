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
      <header className="border-b border-[var(--line)] bg-[rgba(247,247,243,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="grid gap-1">
            <Link
              href="/admin"
              className="text-lg font-semibold tracking-[-0.03em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
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
                className="rounded-full border border-[var(--line)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
              >
                {item.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
