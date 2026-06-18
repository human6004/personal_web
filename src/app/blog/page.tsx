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
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-6">
          <p className="max-w-fit rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)]">
            Blog
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
            Ghi chú để suy nghĩ rõ hơn.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Các bài viết ngắn về công nghệ, học tập, đọc sách, project, công cụ
            và đời sống. V1 giữ mọi thứ đơn giản để dễ viết đều.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm text-[var(--muted)]"
              >
                {category}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid gap-6 md:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.05}>
            <PostCard post={post} priority={index === 0} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
