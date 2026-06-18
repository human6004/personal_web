import type { MetadataRoute } from "next";
import { getAllPosts, getAllProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/projects", "/blog", "/contact"].map(
    (route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7
    })
  );

  const projectRoutes = (await getAllProjects()).map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(`${project.year}-01-01`),
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6
  }));

  const postRoutes = (await getAllPosts()).map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
