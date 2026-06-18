import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/content";
import { ProjectLinks } from "./project-links";

const baseProject: Project = {
  slug: "sample-project",
  title: "Sample project",
  summary: "A sample project.",
  year: "2026",
  role: "Designer and developer",
  stack: ["Next.js"],
  tags: ["portfolio"],
  status: "Published",
  cover: "/images/project-portfolio.svg",
  repoUrl: "https://github.com/example/sample",
  demoUrl: "https://example.com",
  highlights: ["Clear project presentation"],
  featured: true,
  draft: false,
  content: "Project content"
};

describe("ProjectLinks", () => {
  it("renders case study, repo, and demo links when data exists", () => {
    render(<ProjectLinks project={baseProject} />);

    expect(screen.getByRole("link", { name: /view case study/i })).toHaveAttribute(
      "href",
      "/projects/sample-project"
    );
    expect(screen.getByRole("link", { name: /github repo/i })).toHaveAttribute(
      "href",
      baseProject.repoUrl
    );
    expect(screen.getByRole("link", { name: /live demo/i })).toHaveAttribute(
      "href",
      baseProject.demoUrl
    );
  });

  it("uses an explicit case study URL when provided", () => {
    render(
      <ProjectLinks
        project={{
          ...baseProject,
          caseStudyUrl: "/blog/build-personal-website-log"
        }}
      />
    );

    expect(screen.getByRole("link", { name: /view case study/i })).toHaveAttribute(
      "href",
      "/blog/build-personal-website-log"
    );
  });

  it("can hide the case study CTA on detail pages", () => {
    render(<ProjectLinks project={baseProject} showCaseStudy={false} />);

    expect(screen.queryByRole("link", { name: /view case study/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github repo/i })).toBeInTheDocument();
  });

  it("does not render empty optional links", () => {
    render(
      <ProjectLinks
        project={{ ...baseProject, repoUrl: undefined, demoUrl: undefined }}
      />
    );

    expect(screen.queryByRole("link", { name: /github repo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /live demo/i })).not.toBeInTheDocument();
  });

  it("marks private repos without rendering a fake repo link", () => {
    render(
      <ProjectLinks
        project={{
          ...baseProject,
          repoUrl: "private",
          status: "Private repo"
        }}
      />
    );

    expect(screen.getByText(/private repo/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /github repo/i })).not.toBeInTheDocument();
  });

  it("external links open in a new tab with noopener noreferrer", () => {
    render(<ProjectLinks project={baseProject} />);

    const demo = screen.getByRole("link", { name: /live demo/i });
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");
  });
});
