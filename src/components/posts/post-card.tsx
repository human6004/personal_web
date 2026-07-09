import type { Post } from "@/lib/content";
import { categoryColor } from "@/lib/category";
import { ContentCard } from "@/components/ui/content-card";
import { Meta } from "@/components/ui/meta";

type PostCardProps = {
  post: Post;
  priority?: boolean;
};

export function PostCard({ post, priority = false }: PostCardProps) {
  const date = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(post.date));

  return (
    <ContentCard
      href={`/blog/${post.slug}`}
      title={post.title}
      cover={post.cover}
      coverAlt={`Cover visual for ${post.title}`}
      ariaLabel={`Read post: ${post.title}`}
      summary={post.description}
      priority={priority}
      accent={categoryColor(post.category)}
      meta={
        <Meta
          items={[
            post.category,
            { label: date, dateTime: post.date },
            post.readingTime
          ]}
        />
      }
    />
  );
}
