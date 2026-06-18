import fs from "node:fs";
import path from "node:path";
import readingTime from "reading-time";
import {
  getDatabasePostBySlug,
  getDatabasePosts,
  getDatabaseProjectBySlug,
  getDatabaseProjects
} from "./db/content";
import { hasDatabaseUrl } from "./db/neon";

const contentRoot = path.join(process.cwd(), "content");

export type ContentCollection = "posts" | "projects";

export type PostCategory =
  | "Tech"
  | "Learning"
  | "Reading Notes"
  | "Projects"
  | "Tools"
  | "Life";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: PostCategory;
  tags: string[];
  cover: string;
  draft: boolean;
  readingTime: string;
  content: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  stack: string[];
  tags: string[];
  status: string;
  cover: string;
  repoUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
  externalUrl?: string;
  highlights: string[];
  featured: boolean;
  draft: boolean;
  content: string;
};

type RawEntry = {
  slug: string;
  data: Record<string, unknown>;
  content: string;
};

type ParsedFrontmatter = {
  data: Record<string, unknown>;
  content: string;
};

function collectionDir(collection: ContentCollection) {
  return path.join(contentRoot, collection);
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim());
  }

  return [];
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toBooleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function parseScalar(value: string) {
  const trimmed = value.trim();
  const unquoted = trimmed.replace(/^["']|["']$/g, "");

  if (unquoted === "true") {
    return true;
  }

  if (unquoted === "false") {
    return false;
  }

  return unquoted;
}

export function parseFrontmatter(source: string): ParsedFrontmatter {
  if (!source.startsWith("---")) {
    return {
      data: {},
      content: source.trim()
    };
  }

  const endIndex = source.indexOf("\n---", 3);

  if (endIndex === -1) {
    return {
      data: {},
      content: source.trim()
    };
  }

  const frontmatter = source.slice(3, endIndex).trim();
  const content = source.slice(endIndex + 4).trim();
  const data: Record<string, unknown> = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue = ""] = match;

    if (rawValue.trim()) {
      data[key] = parseScalar(rawValue);
      continue;
    }

    const values: string[] = [];

    while (lines[index + 1]?.trim().startsWith("- ")) {
      index += 1;
      values.push(parseScalar(lines[index].trim().slice(2)) as string);
    }

    data[key] = values;
  }

  return { data, content };
}

function getSlugs(collection: ContentCollection) {
  const dir = collectionDir(collection);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readEntry(collection: ContentCollection, slug: string): RawEntry | null {
  const filePath = path.join(collectionDir(collection), `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(source);

  return {
    slug,
    data: parsed.data,
    content: parsed.content.trim()
  };
}

function mapPost(entry: RawEntry): Post {
  return {
    slug: entry.slug,
    title: toStringValue(entry.data.title, "Untitled post"),
    description: toStringValue(entry.data.description),
    date: toStringValue(entry.data.date),
    category: toStringValue(entry.data.category, "Learning") as PostCategory,
    tags: toArray(entry.data.tags),
    cover: toStringValue(entry.data.cover, "/images/blog-notes.svg"),
    draft: toBooleanValue(entry.data.draft),
    readingTime: readingTime(entry.content).text,
    content: entry.content
  };
}

function mapProject(entry: RawEntry): Project {
  return {
    slug: entry.slug,
    title: toStringValue(entry.data.title, "Untitled project"),
    summary: toStringValue(entry.data.summary),
    year: toStringValue(entry.data.year),
    role: toStringValue(entry.data.role),
    stack: toArray(entry.data.stack),
    tags: toArray(entry.data.tags),
    status: toStringValue(entry.data.status, "Draft"),
    cover: toStringValue(entry.data.cover, "/images/project-portfolio.svg"),
    repoUrl: toStringValue(entry.data.repoUrl) || undefined,
    demoUrl: toStringValue(entry.data.demoUrl) || undefined,
    caseStudyUrl: toStringValue(entry.data.caseStudyUrl) || undefined,
    externalUrl: toStringValue(entry.data.externalUrl) || undefined,
    highlights: toArray(entry.data.highlights),
    featured: toBooleanValue(entry.data.featured),
    draft: toBooleanValue(entry.data.draft),
    content: entry.content
  };
}

function getAllPostsFromFiles(options: { includeDrafts?: boolean } = {}) {
  return getSlugs("posts")
    .map((slug) => readEntry("posts", slug))
    .filter((entry): entry is RawEntry => Boolean(entry))
    .map(mapPost)
    .filter((post) => options.includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function getPostBySlugFromFiles(
  slug: string,
  options: { includeDrafts?: boolean } = {}
) {
  const entry = readEntry("posts", slug);
  const post = entry ? mapPost(entry) : null;

  if (!post || (!options.includeDrafts && post.draft)) {
    return null;
  }

  return post;
}

function getAllProjectsFromFiles(options: { includeDrafts?: boolean } = {}) {
  return getSlugs("projects")
    .map((slug) => readEntry("projects", slug))
    .filter((entry): entry is RawEntry => Boolean(entry))
    .map(mapProject)
    .filter((project) => options.includeDrafts || !project.draft)
    .sort((a, b) => b.year.localeCompare(a.year));
}

function getProjectBySlugFromFiles(
  slug: string,
  options: { includeDrafts?: boolean } = {}
) {
  const entry = readEntry("projects", slug);
  const project = entry ? mapProject(entry) : null;

  if (!project || (!options.includeDrafts && project.draft)) {
    return null;
  }

  return project;
}

export async function getAllPosts(options: { includeDrafts?: boolean } = {}) {
  return hasDatabaseUrl()
    ? getDatabasePosts(options)
    : getAllPostsFromFiles(options);
}

export async function getPostBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
) {
  return hasDatabaseUrl()
    ? getDatabasePostBySlug(slug, options)
    : getPostBySlugFromFiles(slug, options);
}

export async function getAllProjects(options: { includeDrafts?: boolean } = {}) {
  return hasDatabaseUrl()
    ? getDatabaseProjects(options)
    : getAllProjectsFromFiles(options);
}

export async function getProjectBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
) {
  return hasDatabaseUrl()
    ? getDatabaseProjectBySlug(slug, options)
    : getProjectBySlugFromFiles(slug, options);
}

export async function getFeaturedProjects(limit = 3) {
  return (await getAllProjects())
    .filter((project) => project.featured)
    .slice(0, limit);
}

export async function getAllTags() {
  const tags = new Set<string>();
  (await getAllPosts()).forEach((post) =>
    post.tags.forEach((tag) => tags.add(tag))
  );
  (await getAllProjects()).forEach((project) =>
    project.tags.forEach((tag) => tags.add(tag))
  );
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export function isPrivateRepo(project: Pick<Project, "repoUrl" | "status">) {
  const repoUrl = project.repoUrl?.toLowerCase().trim();
  const status = project.status.toLowerCase();
  return repoUrl === "private" || status.includes("private repo");
}
