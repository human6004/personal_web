import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/admin/cloudinary/resources", () => {
  it("requires an admin session cookie", async () => {
    const response = await GET(
      new Request("http://localhost/api/admin/cloudinary/resources")
    );

    expect(response.status).toBe(401);
  });
});
