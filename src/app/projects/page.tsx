import type { Metadata } from "next";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/sections/reveal";
import { getAllProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Projects",
    description:
      "Các project cá nhân và project học tập được trình bày theo hướng case study ngắn gọn, có GitHub repo và demo nếu có.",
    path: "/projects"
  });
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const tags = Array.from(new Set(projects.flatMap((project) => project.tags)));

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-6">
          <p className="eyebrow">Work</p>
          <h1 className="display-hero max-w-5xl">
            Project viết như những <em>case study</em> nhỏ.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Mỗi project không chỉ liệt kê công nghệ, mà còn ghi lại lý do làm,
            vai trò, mục tiêu, kết quả và bài học.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05}>
            <ProjectCard project={project} priority={index === 0} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
