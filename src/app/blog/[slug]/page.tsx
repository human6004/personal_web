import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MdxContent } from "@/components/mdx/mdx-content";
import { Badge } from "@/components/ui/badge";
import { InternalLink } from "@/components/ui/internal-link";
import { Meta } from "@/components/ui/meta";
import { Reveal } from "@/components/sections/reveal";
import { PostCard } from "@/components/posts/post-card";
import { getAllPosts, getPostBySlug } from "@/lib/content";
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

  const related = (await getAllPosts())
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3);

  const date = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(post.date));

  return (
    <article className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <InternalLink href="/blog">Back to blog</InternalLink>
      <Reveal className="grid gap-5">
        <header className="grid gap-5">
          <Meta
            size="detail"
            items={[post.category, { label: date, dateTime: post.date }, post.readingTime]}
          />
          <h1 className="display-hero">{post.title}</h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </header>
      </Reveal>
      <Reveal delay={0.05}>
        <Image
          src={post.cover}
          alt={`Cover visual for ${post.title}`}
          width={1200}
          height={760}
          priority
          unoptimized
          className="rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)] shadow-[var(--shadow)]"
        />
      </Reveal>
      <MdxContent source={post.content} />

      {related.length > 0 ? (
        <section className="mt-4 grid gap-5 border-t-[var(--border-w)] border-[var(--ink)] pt-8">
          <h2 className="display-section">Cùng chủ đề</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.05}>
                <PostCard post={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
