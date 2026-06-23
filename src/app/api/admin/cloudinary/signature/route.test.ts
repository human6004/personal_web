import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/admin/cloudinary/signature", () => {
  it("requires an admin session cookie", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/cloudinary/signature", {
        method: "POST",
        body: JSON.stringify({ paramsToSign: { timestamp: 123 } })
      })
    );

    expect(response.status).toBe(401);
  });
});
