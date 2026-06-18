import { getAllPosts, getAllProjects, getPostBySlug, getProjectBySlug } from "@/lib/content";
import { getProfile } from "@/lib/profile";
import {
  postInputSchema,
  profileInputSchema,
  projectInputSchema,
  type PostInput,
  type ProfileInput,
  type ProjectInput
} from "@/lib/admin/schemas";
import { validateSlug } from "@/lib/admin/paths";
import { dbQuery } from "./neon";

export async function writePost(input: PostInput) {
  const parsed = postInputSchema.parse(input);

  await dbQuery(
    `insert into posts (
       slug, title, description, content, date, category, tags, cover, draft
     )
     values ($1, $2, $3, $4, $5::date, $6, $7::text[], $8, $9)
     on conflict (slug) do update set
       title = excluded.title,
       description = excluded.description,
       content = excluded.content,
       date = excluded.date,
       category = excluded.category,
       tags = excluded.tags,
       cover = excluded.cover,
       draft = excluded.draft,
       updated_at = now()`,
    [
      parsed.slug,
      parsed.title,
      parsed.description,
      parsed.content,
      parsed.date,
      parsed.category,
      parsed.tags,
      parsed.cover,
      parsed.draft
    ]
  );

  return parsed;
}

export async function writeProject(input: ProjectInput) {
  const parsed = projectInputSchema.parse(input);

  await dbQuery(
    `insert into projects (
       slug, title, summary, content, year, role, stack, tags, status, cover,
       repo_url, demo_url, case_study_url, external_url, highlights, featured, draft
     )
     values (
       $1, $2, $3, $4, $5, $6, $7::text[], $8::text[], $9, $10,
       $11, $12, $13, $14, $15::text[], $16, $17
     )
     on conflict (slug) do update set
       title = excluded.title,
       summary = excluded.summary,
       content = excluded.content,
       year = excluded.year,
       role = excluded.role,
       stack = excluded.stack,
       tags = excluded.tags,
       status = excluded.status,
       cover = excluded.cover,
       repo_url = excluded.repo_url,
       demo_url = excluded.demo_url,
       case_study_url = excluded.case_study_url,
       external_url = excluded.external_url,
       highlights = excluded.highlights,
       featured = excluded.featured,
       draft = excluded.draft,
       updated_at = now()`,
    [
      parsed.slug,
      parsed.title,
      parsed.summary,
      parsed.content,
      parsed.year,
      parsed.role,
      parsed.stack,
      parsed.tags,
      parsed.status,
      parsed.cover,
      parsed.repoUrl,
      parsed.demoUrl,
      parsed.caseStudyUrl,
      parsed.externalUrl,
      parsed.highlights,
      parsed.featured,
      parsed.draft
    ]
  );

  return parsed;
}

export async function renamePostSlug(previousSlug: string, nextSlug: string) {
  if (previousSlug === nextSlug) {
    return;
  }

  await dbQuery(`delete from posts where slug = $1`, [previousSlug]);
}

export async function renameProjectSlug(previousSlug: string, nextSlug: string) {
  if (previousSlug === nextSlug) {
    return;
  }

  await dbQuery(`delete from projects where slug = $1`, [previousSlug]);
}

export async function writeEditableProfile(input: ProfileInput) {
  const parsed = profileInputSchema.parse(input);

  await dbQuery(
    `insert into profiles (
       id, name, title, description, tagline, english_tagline, socials, home, about
     )
     values (
       'main', $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb
     )
     on conflict (id) do update set
       name = excluded.name,
       title = excluded.title,
       description = excluded.description,
       tagline = excluded.tagline,
       english_tagline = excluded.english_tagline,
       socials = excluded.socials,
       home = excluded.home,
       about = excluded.about,
       updated_at = now()`,
    [
      parsed.name,
      parsed.title,
      parsed.description,
      parsed.tagline,
      parsed.englishTagline,
      JSON.stringify(parsed.socials),
      JSON.stringify(parsed.home),
      JSON.stringify(parsed.about)
    ]
  );

  return parsed;
}

export async function getAdminContent() {
  return {
    profile: await getProfile(),
    posts: await getAllPosts({ includeDrafts: true }),
    projects: await getAllProjects({ includeDrafts: true })
  };
}

export async function getEditablePost(slug: string) {
  return getPostBySlug(validateSlug(slug), { includeDrafts: true });
}

export async function getEditableProject(slug: string) {
  return getProjectBySlug(validateSlug(slug), { includeDrafts: true });
}
