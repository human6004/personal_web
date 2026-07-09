import type { Metadata } from "next";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/sections/reveal";
import { Badge } from "@/components/ui/badge";
import { getAllProjects } from "@/lib/content";
import { categoryColor } from "@/lib/category";
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
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-4">
          <p className="eyebrow">Work</p>
          <h1 className="display-section max-w-4xl">
            Project viết như những <em>case study</em> nhỏ.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            Mỗi project không chỉ liệt kê công nghệ, mà còn ghi lại lý do làm,
            vai trò, mục tiêu, kết quả và bài học.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} accent={categoryColor(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05}>
            <ProjectCard project={project} priority={index === 0} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
