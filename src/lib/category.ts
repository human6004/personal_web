import type { PostCategory } from "./content";

// Map category → CSS var color (dùng cho badge/card accent).
const map: Record<PostCategory, string> = {
  Tech: "var(--cat-tech)",
  Learning: "var(--cat-learning)",
  "Reading Notes": "var(--cat-reading)",
  Projects: "var(--cat-projects)",
  Tools: "var(--cat-tools)",
  Life: "var(--cat-life)"
};

export function categoryColor(category: string): string {
  return map[category as PostCategory] ?? "var(--accent)";
}
