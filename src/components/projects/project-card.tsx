import type { Project } from "@/lib/content";
import { ContentCard } from "@/components/ui/content-card";
import { Meta } from "@/components/ui/meta";
import { ProjectLinks } from "./project-links";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <ContentCard
      href={`/projects/${project.slug}`}
      title={project.title}
      cover={project.cover}
      coverAlt={`Visual for ${project.title}`}
      ariaLabel={`View case study: ${project.title}`}
      summary={project.summary}
      priority={priority}
      coverAspect="aspect-[16/6.5]"
      meta={<Meta items={[project.year, project.role]} />}
      footer={
        <div className="grid gap-2.5">
          <p className="mono text-xs font-medium leading-5 text-[var(--muted)]">
            {project.stack.slice(0, 4).join(" · ")}
          </p>
          <ProjectLinks project={project} compact />
        </div>
      }
    />
  );
}
