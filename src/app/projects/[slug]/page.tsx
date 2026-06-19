import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ProjectLinks } from "@/components/projects/project-links";
import { InternalLink } from "@/components/ui/internal-link";
import { getProjectBySlug, isPrivateRepo } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: "Project not found",
      description: "Project này chưa tồn tại hoặc chưa được xuất bản.",
      path: `/projects/${slug}`
    });
  }

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const privateRepo = isPrivateRepo(project);

  return (
    <article className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-8">
        <InternalLink href="/projects">Back to projects</InternalLink>
        <div className="grid gap-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <span>{project.year}</span>
            <span aria-hidden>/</span>
            <span>{project.status}</span>
            {privateRepo ? (
              <>
                <span aria-hidden>/</span>
                <span>Private repo</span>
              </>
            ) : null}
          </div>
          <h1 className="display-hero max-w-5xl">{project.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {project.summary}
          </p>
          <ProjectLinks project={project} showCaseStudy={false} />
        </div>
      </section>

      <Image
        src={project.cover}
        alt={`Visual for ${project.title}`}
        width={1400}
        height={860}
        priority
        unoptimized
        className="rounded-[32px] border border-[var(--line)] bg-[var(--surface)]"
      />

      <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="grid h-fit gap-4 rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-6">
          <div>
            <p className="text-sm text-[var(--muted)]">Role</p>
            <p className="mt-1 font-medium">{project.role}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">Stack</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">Highlights</p>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--muted)]">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </aside>
        <MdxContent source={project.content} />
      </section>
    </article>
  );
}
