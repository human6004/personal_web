"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="brut-card grid gap-5 p-6"
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
        <span className="text-sm font-bold">Admin password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="brut-input"
          required
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="brut-card brut-press rounded-[var(--radius)] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Checking" : "Login"}
      </button>
    </form>
  );
}
