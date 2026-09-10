import { neon } from "@neondatabase/serverless";
import { loadLocalEnv } from "./load-env.mjs";
import { repoToProject } from "./github-transform.mjs";

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error("DATABASE_URL is required. Add it to .env.local or your shell.");
  process.exit(1);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const user = (args.find((arg) => !arg.startsWith("--")) || process.env.GITHUB_USER || "human6004").trim();
const sql = neon(databaseUrl);

// Token là tuỳ chọn: chỉ để nâng rate limit 60 -> 5000 request/giờ khi repo nhiều.
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "personal-web-sync"
};

if (process.env.GITHUB_TOKEN?.trim()) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
}

async function githubJson(url) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub ${response.status} ${response.statusText} for ${url}`);
  }

  return response.json();
}

async function fetchRepos() {
  const repos = [];

  for (let page = 1; ; page += 1) {
    const batch = await githubJson(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&page=${page}&sort=updated`
    );

    repos.push(...batch);

    if (batch.length < 100) {
      return repos;
    }
  }
}

async function fetchReadme(repo) {
  const response = await fetch(
    `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`,
    { headers: { ...headers, Accept: "application/vnd.github.raw" } }
  );

  if (response.status === 404) {
    return "";
  }

  if (!response.ok) {
    throw new Error(`GitHub ${response.status} ${response.statusText} for README of ${repo.name}`);
  }

  return response.text();
}

async function upsertProject(project) {
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
      project.slug,
      project.title,
      project.summary,
      project.content,
      project.year,
      project.role,
      project.stack,
      project.tags,
      project.status,
      project.cover,
      project.repoUrl,
      project.demoUrl,
      project.caseStudyUrl,
      project.externalUrl,
      project.highlights,
      project.featured,
      project.draft
    ]
  );
}

const repos = (await fetchRepos()).filter((repo) => !repo.fork && !repo.archived);

console.log(`Found ${repos.length} repos to sync for ${user}.`);

for (const repo of repos) {
  const project = repoToProject(repo, await fetchReadme(repo));

  if (!dryRun) {
    await upsertProject(project);
  }

  console.log(`  ${project.slug}  <-  ${repo.name}  (${project.content.length} ký tự)`);
}

console.log(dryRun ? `Dry run: ${repos.length} repos, chưa ghi gì vào DB.` : `Synced ${repos.length} repos into projects.`);
