import { afterEach, describe, expect, it, vi } from "vitest";
import { adminCookieName, createSessionToken } from "@/lib/admin/auth";
import { POST } from "./route";

function adminCookie() {
  vi.stubEnv("ADMIN_SESSION_SECRET", "long-random-secret");
  return `${adminCookieName}=${encodeURIComponent(createSessionToken("long-random-secret"))}`;
}

describe("POST /api/admin/cloudinary/delete", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requires an admin session cookie", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/cloudinary/delete", { method: "POST" })
    );

    expect(response.status).toBe(401);
  });

  it("rejects public ids outside the project upload folder", async () => {
    vi.stubEnv("CLOUDINARY_UPLOAD_FOLDER", "personal-web");

    const response = await POST(
      new Request("http://localhost/api/admin/cloudinary/delete", {
        method: "POST",
        headers: {
          cookie: adminCookie(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ publicIds: ["other-web/posts/cover"] })
      })
    );

    expect(response.status).toBe(400);
  });
});
