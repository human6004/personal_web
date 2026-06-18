import path from "node:path";
import type { ContentCollection } from "@/lib/content";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateSlug(slug: string) {
  if (!slugPattern.test(slug)) {
    throw new Error("Invalid slug. Use lowercase letters, numbers and hyphens.");
  }

  return slug;
}

export function resolveContentFilePath(
  collection: ContentCollection,
  slug: string,
  root = process.cwd()
) {
  const safeSlug = validateSlug(slug);
  const collectionDir = path.resolve(root, "content", collection);
  const filePath = path.resolve(collectionDir, `${safeSlug}.mdx`);

  if (!filePath.startsWith(`${collectionDir}${path.sep}`)) {
    throw new Error("Resolved file path is outside the content directory.");
  }

  return filePath;
}
