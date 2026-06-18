import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error("DATABASE_URL is required. Add it to .env.local or your shell.");
  process.exit(1);
}

const root = process.cwd();
const sql = neon(databaseUrl);

function parseScalar(value) {
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

function parseFrontmatter(source) {
  if (!source.startsWith("---")) {
    return { data: {}, content: source.trim() };
  }

  const endIndex = source.indexOf("\n---", 3);

  if (endIndex === -1) {
    return { data: {}, content: source.trim() };
  }

  const frontmatter = source.slice(3, endIndex).trim();
  const content = source.slice(endIndex + 4).trim();
  const data = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue = ""] = match;

    if (rawValue.trim()) {
      data[key] = parseScalar(rawValue);
      continue;
    }

    const values = [];

    while (lines[index + 1]?.trim().startsWith("- ")) {
      index += 1;
      values.push(parseScalar(lines[index].trim().slice(2)));
    }

    data[key] = values;
  }

  return { data, content };
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }

  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function toStringValue(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toBooleanValue(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function readMdxEntries(collection) {
  const dir = path.join(root, "content", collection);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const source = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = parseFrontmatter(source);
      return { slug, data: parsed.data, content: parsed.content };
    });
}

async function importProfile() {
  const profilePath = path.join(root, "content", "profile.json");

  if (!fs.existsSync(profilePath)) {
    console.warn("content/profile.json not found, skipping profile import.");
    return false;
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, "utf8"));

  await sql.query(
    `insert into profiles (
       id, name, title, description, tagline, english_tagline, socials, home, about
     )
     values ('main', $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb)
     on conflict (id) do update set
       name = excluded.name,
       title = excluded.title,
       description = excluded.description,
       tagline = excluded.tagline,
       english_tagline = excluded.english_tagline,
       socials = excluded.socials,
       home = excluded.home,
       about = excluded.about,
       updated_at = now()`,
    [
      profile.name,
      profile.title,
      profile.description,
      profile.tagline,
      profile.englishTagline || "",
      JSON.stringify(profile.socials),
      JSON.stringify(profile.home),
      JSON.stringify(profile.about)
    ]
  );

  return true;
}

async function importPosts() {
  const entries = readMdxEntries("posts");

  for (const entry of entries) {
    await sql.query(
      `insert into posts (
         slug, title, description, content, date, category, tags, cover, draft
       )
       values ($1, $2, $3, $4, $5::date, $6, $7::text[], $8, $9)
       on conflict (slug) do update set
         title = excluded.title,
         description = excluded.description,
         content = excluded.content,
         date = excluded.date,
         category = excluded.category,
         tags = excluded.tags,
         cover = excluded.cover,
         draft = excluded.draft,
         updated_at = now()`,
      [
        entry.slug,
        toStringValue(entry.data.title, "Untitled post"),
        toStringValue(entry.data.description),
        entry.content,
        toStringValue(entry.data.date, new Date().toISOString().slice(0, 10)),
        toStringValue(entry.data.category, "Learning"),
        toArray(entry.data.tags),
        toStringValue(entry.data.cover, "/images/blog-notes.svg"),
        toBooleanValue(entry.data.draft)
      ]
    );
  }

  return entries.length;
}

async function importProjects() {
  const entries = readMdxEntries("projects");

  for (const entry of entries) {
    await sql.query(
      `insert into projects (
         slug, title, summary, content, year, role, stack, tags, status, cover,
         repo_url, demo_url, case_study_url, external_url, highlights, featured, draft
       )
       values (
         $1, $2, $3, $4, $5, $6, $7::text[], $8::text[], $9, $10,
         $11, $12, $13, $14, $15::text[], $16, $17
       )
       on conflict (slug) do update set
         title = excluded.title,
         summary = excluded.summary,
         content = excluded.content,
         year = excluded.year,
         role = excluded.role,
         stack = excluded.stack,
         tags = excluded.tags,
         status = excluded.status,
         cover = excluded.cover,
         repo_url = excluded.repo_url,
         demo_url = excluded.demo_url,
         case_study_url = excluded.case_study_url,
         external_url = excluded.external_url,
         highlights = excluded.highlights,
         featured = excluded.featured,
         draft = excluded.draft,
         updated_at = now()`,
      [
        entry.slug,
        toStringValue(entry.data.title, "Untitled project"),
        toStringValue(entry.data.summary),
        entry.content,
        toStringValue(entry.data.year),
        toStringValue(entry.data.role),
        toArray(entry.data.stack),
        toArray(entry.data.tags),
        toStringValue(entry.data.status, "Draft"),
        toStringValue(entry.data.cover, "/images/project-portfolio.svg"),
        toStringValue(entry.data.repoUrl),
        toStringValue(entry.data.demoUrl),
        toStringValue(entry.data.caseStudyUrl),
        toStringValue(entry.data.externalUrl),
        toArray(entry.data.highlights),
        toBooleanValue(entry.data.featured),
        toBooleanValue(entry.data.draft)
      ]
    );
  }

  return entries.length;
}

const profileImported = await importProfile();
const postCount = await importPosts();
const projectCount = await importProjects();

console.log(
  `Imported ${profileImported ? "profile, " : ""}${postCount} posts, ${projectCount} projects.`
);
