import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/sections/reveal";
import { InternalLink } from "@/components/ui/internal-link";
import { PostCard } from "@/components/posts/post-card";
import { ProjectCard } from "@/components/projects/project-card";
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
    <div className="mx-auto grid max-w-7xl gap-24 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <section className="grid min-h-[calc(100dvh-8rem)] items-center gap-12 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="grid gap-8">
          <div className="grid gap-6">
            <p className="eyebrow">{profile.home.heroEyebrow}</p>
            <h1 className="display-hero max-w-4xl">{profile.home.heroTitle}</h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--muted)]">
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
          <div className="relative">
            <div className="absolute inset-6 rounded-[40px] bg-[var(--accent-soft)]" />
            <Image
              src="/images/avatar.svg"
              alt={`Illustrated avatar for ${profile.name}`}
              width={760}
              height={760}
              priority
              unoptimized
              className="relative w-full rounded-[40px] border border-[var(--line)] bg-[var(--surface)] object-cover"
            />
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="grid gap-8 rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 md:grid-cols-[0.7fr_1.3fr] md:p-12">
          <div className="grid content-start gap-3">
            <p className="eyebrow">Now</p>
            <h2 className="display-section">{profile.home.nowTitle}</h2>
          </div>
          <div className="grid gap-4 text-lg leading-8 text-[var(--muted)]">
            {profile.home.nowBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid gap-10">
        <div className="grid gap-5">
          <div className="rule" />
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="grid gap-3">
              <p className="eyebrow">Selected work</p>
              <h2 className="display-section">Featured projects</h2>
            </div>
            <InternalLink href="/projects" variant="text">
              All projects
            </InternalLink>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.05}>
              <ProjectCard project={project} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-10">
        <div className="grid gap-5">
          <div className="rule" />
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="grid gap-3">
              <p className="eyebrow">From the journal</p>
              <h2 className="display-section">Latest writing</h2>
            </div>
            <InternalLink href="/blog" variant="text">
              All posts
            </InternalLink>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {latestPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.05}>
              <PostCard post={post} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
