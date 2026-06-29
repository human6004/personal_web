import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";

type PostCardProps = {
  post: Post;
  priority?: boolean;
};

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="brut-card brut-press group grid h-full overflow-hidden">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden border-b-[var(--border-w)] border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        aria-label={`Read post: ${post.title}`}
      >
        <Image
          src={post.cover}
          alt={`Cover visual for ${post.title}`}
          width={900}
          height={560}
          priority={priority}
          unoptimized
          className="aspect-[16/7] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </Link>
      <div className="grid gap-2.5 p-4">
        <div className="flex flex-wrap items-center gap-1.5 text-[0.66rem] font-medium uppercase tracking-[0.11em] text-[var(--muted)]">
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
        <div className="grid gap-1.5">
          <h2 className="content-card-title font-display text-lg font-semibold leading-snug tracking-[-0.005em]">
            <Link
              href={`/blog/${post.slug}`}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              {post.title}
            </Link>
          </h2>
          <p className="content-card-summary text-sm leading-6 text-[var(--muted)]">
            {post.description}
          </p>
        </div>
      </div>
    </article>
  );
}
