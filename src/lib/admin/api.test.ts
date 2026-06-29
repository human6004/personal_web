import { afterEach, describe, expect, it, vi } from "vitest";
import { z, ZodError } from "zod";
import { handleRouteError } from "./api";

async function readBody(response: Response) {
  return (await response.json()) as { error?: string; issues?: unknown[] };
}

describe("handleRouteError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps ZodError to a 400 with field issues", async () => {
    const error = (() => {
      try {
        z.object({ slug: z.string() }).parse({});
        return null;
      } catch (caught) {
        return caught;
      }
    })();

    expect(error).toBeInstanceOf(ZodError);

    const response = handleRouteError(error);
    expect(response.status).toBe(400);

    const body = await readBody(response);
    expect(body.error).toBe("Validation failed");
    expect(Array.isArray(body.issues)).toBe(true);
  });

  it("maps an invalid slug error to a 400 with its message", async () => {
    const response = handleRouteError(
      new Error("Invalid slug. Use lowercase letters, numbers and hyphens.")
    );

    expect(response.status).toBe(400);
    const body = await readBody(response);
    expect(body.error).toMatch(/Invalid slug/);
  });

  it("maps malformed JSON (SyntaxError) to a 400", async () => {
    const response = handleRouteError(new SyntaxError("Unexpected token"));

    expect(response.status).toBe(400);
    const body = await readBody(response);
    expect(body.error).toBe("Invalid JSON body");
  });

  it("logs and returns a generic 500 for unexpected errors", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const cause = new Error("connection refused");

    const response = handleRouteError(cause);

    expect(response.status).toBe(500);
    const body = await readBody(response);
    expect(body.error).toBe("Could not save content");
    expect(spy).toHaveBeenCalledWith("Admin route error:", cause);
  });
});
