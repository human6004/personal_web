import type { Metadata } from "next";
import { PostCard } from "@/components/posts/post-card";
import { Reveal } from "@/components/sections/reveal";
import { getAllPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Blog",
    description:
      "Bài viết và ghi chú về công nghệ, học tập, đọc sách, project, công cụ và đời sống.",
    path: "/blog"
  });
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-4">
          <p className="eyebrow">Journal</p>
          <h1 className="display-section max-w-4xl">
            Ghi chú để suy nghĩ <em>rõ hơn.</em>
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            Các bài viết ngắn về công nghệ, học tập, đọc sách, project, công cụ
            và đời sống. V1 giữ mọi thứ đơn giản để dễ viết đều.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)] px-2.5 py-0.5 text-sm font-medium text-[var(--ink)]"
              >
                {category}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.05}>
            <PostCard post={post} priority={index === 0} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
