import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkAndConsumeLoginAttempt, clearLoginAttempts } from "./rate-limit";
import { resetSqlForTests, setSqlForTests } from "@/lib/db/neon";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgres://test");
});

afterEach(() => {
  resetSqlForTests();
  vi.unstubAllEnvs();
});

describe("login rate limit", () => {
  it("allows when not locked", async () => {
    setSqlForTests({
      query: async () => [{ attempts: 1, locked_until: null, locked: false }]
    });

    const result = await checkAndConsumeLoginAttempt("1.2.3.4");
    expect(result.ok).toBe(true);
  });

  it("blocks with retry-after when locked", async () => {
    const lockedUntil = new Date(Date.now() + 60_000).toISOString();
    setSqlForTests({
      query: async () => [{ attempts: 6, locked_until: lockedUntil, locked: true }]
    });

    const result = await checkAndConsumeLoginAttempt("1.2.3.4");
    expect(result.ok).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
  });

  it("passes ip and window params to the query", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [{ attempts: 1, locked_until: null, locked: false }];
      }
    });

    await checkAndConsumeLoginAttempt("9.9.9.9");
    expect(calls[0]?.query).toContain("insert into login_attempts");
    expect(calls[0]?.params?.[0]).toBe("9.9.9.9");
  });

  it("fails open when the database throws", async () => {
    setSqlForTests({
      query: async () => {
        throw new Error("db down");
      }
    });

    const result = await checkAndConsumeLoginAttempt("1.2.3.4");
    expect(result.ok).toBe(true);
  });

  it("is a no-op without an ip or database url", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const result = await checkAndConsumeLoginAttempt("");
    expect(result.ok).toBe(true);
    await clearLoginAttempts(""); // không ném
  });
});
