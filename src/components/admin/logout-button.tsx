"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          router.push("/admin/login");
          router.refresh();
        });
      }}
      className="brut-card brut-press rounded-[var(--radius)] bg-[var(--accent)] px-3 py-2 text-sm font-bold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Logging out" : "Logout"}
    </button>
  );
}
