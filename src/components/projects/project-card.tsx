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
    <article className="group grid overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--paper)] transition duration-300 hover:-translate-y-1 hover:border-[var(--ink)] hover:shadow-[0_24px_70px_rgba(34,37,31,0.09)]">
      <Link
        href={`/projects/${project.slug}`}
        className="block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        aria-label={`View case study: ${project.title}`}
      >
        <Image
          src={project.cover}
          alt={`Visual for ${project.title}`}
          width={960}
          height={620}
          priority={priority}
          unoptimized
          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="grid gap-6 p-6 md:p-7">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <span>{project.year}</span>
            <span aria-hidden>/</span>
            <span>{project.role}</span>
          </div>
          <div className="grid gap-2">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">
              <Link
                href={`/projects/${project.slug}`}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
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
              className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm text-[var(--ink)]"
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
