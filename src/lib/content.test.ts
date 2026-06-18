import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllPosts,
  getAllProjects,
  getAllTags,
  getFeaturedProjects,
  getPostBySlug,
  getProjectBySlug,
  isPrivateRepo,
  parseFrontmatter
} from "./content";

const draftPostPath = path.join(process.cwd(), "content", "posts", "draft-admin-test.mdx");
const draftProjectPath = path.join(
  process.cwd(),
  "content",
  "projects",
  "draft-admin-project.mdx"
);

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "");
});

afterEach(() => {
  fs.rmSync(draftPostPath, { force: true });
  fs.rmSync(draftProjectPath, { force: true });
  vi.unstubAllEnvs();
});

describe("content loading", () => {
  it("parses simple local frontmatter without a YAML dependency", () => {
    const parsed = parseFrontmatter(`---
title: "Sample"
featured: true
tags:
  - one
  - two
---

Body content`);

    expect(parsed.data).toMatchObject({
      title: "Sample",
      featured: true,
      tags: ["one", "two"]
    });
    expect(parsed.content).toBe("Body content");
  });

  it("falls back to content when frontmatter is missing or incomplete", () => {
    expect(parseFrontmatter("Plain note").data).toEqual({});
    expect(parseFrontmatter("---\ntitle: Broken").content).toContain("Broken");
  });

  it("loads sample posts sorted by newest date", async () => {
    const posts = await getAllPosts();

    expect(posts).toHaveLength(3);
    expect(posts[0]?.date >= posts[1]?.date).toBe(true);
    expect(posts.every((post) => post.slug && post.title)).toBe(true);
  });

  it("loads a post by slug with reading time and tags", async () => {
    const post = await getPostBySlug("build-personal-website-log");

    expect(post?.title).toContain("personal website");
    expect(post?.readingTime).toMatch(/min read/);
    expect(post?.tags).toContain("project-log");
  });

  it("returns null for missing content slugs", async () => {
    expect(await getPostBySlug("missing-post")).toBeNull();
    expect(await getProjectBySlug("missing-project")).toBeNull();
  });

  it("hides draft content from public lists and direct slug lookup", async () => {
    fs.writeFileSync(
      draftPostPath,
      `---
title: "Draft post"
description: "Private draft"
date: "2026-06-18"
category: "Learning"
tags:
  - draft
cover: "/images/blog-notes.svg"
draft: true
---

Draft body`,
      "utf8"
    );
    fs.writeFileSync(
      draftProjectPath,
      `---
title: "Draft project"
summary: "Private draft project"
year: "2026"
role: "Solo"
stack:
  - Next.js
tags:
  - draft
status: "Draft"
cover: "/images/project-portfolio.svg"
highlights:
  - Hidden on public site
featured: false
draft: true
---

Draft case study`,
      "utf8"
    );

    expect(
      (await getAllPosts()).some((post) => post.slug === "draft-admin-test")
    ).toBe(false);
    expect(await getPostBySlug("draft-admin-test")).toBeNull();
    expect(
      (await getPostBySlug("draft-admin-test", { includeDrafts: true }))?.title
    ).toBe("Draft post");

    expect(
      (await getAllProjects()).some(
        (project) => project.slug === "draft-admin-project"
      )
    ).toBe(false);
    expect(await getProjectBySlug("draft-admin-project")).toBeNull();
    expect(
      (await getProjectBySlug("draft-admin-project", { includeDrafts: true }))
        ?.title
    ).toBe("Draft project");
  });

  it("loads projects with optional links and featured projects", async () => {
    const projects = await getAllProjects();
    const featured = await getFeaturedProjects();
    const portfolio = await getProjectBySlug("personal-portfolio");

    expect(projects).toHaveLength(2);
    expect(featured.length).toBeGreaterThan(0);
    expect(portfolio?.repoUrl).toMatch(/^https:\/\//);
    expect(portfolio?.highlights.length).toBeGreaterThan(1);
  });

  it("limits featured projects and aggregates tags across content types", async () => {
    const featured = await getFeaturedProjects(1);
    const tags = await getAllTags();

    expect(featured).toHaveLength(1);
    expect(tags).toEqual([...tags].sort((a, b) => a.localeCompare(b)));
    expect(tags).toContain("personal-site");
    expect(tags).toContain("tools");
  });

  it("detects private repositories without making fake links", () => {
    expect(isPrivateRepo({ repoUrl: "private", status: "Private repo" })).toBe(
      true
    );
    expect(
      isPrivateRepo({
        repoUrl: "https://github.com/example/repo",
        status: "Published"
      })
    ).toBe(false);
  });
});
