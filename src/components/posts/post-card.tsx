import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";

type PostCardProps = {
  post: Post;
  priority?: boolean;
};

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="grid gap-5 rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-4 transition duration-300 hover:-translate-y-1 hover:border-[var(--ink)] hover:shadow-[0_24px_70px_rgba(34,37,31,0.08)]">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        aria-label={`Read post: ${post.title}`}
      >
        <Image
          src={post.cover}
          alt={`Cover visual for ${post.title}`}
          width={900}
          height={560}
          priority={priority}
          unoptimized
          className="aspect-[16/10] w-full object-cover transition duration-500 hover:scale-[1.03]"
        />
      </Link>
      <div className="grid gap-4 px-2 pb-2">
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
        <div className="grid gap-2">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">
            <Link
              href={`/blog/${post.slug}`}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
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
              className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm text-[var(--ink)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
