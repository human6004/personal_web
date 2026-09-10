// Chuyển repo GitHub + README thô thành bản ghi cho bảng projects.
// Tách khỏi sync-github.mjs vì phần này thuần dữ liệu -> test được, không cần mạng/DB.

const RAW_HOST = "raw.githubusercontent.com";

export function slugify(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "repo";
}

function encodePath(pathname) {
  return pathname
    .split("/")
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/");
}

function isAbsolute(url) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//");
}

// Ảnh: chỉ giữ ảnh nằm trong chính repo. Ảnh tuyệt đối (badge shields, imgur...) bị
// gỡ vì CSP chỉ mở raw.githubusercontent.com - để lại thì trang chỉ hiện ô ảnh vỡ.
function toRawImage(url, { owner, repo, branch }) {
  if (isAbsolute(url)) {
    try {
      return new URL(url).hostname === RAW_HOST ? url : null;
    } catch {
      return null;
    }
  }

  if (url.startsWith("#")) {
    return null;
  }

  const pathname = url.replace(/^\.?\//, "");
  return `https://${RAW_HOST}/${owner}/${repo}/${branch}/${encodePath(pathname)}`;
}

// Link tương đối trong README trỏ vào file của repo. Trên web nó sẽ resolve theo
// /projects/<slug> và ra 404, nên phải đổi về URL đầy đủ trên GitHub.
function toRepoLink(url, { owner, repo, branch }) {
  if (isAbsolute(url) || url.startsWith("#")) {
    return url;
  }

  const pathname = url.replace(/^\.?\//, "");
  return `https://github.com/${owner}/${repo}/blob/${branch}/${encodePath(pathname)}`;
}

function rewriteProse(text, context) {
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[([^\]]*)\]\(\s*<?([^)>\s]+)>?(?:\s+"[^"]*")?\s*\)/g, (match, alt, url) => {
      const rewritten = toRawImage(url, context);
      return rewritten ? `![${alt}](${rewritten})` : "";
    })
    .replace(/\[([^\]]*)\]\(\s*<?([^)>\s]+)>?(?:\s+"[^"]*")?\s*\)/g, (match, label, url) => {
      // Link bọc ngoài một ảnh: để nguyên, ảnh bên trong đã xử lý ở bước trên.
      if (label.startsWith("!")) {
        return match;
      }

      // Nhãn rỗng = link chỉ bọc một badge vừa bị gỡ -> bỏ luôn cho sạch.
      if (!label.trim()) {
        return "";
      }

      return `[${label}](${toRepoLink(url, context)})`;
    })
    .replace(/<\/?[a-zA-Z][^>]*>/g, "");
}

// Nội dung render bằng MDX ở chế độ "md" nên HTML thô không thành thẻ thật, chỉ nằm
// lại dưới dạng rác. Gỡ luôn, nhưng chừa nguyên phần trong code fence.
export function rewriteReadme(markdown, context) {
  return markdown
    .split(/(```[\s\S]*?```)/g)
    .map((part, index) => (index % 2 === 1 ? part : rewriteProse(part, context)))
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function repoToProject(repo, readme) {
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  const language = repo.language ?? "";
  const context = { owner: repo.owner.login, repo: repo.name, branch: repo.default_branch };
  const content = readme?.trim() ? rewriteReadme(readme, context) : "";

  return {
    // Tiền tố gh- để lần sync sau không đè mất project tự viết trong trang admin.
    slug: `gh-${slugify(repo.name)}`,
    title: repo.name.slice(0, 160),
    summary: (repo.description?.trim() || `Repo ${language || "code"} trên GitHub.`).slice(0, 360),
    year: repo.created_at.slice(0, 4),
    role: "Personal repo",
    stack: [language, ...topics].filter(Boolean),
    tags: topics,
    status: repo.archived ? "Archived" : "Public repo",
    cover: "/images/project-portfolio.svg",
    repoUrl: repo.html_url,
    demoUrl: repo.homepage?.trim() || "",
    caseStudyUrl: "",
    externalUrl: "",
    highlights: [],
    featured: false,
    draft: false,
    content: content || `Repo này chưa có README. Xem mã nguồn tại ${repo.html_url}.`
  };
}
