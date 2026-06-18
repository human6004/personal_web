import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveContentFilePath, validateSlug } from "./paths";

describe("admin content path safety", () => {
  it("accepts lowercase slugs with numbers and hyphens", () => {
    expect(validateSlug("build-personal-site-2026")).toBe(
      "build-personal-site-2026"
    );
  });

  it("rejects unsafe slugs", () => {
    expect(() => validateSlug("../secret")).toThrow(/Invalid slug/);
    expect(() => validateSlug("HelloWorld")).toThrow(/Invalid slug/);
    expect(() => validateSlug("has space")).toThrow(/Invalid slug/);
  });

  it("keeps resolved content paths inside the requested collection", () => {
    const root = path.join("D:", "workspace", "site");
    const resolved = resolveContentFilePath("posts", "safe-post", root);

    expect(resolved).toContain(path.join("content", "posts", "safe-post.mdx"));
  });

  it("rejects path traversal before resolving a content path", () => {
    expect(() => resolveContentFilePath("projects", "..", process.cwd())).toThrow(
      /Invalid slug/
    );
  });
});
