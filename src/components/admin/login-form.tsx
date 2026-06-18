"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-5 rounded-[28px] border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[0_24px_70px_rgba(34,37,31,0.08)]"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        const password = String(formData.get("password") || "");

        startTransition(async () => {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
          });

          if (!response.ok) {
            setError("Mật khẩu admin chưa đúng hoặc env chưa được cấu hình.");
            return;
          }

          router.push("/admin");
          router.refresh();
        });
      }}
    >
      <label className="grid gap-2">
        <span className="text-sm font-medium">Admin password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="rounded-[16px] border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)]"
          required
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--paper)] transition hover:bg-[var(--accent)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Checking" : "Login"}
      </button>
    </form>
  );
}
