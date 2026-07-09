import { describe, expect, it } from "vitest";
import { projectInputSchema } from "./schemas";

const baseProject = {
  slug: "demo-project",
  title: "Demo",
  summary: "A demo project",
  year: "2026",
  role: "Solo",
  status: "Published",
  content: "Case study body"
};

describe("projectInputSchema url fields", () => {
  it("rejects javascript: protocol in repoUrl", () => {
    const result = projectInputSchema.safeParse({
      ...baseProject,
      repoUrl: "javascript:alert(1)"
    });

    expect(result.success).toBe(false);
  });

  it("accepts https, internal path and empty urls", () => {
    const parsed = projectInputSchema.parse({
      ...baseProject,
      repoUrl: "https://github.com/example",
      demoUrl: "",
      caseStudyUrl: "/projects/demo-project",
      externalUrl: "http://example.com"
    });

    expect(parsed.repoUrl).toBe("https://github.com/example");
    expect(parsed.caseStudyUrl).toBe("/projects/demo-project");
  });

  it("rejects data: URLs", () => {
    const result = projectInputSchema.safeParse({
      ...baseProject,
      demoUrl: "data:text/html,<script>alert(1)</script>"
    });

    expect(result.success).toBe(false);
  });
});
