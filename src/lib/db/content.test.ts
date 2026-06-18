import { afterEach, describe, expect, it } from "vitest";
import {
  getDatabasePostBySlug,
  getDatabasePosts,
  getDatabaseProjectBySlug,
  getDatabaseProjects
} from "./content";
import { resetSqlForTests, setSqlForTests } from "./neon";

afterEach(() => {
  resetSqlForTests();
});

describe("database content queries", () => {
  it("maps post rows and hides drafts by default", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [
          {
            slug: "test-post",
            title: "Test post",
            description: "Short description",
            content: "Hello from the database",
            date: "2026-06-18",
            category: "Tech",
            tags: ["db", "neon"],
            cover: "/images/blog-notes.svg",
            draft: false
          }
        ];
      }
    });

    const posts = await getDatabasePosts();

    expect(calls[0]?.query).toContain("where draft = false");
    expect(posts[0]).toMatchObject({
      slug: "test-post",
      category: "Tech",
      tags: ["db", "neon"],
      draft: false
    });
    expect(posts[0]?.readingTime).toMatch(/min read/);
  });

  it("queries a post by slug with params", async () => {
    const calls: Array<{ query: string; params?: unknown[] }> = [];
    setSqlForTests({
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      }
    });

    const post = await getDatabasePostBySlug("missing");

    expect(post).toBeNull();
    expect(calls[0]?.params).toEqual(["missing"]);
    expect(calls[0]?.query).toContain("slug = $1");
  });

  it("maps project rows and optional links", async () => {
    setSqlForTests({
      query: async () => [
        {
          slug: "db-project",
          title: "DB project",
          summary: "Summary",
          content: "Case study",
          year: "2026",
          role: "Solo",
          stack: ["Next.js"],
          tags: ["portfolio"],
          status: "Published",
          cover: "/images/project-portfolio.svg",
          repo_url: "",
          demo_url: "https://example.com",
          case_study_url: "",
          external_url: "",
          highlights: ["Imported from Neon"],
          featured: true,
          draft: false
        }
      ]
    });

    const projects = await getDatabaseProjects();
    const project = await getDatabaseProjectBySlug("db-project");

    expect(projects[0]?.repoUrl).toBeUndefined();
    expect(project?.demoUrl).toBe("https://example.com");
    expect(project?.featured).toBe(true);
  });
});
