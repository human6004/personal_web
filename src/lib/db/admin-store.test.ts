import { afterEach, describe, expect, it } from "vitest";
import { writeEditableProfile, writePost, writeProject } from "./admin-store";
import { resetSqlForTests, setSqlForTests } from "./neon";
import { defaultProfile } from "@/lib/profile";

afterEach(() => {
  resetSqlForTests();
});

describe("database admin store", () => {
  it("upserts posts with parameterized values", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      }
    });

    await writePost({
      slug: "db-post",
      title: "DB post",
      description: "Saved in Neon",
      date: "2026-06-18",
      category: "Tech",
      tags: ["neon"],
      cover: "/images/blog-notes.svg",
      draft: false,
      content: "Post body"
    });

    expect(calls[0]?.query).toContain("on conflict (slug)");
    expect(calls[0]?.params?.slice(0, 3)).toEqual([
      "db-post",
      "DB post",
      "Saved in Neon"
    ]);
  });

  it("upserts projects with optional urls and arrays", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      }
    });

    await writeProject({
      slug: "db-project",
      title: "DB project",
      summary: "Saved in Neon",
      year: "2026",
      role: "Solo",
      stack: ["Next.js"],
      tags: ["portfolio"],
      status: "Published",
      cover: "/images/project-portfolio.svg",
      repoUrl: "",
      demoUrl: "https://example.com",
      caseStudyUrl: "",
      externalUrl: "",
      highlights: ["Works online"],
      featured: true,
      draft: false,
      content: "Case study"
    });

    expect(calls[0]?.query).toContain("on conflict (slug)");
    expect(calls[0]?.params?.[6]).toEqual(["Next.js"]);
    expect(calls[0]?.params?.[11]).toBe("https://example.com");
  });

  it("renames a post slug atomically in one statement", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      }
    });

    await writePost(
      {
        slug: "new-slug",
        title: "DB post",
        description: "Saved in Neon",
        date: "2026-06-18",
        category: "Tech",
        tags: ["neon"],
        cover: "/images/blog-notes.svg",
        draft: false,
        content: "Post body"
      },
      "old-slug"
    );

    expect(calls).toHaveLength(1);
    expect(calls[0]?.query).toContain("delete from posts where slug = $10");
    expect(calls[0]?.query).toContain("on conflict (slug)");
    expect(calls[0]?.params?.[0]).toBe("new-slug");
    expect(calls[0]?.params?.[9]).toBe("old-slug");
  });

  it("does not delete when the slug is unchanged", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      }
    });

    await writePost(
      {
        slug: "same-slug",
        title: "DB post",
        description: "Saved in Neon",
        date: "2026-06-18",
        category: "Tech",
        tags: ["neon"],
        cover: "/images/blog-notes.svg",
        draft: false,
        content: "Post body"
      },
      "same-slug"
    );

    expect(calls).toHaveLength(1);
    expect(calls[0]?.query).not.toContain("delete from posts");
  });

  it("renames a project slug atomically in one statement", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      }
    });

    await writeProject(
      {
        slug: "new-project-slug",
        title: "DB project",
        summary: "Saved in Neon",
        year: "2026",
        role: "Solo",
        stack: ["Next.js"],
        tags: ["portfolio"],
        status: "Published",
        cover: "/images/project-portfolio.svg",
        repoUrl: "",
        demoUrl: "https://example.com",
        caseStudyUrl: "",
        externalUrl: "",
        highlights: ["Works online"],
        featured: true,
        draft: false,
        content: "Case study"
      },
      "old-project-slug"
    );

    expect(calls).toHaveLength(1);
    expect(calls[0]?.query).toContain("delete from projects where slug = $18");
    expect(calls[0]?.query).toContain("on conflict (slug)");
    expect(calls[0]?.params?.[0]).toBe("new-project-slug");
    expect(calls[0]?.params?.[17]).toBe("old-project-slug");
  });

  it("upserts profile JSON fields", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      }
    });

    await writeEditableProfile(defaultProfile);

    expect(calls[0]?.query).toContain("on conflict (id)");
    expect(calls[0]?.params?.[0]).toBe(defaultProfile.name);
    expect(JSON.parse(String(calls[0]?.params?.[5]))).toEqual(defaultProfile.socials);
  });
});
