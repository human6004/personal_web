import { z } from "zod";
import { profileSchema, urlOrEmpty } from "@/lib/profile";

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

// Ép ISO date (YYYY-MM-DD). Nếu chỉ min(1) thì ngày sai định dạng lọt qua Zod rồi
// vỡ ở cast Postgres -> 500. Validate ở đây để trả 400 sạch.
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date (YYYY-MM-DD).")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid calendar date.");

// year là text trong DB nhưng vẫn nên là số 4 chữ số để tránh rác.
const yearSchema = z
  .string()
  .regex(/^\d{4}$/, "Use a 4-digit year.");

export const postInputSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(320),
  date: isoDateSchema,
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
  year: yearSchema,
  role: z.string().min(1).max(160),
  stack: stringList,
  tags: stringList,
  status: z.string().min(1).max(120),
  cover: z.string().min(1).default("/images/project-portfolio.svg"),
  repoUrl: urlOrEmpty,
  demoUrl: urlOrEmpty,
  caseStudyUrl: urlOrEmpty,
  externalUrl: urlOrEmpty,
  highlights: stringList,
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  content: z.string().min(1)
});

export const profileInputSchema = profileSchema;

export type PostInput = z.infer<typeof postInputSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProfileInput = z.infer<typeof profileInputSchema>;
