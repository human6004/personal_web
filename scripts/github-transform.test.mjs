import { describe, expect, it } from "vitest";
import { repoToProject, rewriteReadme, slugify } from "./github-transform.mjs";

const context = { owner: "human6004", repo: "pac-man", branch: "master" };

const repo = {
  name: "pac-man",
  owner: { login: "human6004" },
  default_branch: "master",
  html_url: "https://github.com/human6004/pac-man",
  description: "  Game pacman  ",
  homepage: null,
  language: "HTML",
  topics: ["game"],
  archived: false,
  created_at: "2026-06-30T09:35:28Z"
};

describe("slugify", () => {
  it("chuyển tên repo về dạng slug hợp lệ", () => {
    expect(slugify("CT219H-LaPTrinhUngDung.NET")).toBe("ct219h-laptrinhungdung-net");
    expect(slugify("personal_web")).toBe("personal-web");
  });

  it("không trả slug rỗng", () => {
    expect(slugify("___")).toBe("repo");
  });
});

describe("rewriteReadme", () => {
  it("đổi ảnh tương đối thành URL raw của repo", () => {
    expect(rewriteReadme("![demo](docs/demo.png)", context)).toBe(
      "![demo](https://raw.githubusercontent.com/human6004/pac-man/master/docs/demo.png)"
    );
  });

  it("gỡ ảnh nằm ngoài host được CSP cho phép", () => {
    expect(rewriteReadme("![badge](https://img.shields.io/x.svg) xong", context)).toBe("xong");
  });

  it("gỡ luôn link chỉ bọc một badge đã bị gỡ", () => {
    expect(rewriteReadme("[![badge](https://img.shields.io/x.svg)](https://ci.example.com)", context)).toBe("");
  });

  it("đổi link tương đối thành URL đầy đủ trên GitHub", () => {
    expect(rewriteReadme("[hướng dẫn](docs/setup.md)", context)).toBe(
      "[hướng dẫn](https://github.com/human6004/pac-man/blob/master/docs/setup.md)"
    );
  });

  it("giữ nguyên link tuyệt đối và anchor", () => {
    const source = "[site](https://example.com) và [mục](#cai-dat)";
    expect(rewriteReadme(source, context)).toBe(source);
  });

  it("gỡ HTML thô và chú thích", () => {
    expect(rewriteReadme('<p align="center">Xin chào</p><!-- ghi chú -->', context)).toBe("Xin chào");
  });

  it("không đụng vào nội dung trong code fence", () => {
    const source = "```html\n<p>giữ nguyên</p>\n[link](docs/a.md)\n```";
    expect(rewriteReadme(source, context)).toBe(source);
  });
});

describe("repoToProject", () => {
  it("map repo sang bản ghi project với slug có tiền tố", () => {
    const project = repoToProject(repo, "# Pac Man\n\nMô tả.");

    expect(project.slug).toBe("gh-pac-man");
    expect(project.summary).toBe("Game pacman");
    expect(project.year).toBe("2026");
    expect(project.stack).toEqual(["HTML", "game"]);
    expect(project.repoUrl).toBe("https://github.com/human6004/pac-man");
    expect(project.demoUrl).toBe("");
    expect(project.draft).toBe(false);
    expect(project.content).toBe("# Pac Man\n\nMô tả.");
  });

  it("có nội dung thay thế khi repo không có README và không có mô tả", () => {
    const project = repoToProject({ ...repo, description: null, topics: [] }, "");

    expect(project.summary).toBe("Repo HTML trên GitHub.");
    expect(project.content).toContain("chưa có README");
  });

  it("đánh dấu repo đã lưu trữ", () => {
    expect(repoToProject({ ...repo, archived: true }, "x").status).toBe("Archived");
  });
});
