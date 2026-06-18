import { z } from "zod";
import { profileSchema } from "@/lib/profile";

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.");

export const postCategorySchema = z.enum([
  "Tech",
  "Learning",
  "Reading Notes",
  "Projects",
  "Tools",
  "Life"
]);

const stringList = z.array(z.string().trim().min(1)).default([]);

export const postInputSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(320),
  date: z.string().min(1),
  category: postCategorySchema,
  tags: stringList,
  cover: z.string().min(1).default("/images/blog-notes.svg"),
  draft: z.boolean().default(false),
  content: z.string().min(1)
});

export const projectInputSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(360),
  year: z.string().min(4).max(12),
  role: z.string().min(1).max(160),
  stack: stringList,
  tags: stringList,
  status: z.string().min(1).max(120),
  cover: z.string().min(1).default("/images/project-portfolio.svg"),
  repoUrl: z.string().default(""),
  demoUrl: z.string().default(""),
  caseStudyUrl: z.string().default(""),
  externalUrl: z.string().default(""),
  highlights: stringList,
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  content: z.string().min(1)
});

export const profileInputSchema = profileSchema;

export type PostInput = z.infer<typeof postInputSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProfileInput = z.infer<typeof profileInputSchema>;
