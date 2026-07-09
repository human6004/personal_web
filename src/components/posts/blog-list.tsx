"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/content";
import { categoryColor } from "@/lib/category";
import { PostCard } from "./post-card";
import { Reveal } from "@/components/sections/reveal";
import { FeaturedPostCard } from "./featured-post-card";
import { clsx } from "clsx";

type BlogListProps = {
  posts: Post[];
  categories: string[];
};

export function BlogList({ posts, categories }: BlogListProps) {
  const [active, setActive] = useState<string>("Tất cả");

  const filtered = useMemo(() => {
    if (active === "Tất cả") return posts;
    return posts.filter((post) => post.category === active);
  }, [posts, active]);

  const [featured, ...rest] = filtered;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-2">
        {["Tất cả", ...categories].map((category) => {
          const isActive = category === active;
          const dot = category === "Tất cả" ? undefined : categoryColor(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={isActive}
              className={clsx(
                "mono inline-flex items-center gap-1.5 rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] px-2.5 py-1 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]",
                isActive
                  ? "bg-[var(--pop)] text-[var(--ink)]"
                  : "bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--accent-soft)]"
              )}
            >
              {dot ? (
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full border border-[var(--ink)]"
                  style={{ background: dot }}
                />
              ) : null}
              {category}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="brut-card p-6 text-[var(--muted)]">
          Chưa có bài nào trong mục này.
        </p>
      ) : (
        <div className="grid gap-5">
          {featured ? (
            <Reveal>
              <FeaturedPostCard post={featured} />
            </Reveal>
          ) : null}
          {rest.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.05}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
