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
    <article className="brut-card brut-press group grid overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className="block overflow-hidden border-b-[2.5px] border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        aria-label={`View case study: ${project.title}`}
      >
        <Image
          src={project.cover}
          alt={`Visual for ${project.title}`}
          width={960}
          height={620}
          priority={priority}
          unoptimized
          className="aspect-[16/10] w-full object-cover"
        />
      </Link>
      <div className="grid gap-6 p-6 md:p-7">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            <span>{project.year}</span>
            <span aria-hidden className="text-[var(--accent)]">·</span>
            <span>{project.role}</span>
          </div>
          <div className="grid gap-2">
            <h2 className="font-display text-2xl font-bold tracking-[-0.01em]">
              <Link
                href={`/projects/${project.slug}`}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
              >
                {project.title}
              </Link>
            </h2>
            <p className="max-w-[62ch] text-[var(--muted)]">{project.summary}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((item) => (
            <span
              key={item}
              className="rounded-[var(--radius)] border-2 border-[var(--ink)] bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--ink)]"
            >
              {item}
            </span>
          ))}
        </div>
        <ProjectLinks project={project} compact />
      </div>
    </article>
  );
}
