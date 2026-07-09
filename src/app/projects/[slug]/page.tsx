import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ProjectLinks } from "@/components/projects/project-links";
import { Badge } from "@/components/ui/badge";
import { InternalLink } from "@/components/ui/internal-link";
import { Meta } from "@/components/ui/meta";
import { Reveal } from "@/components/sections/reveal";
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
    <article className="mx-auto grid max-w-7xl gap-9 px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="grid gap-6">
        <InternalLink href="/projects">Back to projects</InternalLink>
        <div className="grid gap-5">
          <Meta
            size="detail"
            items={[
              project.year,
              project.status,
              ...(privateRepo ? ["Private repo"] : [])
            ]}
          />
          <h1 className="display-hero max-w-5xl">{project.title}</h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            {project.summary}
          </p>
          <ProjectLinks project={project} showCaseStudy={false} />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Image
          src={project.cover}
          alt={`Visual for ${project.title}`}
          width={1400}
          height={860}
          priority
          unoptimized
          className="w-full rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)] shadow-[var(--shadow)]"
        />
      </Reveal>

      <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="brut-card grid h-fit gap-3.5 p-5 lg:sticky lg:top-20">
          <div>
            <p className="text-sm text-[var(--muted)]">Role</p>
            <p className="mt-1 font-medium">{project.role}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">Stack</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <Badge key={item}>{item}</Badge>
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
