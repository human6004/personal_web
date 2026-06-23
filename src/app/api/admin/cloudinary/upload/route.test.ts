import { afterEach, describe, expect, it, vi } from "vitest";
import { adminCookieName, createSessionToken } from "@/lib/admin/auth";
import { POST } from "./route";

function adminCookie() {
  vi.stubEnv("ADMIN_SESSION_SECRET", "long-random-secret");
  return `${adminCookieName}=${encodeURIComponent(createSessionToken("long-random-secret"))}`;
}

describe("POST /api/admin/cloudinary/upload", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires an admin session cookie", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/cloudinary/upload", { method: "POST" })
    );

    expect(response.status).toBe(401);
  });

  it("rejects invalid upload form data", async () => {
    const formData = new FormData();
    formData.set("folder", "personal-web/posts");
    formData.set("file", new File(["text"], "notes.txt", { type: "text/plain" }));

    const response = await POST(
      new Request("http://localhost/api/admin/cloudinary/upload", {
        method: "POST",
        headers: { cookie: adminCookie() },
        body: formData
      })
    );

    expect(response.status).toBe(400);
  });
});
