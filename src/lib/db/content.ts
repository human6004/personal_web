import readingTime from "reading-time";
import type { Post, PostCategory, Project } from "@/lib/content";
import { dbQuery } from "./neon";

type ContentQueryOptions = {
  includeDrafts?: boolean;
};

type DatabaseArray = string[] | string | null;

type PostRow = {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string | Date;
  category: string;
  tags: DatabaseArray;
  cover: string;
  draft: boolean | null;
};

type ProjectRow = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: string;
  role: string;
  stack: DatabaseArray;
  tags: DatabaseArray;
  status: string;
  cover: string;
  repo_url: string | null;
  demo_url: string | null;
  case_study_url: string | null;
  external_url: string | null;
  highlights: DatabaseArray;
  featured: boolean | null;
  draft: boolean | null;
};

function toIsoDate(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

function toStringArray(value: DatabaseArray) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.replace(/^"|"$/g, "").trim())
      .filter(Boolean);
  }

  return [];
}

function mapPostRow(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: toIsoDate(row.date),
    category: row.category as PostCategory,
    tags: toStringArray(row.tags),
    cover: row.cover,
    draft: Boolean(row.draft),
    readingTime: readingTime(row.content).text,
    content: row.content
  };
}

function mapProjectRow(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    year: row.year,
    role: row.role,
    stack: toStringArray(row.stack),
    tags: toStringArray(row.tags),
    status: row.status,
    cover: row.cover,
    repoUrl: row.repo_url || undefined,
    demoUrl: row.demo_url || undefined,
    caseStudyUrl: row.case_study_url || undefined,
    externalUrl: row.external_url || undefined,
    highlights: toStringArray(row.highlights),
    featured: Boolean(row.featured),
    draft: Boolean(row.draft),
    content: row.content
  };
}

export async function getDatabasePosts(options: ContentQueryOptions = {}) {
  const rows = await dbQuery<PostRow>(
    options.includeDrafts
      ? `select slug, title, description, content, date, category, tags, cover, draft
         from posts
         order by date desc, updated_at desc`
      : `select slug, title, description, content, date, category, tags, cover, draft
         from posts
         where draft = false
         order by date desc, updated_at desc`
  );

  return rows.map(mapPostRow);
}

export async function getDatabasePostBySlug(
  slug: string,
  options: ContentQueryOptions = {}
) {
  const rows = await dbQuery<PostRow>(
    options.includeDrafts
      ? `select slug, title, description, content, date, category, tags, cover, draft
         from posts
         where slug = $1
         limit 1`
      : `select slug, title, description, content, date, category, tags, cover, draft
         from posts
         where slug = $1 and draft = false
         limit 1`,
    [slug]
  );

  return rows[0] ? mapPostRow(rows[0]) : null;
}

export async function getDatabaseProjects(options: ContentQueryOptions = {}) {
  const rows = await dbQuery<ProjectRow>(
    options.includeDrafts
      ? `select slug, title, summary, content, year, role, stack, tags, status,
            cover, repo_url, demo_url, case_study_url, external_url,
            highlights, featured, draft
         from projects
         order by year desc, updated_at desc`
      : `select slug, title, summary, content, year, role, stack, tags, status,
            cover, repo_url, demo_url, case_study_url, external_url,
            highlights, featured, draft
         from projects
         where draft = false
         order by year desc, updated_at desc`
  );

  return rows.map(mapProjectRow);
}

export async function getDatabaseProjectBySlug(
  slug: string,
  options: ContentQueryOptions = {}
) {
  const rows = await dbQuery<ProjectRow>(
    options.includeDrafts
      ? `select slug, title, summary, content, year, role, stack, tags, status,
            cover, repo_url, demo_url, case_study_url, external_url,
            highlights, featured, draft
         from projects
         where slug = $1
         limit 1`
      : `select slug, title, summary, content, year, role, stack, tags, status,
            cover, repo_url, demo_url, case_study_url, external_url,
            highlights, featured, draft
         from projects
         where slug = $1 and draft = false
         limit 1`,
    [slug]
  );

  return rows[0] ? mapProjectRow(rows[0]) : null;
}
