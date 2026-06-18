import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/admin/content", () => {
  it("requires an admin session cookie", async () => {
    const response = await GET(new Request("http://localhost/api/admin/content"));

    expect(response.status).toBe(401);
  });
});
