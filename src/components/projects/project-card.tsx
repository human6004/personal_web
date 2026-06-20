import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { ProjectLinks } from "./project-links";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="brut-card brut-press group grid h-full overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className="block overflow-hidden border-b-[var(--border-w)] border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        aria-label={`View case study: ${project.title}`}
      >
        <Image
          src={project.cover}
          alt={`Visual for ${project.title}`}
          width={960}
          height={620}
          priority={priority}
          unoptimized
          className="aspect-[16/6.5] w-full object-cover"
        />
      </Link>
      <div className="flex h-full flex-col gap-2.5 p-3.5 sm:p-4">
        <div className="grid gap-2">
          <div className="flex min-w-0 items-center gap-1.5 text-[0.66rem] font-medium uppercase tracking-[0.11em] text-[var(--muted)]">
            <span className="shrink-0">{project.year}</span>
            <span aria-hidden className="text-[var(--accent)]">·</span>
            <span className="min-w-0 truncate">{project.role}</span>
          </div>
          <div className="grid gap-1.5">
            <h2 className="content-card-title font-display text-lg font-semibold leading-snug tracking-[-0.005em]">
              <Link
                href={`/projects/${project.slug}`}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
              >
                {project.title}
              </Link>
            </h2>
            <p className="content-card-summary max-w-[62ch] text-sm leading-5 text-[var(--muted)]">
              {project.summary}
            </p>
          </div>
        </div>
        <p className="content-card-summary text-xs font-medium leading-5 text-[var(--muted)]">
          {project.stack.slice(0, 4).join(" \u00b7 ")}
        </p>
        <div className="mt-auto">
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </article>
  );
}
