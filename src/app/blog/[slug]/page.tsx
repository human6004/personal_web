import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MdxContent } from "@/components/mdx/mdx-content";
import { InternalLink } from "@/components/ui/internal-link";
import { getPostBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Post not found",
      description: "Bài viết này chưa tồn tại hoặc chưa được xuất bản.",
      path: `/blog/${slug}`
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.cover,
    type: "article"
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <InternalLink href="/blog">Back to blog</InternalLink>
      <header className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <span>{post.category}</span>
          <span aria-hidden>/</span>
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat("vi-VN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }).format(new Date(post.date))}
          </time>
          <span aria-hidden>/</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="display-hero">{post.title}</h1>
        <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
          {post.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius)] border-2 border-[var(--ink)] bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--ink)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <Image
        src={post.cover}
        alt={`Cover visual for ${post.title}`}
        width={1200}
        height={760}
        priority
        unoptimized
        className="rounded-[var(--radius)] border-[2.5px] border-[var(--ink)] bg-[var(--surface)] shadow-[var(--shadow)]"
      />
      <MdxContent source={post.content} />
    </article>
  );
}
