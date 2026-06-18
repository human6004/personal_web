import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  verifyAdminPassword,
  verifySessionToken
} from "./auth";

describe("admin auth helpers", () => {
  it("verifies password using constant-time comparison", () => {
    expect(verifyAdminPassword("secret", "secret")).toBe(true);
    expect(verifyAdminPassword("wrong", "secret")).toBe(false);
  });

  it("signs and verifies an admin session token", () => {
    const token = createSessionToken("long-random-secret", 60);

    expect(verifySessionToken(token, "long-random-secret")).toBe(true);
    expect(verifySessionToken(token, "different-secret")).toBe(false);
  });
});
