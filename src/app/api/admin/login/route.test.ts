import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

describe("POST /api/admin/login", () => {
  it("rejects invalid passwords", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "secret");
    vi.stubEnv("ADMIN_SESSION_SECRET", "long-random-secret");

    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password: "wrong" })
      })
    );

    expect(response.status).toBe(401);
  });

  it("sets an httpOnly session cookie for the right password", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "secret");
    vi.stubEnv("ADMIN_SESSION_SECRET", "long-random-secret");

    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password: "secret" })
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=strict");
  });
});
