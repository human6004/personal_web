import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/sections/reveal";
import { StaggerText } from "@/components/sections/stagger-text";
import { InternalLink } from "@/components/ui/internal-link";
import { Meta } from "@/components/ui/meta";
import { ProjectCard } from "@/components/projects/project-card";
import { categoryColor } from "@/lib/category";
import { getAllPosts, getFeaturedProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return buildMetadata({
    title: profile.title,
    description: profile.description,
    path: "/"
  });
}

export default async function HomePage() {
  const profile = await getProfile();
  const featuredProjects = await getFeaturedProjects(3);
  const latestPosts = (await getAllPosts()).slice(0, 3);

  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <section className="grid min-h-[calc(92dvh-7rem)] items-center gap-10 py-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="grid gap-7">
          <div className="grid gap-5">
            <p className="eyebrow">{profile.home.heroEyebrow}</p>
            <StaggerText
              text={profile.home.heroTitle}
              className="display-hero max-w-4xl"
            />
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              {profile.home.heroDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <InternalLink href="/projects" variant="solid">
              View projects
            </InternalLink>
            <InternalLink href="/blog" variant="text">
              Read blog
            </InternalLink>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="relative mx-auto max-w-[560px] lg:max-w-none">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[var(--radius)] bg-[var(--accent)]" />
            <Image
              src={profile.home.avatarImage}
              alt={`Illustrated avatar for ${profile.name}`}
              width={760}
              height={760}
              priority
              unoptimized
              className="relative w-full rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)] object-cover"
            />
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="brut-card grid gap-6 p-5 md:grid-cols-[0.7fr_1.3fr] md:p-10">
          <div className="grid content-start gap-2.5">
            <p className="eyebrow eyebrow--plain inline-flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full border border-[var(--ink)] bg-[var(--cat-tools)]"
              />
              Now
            </p>
            <h2 className="display-section">{profile.home.nowTitle}</h2>
          </div>
          <div className="grid gap-3.5 text-base leading-7 text-[var(--muted)]">
            {profile.home.nowBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid gap-8">
        <div className="grid gap-4">
          <div className="rule" />
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="grid gap-2.5">
              <p className="eyebrow">Selected work</p>
              <h2 className="display-section">Featured projects</h2>
            </div>
            <InternalLink href="/projects" variant="text">
              All projects
            </InternalLink>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.05}>
              <ProjectCard project={project} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-8">
        <div className="grid gap-4">
          <div className="rule" />
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="grid gap-2.5">
              <p className="eyebrow eyebrow--plain">From the journal</p>
              <h2 className="display-section">Latest writing</h2>
            </div>
            <InternalLink href="/blog" variant="text">
              All posts
            </InternalLink>
          </div>
        </div>
        {latestPosts.length > 0 ? (
          <ul className="grid divide-y-[var(--border-w)] divide-[var(--ink)] border-y-[var(--border-w)] border-[var(--ink)]">
            {latestPosts.map((post, index) => {
              const date = new Intl.DateTimeFormat("vi-VN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }).format(new Date(post.date));
              return (
                <li key={post.slug}>
                  <Reveal delay={index * 0.05}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group grid gap-2 py-5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-6"
                    >
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 self-center rounded-full border border-[var(--ink)] md:self-auto"
                        style={{ background: categoryColor(post.category) }}
                      />
                      <span className="grid gap-1">
                        <span className="font-display text-lg font-semibold leading-snug tracking-[-0.005em] group-hover:underline">
                          {post.title}
                        </span>
                        <span className="line-clamp-1 text-sm text-[var(--muted)]">
                          {post.description}
                        </span>
                      </span>
                      <Meta
                        items={[post.category, { label: date, dateTime: post.date }]}
                        className="md:justify-end"
                      />
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
