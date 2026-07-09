import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { categoryColor } from "@/lib/category";
import { Meta } from "@/components/ui/meta";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]";

// Card bài nổi bật: ảnh lớn + nội dung 2 cột, khác hẳn grid card đều -> phá lặp.
export function FeaturedPostCard({ post }: { post: Post }) {
  const date = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(post.date));

  return (
    <article className="brut-card brut-press group grid overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Đọc bài: ${post.title}`}
        className={`relative block overflow-hidden border-b-[var(--border-w)] border-[var(--ink)] lg:border-b-0 lg:border-r-[var(--border-w)] ${focusRing}`}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-1.5"
          style={{ background: categoryColor(post.category) }}
        />
        <Image
          src={post.cover}
          alt={`Cover visual for ${post.title}`}
          width={1200}
          height={760}
          priority
          unoptimized
          className="aspect-[16/9] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none lg:h-full"
        />
      </Link>
      <div className="flex flex-col justify-center gap-4 p-5 sm:p-7">
        <Meta
          items={[post.category, { label: date, dateTime: post.date }, post.readingTime]}
        />
        <h2 className="font-display text-2xl font-semibold leading-tight tracking-[-0.01em] sm:text-3xl">
          <Link href={`/blog/${post.slug}`} className={focusRing}>
            {post.title}
          </Link>
        </h2>
        <p className="text-base leading-7 text-[var(--muted)]">{post.description}</p>
      </div>
    </article>
  );
}
