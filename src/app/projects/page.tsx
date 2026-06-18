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
          <p className="max-w-fit rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)]">
            Projects
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
            Project được viết như những case study nhỏ.
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
