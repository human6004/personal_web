import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { loadLocalEnv } from "./scripts/load-env.mjs";

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const dir = path.join(process.cwd(), "_articles");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f.startsWith("gh-"));

const articles = [];
for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const match = raw.match(/^SUMMARY:\s*(.+)\r?\n---\r?\n([\s\S]+)$/);
  if (!match) {
    console.error(`Bad format: ${file}`);
    process.exit(1);
  }
  articles.push({
    slug: file.replace(/\.md$/, ""),
    summary: match[1].trim(),
    content: match[2].trim()
  });
}

if (articles.length !== 18) {
  console.error(`Expected 18 articles, got ${articles.length}`);
  process.exit(1);
}

const existing = await sql.query(
  `select slug from projects where slug like 'gh-%' order by slug`
);
const existingSlugs = new Set(existing.map((r) => r.slug));

for (const article of articles) {
  if (!existingSlugs.has(article.slug)) {
    console.error(`Refusing to create new slug: ${article.slug}`);
    process.exit(1);
  }
}

for (const article of articles) {
  const result = await sql.query(
    `update projects
        set content = $1,
            summary = $2,
            updated_at = now()
      where slug = $3
        and slug like 'gh-%'
        and slug not in ('pacman-search-algorithms', 'personal-portfolio')`,
    [article.content, article.summary, article.slug]
  );
  const n = Array.isArray(result) ? result.length : result?.rowCount;
  console.log(`updated ${article.slug}  content=${article.content.length}  summary=${article.summary.length}`);
}

const check = await sql.query(
  `select slug, length(content) as len, length(summary) as slen,
          (position('<' in content) > 0) as has_lt
     from projects
    where slug like 'gh-%'
    order by slug`
);

console.log("\nDB after update:");
for (const row of check) {
  const flag = row.len > 800 && !row.has_lt ? "ok" : "FAIL";
  console.log(`  ${row.slug}  len=${row.len}  slen=${row.slen}  lt=${row.has_lt}  ${flag}`);
}

const manual = await sql.query(
  `select slug, length(content) as len from projects
    where slug in ('pacman-search-algorithms', 'personal-portfolio')
    order by slug`
);
console.log("\nManual rows (must be unchanged by this script's target list):");
for (const row of manual) console.log(`  ${row.slug}  len=${row.len}`);

if (check.length !== 18) {
  console.error(`Expected 18 gh- rows, got ${check.length}`);
  process.exit(1);
}

const bad = check.filter((r) => r.len <= 800 || r.has_lt);
if (bad.length) {
  console.error("Verification failed:", bad.map((r) => r.slug).join(", "));
  process.exit(1);
}

console.log("\nUpsert-content complete: 18 gh- rows, content > 800, no '<'.");
