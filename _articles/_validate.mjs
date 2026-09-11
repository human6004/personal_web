import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "_articles");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f.startsWith("gh-"));

const headings = [
  "## Project này là gì?",
  "## Vì sao làm project này?",
  "## Vấn đề hoặc mục tiêu cần giải quyết",
  "## Vai trò của tôi trong project",
  "## Kết quả và những gì học được"
];

const expected = [
  "gh-personal-web",
  "gh-soulspace",
  "gh-todo-app",
  "gh-pac-man",
  "gh-aicon2026-stock-prediction",
  "gh-stock-prediction-ml",
  "gh-kag-medical-assistant",
  "gh-hoc-kag",
  "gh-ct219h-laptrinhungdung-net",
  "gh-web",
  "gh-ct109h",
  "gh-ct175h",
  "gh-thaycang",
  "gh-titv-java",
  "gh-dsa",
  "gh-kndh",
  "gh-ctu-laptrinhungdungjava",
  "gh-java"
];

const articles = [];
const errors = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const match = raw.match(/^SUMMARY:\s*(.+)\r?\n---\r?\n([\s\S]+)$/);
  if (!match) {
    errors.push(`${file}: missing SUMMARY/--- wrapper`);
    continue;
  }
  const summary = match[1].trim();
  const content = match[2].trim();
  const slug = file.replace(/\.md$/, "");
  const words = content.split(/\s+/).filter(Boolean).length;
  const hasLt = content.includes("<") || summary.includes("<");
  const missingHead = headings.filter((h) => !content.includes(h));
  const htmlish = /<\/?[a-zA-Z]/.test(content);

  if (summary.length > 360) errors.push(`${slug}: summary ${summary.length} > 360`);
  if (content.length <= 800) errors.push(`${slug}: content ${content.length} <= 800`);
  if (words < 300) errors.push(`${slug}: words ${words} < 300`);
  if (words > 700) errors.push(`${slug}: words ${words} > 700`);
  if (hasLt) errors.push(`${slug}: contains <`);
  if (htmlish) errors.push(`${slug}: looks like HTML tag`);
  if (missingHead.length) errors.push(`${slug}: missing ${missingHead.join(" | ")}`);

  articles.push({ slug, summary, content, words, len: content.length, slen: summary.length });
}

const found = new Set(articles.map((a) => a.slug));
for (const slug of expected) {
  if (!found.has(slug)) errors.push(`missing file ${slug}.md`);
}

console.log("COUNT", articles.length);
for (const a of articles.sort((x, y) => x.slug.localeCompare(y.slug))) {
  console.log(`${a.slug}  words=${a.words}  chars=${a.len}  summary=${a.slen}`);
}
if (errors.length) {
  console.log("\nERRORS");
  for (const e of errors) console.log(" -", e);
  process.exitCode = 1;
} else {
  console.log("\nOK all 18 articles");
}

fs.writeFileSync(path.join(dir, "bundle.json"), JSON.stringify(articles, null, 2), "utf8");
