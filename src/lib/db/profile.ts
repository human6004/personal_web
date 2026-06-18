import type { EditableProfile } from "@/lib/profile";
import { dbQuery } from "./neon";

type ProfileRow = {
  name: string;
  title: string;
  description: string;
  tagline: string;
  english_tagline: string | null;
  socials: EditableProfile["socials"] | string;
  home: EditableProfile["home"] | string;
  about: EditableProfile["about"] | string;
};

function parseJsonField<T>(value: T | string): T {
  return typeof value === "string" ? (JSON.parse(value) as T) : value;
}

export async function getDatabaseProfile() {
  const rows = await dbQuery<ProfileRow>(
    `select name, title, description, tagline, english_tagline, socials, home, about
     from profiles
     where id = 'main'
     limit 1`
  );
  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    name: row.name,
    title: row.title,
    description: row.description,
    tagline: row.tagline,
    englishTagline: row.english_tagline || "",
    socials: parseJsonField(row.socials),
    home: parseJsonField(row.home),
    about: parseJsonField(row.about)
  } satisfies EditableProfile;
}
