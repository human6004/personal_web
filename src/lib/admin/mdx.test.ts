import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/lib/content";
import { serializeMdx } from "./mdx";

describe("admin MDX serialization", () => {
  it("roundtrips scalar, array, boolean frontmatter and body content", () => {
    const source = serializeMdx(
      {
        title: "A post",
        draft: false,
        tags: ["learning", "notes"],
        cover: "/images/blog-notes.svg"
      },
      "## Body\n\nHello admin."
    );

    const parsed = parseFrontmatter(source);

    expect(parsed.data).toMatchObject({
      title: "A post",
      draft: false,
      tags: ["learning", "notes"],
      cover: "/images/blog-notes.svg"
    });
    expect(parsed.content).toBe("## Body\n\nHello admin.");
  });

  it("omits empty optional values while preserving false booleans", () => {
    const source = serializeMdx(
      {
        title: "Project",
        demoUrl: "",
        repoUrl: undefined,
        featured: false
      },
      "Content"
    );

    expect(source).not.toContain("demoUrl");
    expect(source).not.toContain("repoUrl");
    expect(source).toContain("featured: false");
  });
});
