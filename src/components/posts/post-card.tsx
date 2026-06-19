import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";

type PostCardProps = {
  post: Post;
  priority?: boolean;
};

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="brut-card brut-press grid gap-5 p-4">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden rounded-[var(--radius)] border-[2.5px] border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        aria-label={`Read post: ${post.title}`}
      >
        <Image
          src={post.cover}
          alt={`Cover visual for ${post.title}`}
          width={900}
          height={560}
          priority={priority}
          unoptimized
          className="aspect-[16/10] w-full object-cover"
        />
      </Link>
      <div className="grid gap-4 px-2 pb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          <span>{post.category}</span>
          <span aria-hidden className="text-[var(--accent)]">·</span>
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat("vi-VN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }).format(new Date(post.date))}
          </time>
          <span aria-hidden className="text-[var(--accent)]">·</span>
          <span>{post.readingTime}</span>
        </div>
        <div className="grid gap-2">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em]">
            <Link
              href={`/blog/${post.slug}`}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-[var(--muted)]">{post.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius)] border-2 border-[var(--ink)] bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--ink)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
