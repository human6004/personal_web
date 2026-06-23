"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Post } from "@/lib/content";
import type { CloudinaryMediaAsset } from "@/lib/cloudinary/media";
import {
  cleanupUploadedAssets,
  resolvePendingMarkdown,
  resolvePendingMediaValue,
  type PendingImageUpload
} from "@/lib/cloudinary/pending-upload";
import { Field } from "./field";
import { MediaField } from "./media/media-field";
import { MdxEditorField } from "./media/mdx-editor-field";

const categories = ["Tech", "Learning", "Reading Notes", "Projects", "Tools", "Life"];

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

type PostFormProps = {
  post?: Post;
  cloudinaryFolder?: string;
};

export function PostForm({ post, cloudinaryFolder = "personal-web" }: PostFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const isNew = !post;
  const mediaFolder = `${cloudinaryFolder}/posts`;
  const [cover, setCover] = useState(post?.cover || "/images/blog-notes.svg");
  const [coverPending, setCoverPending] = useState<PendingImageUpload | null>(null);
  const [content, setContent] = useState(post?.content || "## Mở đầu\n\nViết nội dung ở đây.");
  const [contentPending, setContentPending] = useState<PendingImageUpload[]>([]);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");
        const formData = new FormData(event.currentTarget);
        const slug = String(formData.get("slug") || "");

        startTransition(async () => {
          const uploadedAssets: CloudinaryMediaAsset[] = [];

          try {
            const resolvedCover = await resolvePendingMediaValue(
              cover,
              coverPending,
              uploadedAssets
            );
            const resolvedContent = await resolvePendingMarkdown(
              content,
              contentPending,
              uploadedAssets
            );
            const payload = {
              slug,
              title: String(formData.get("title") || ""),
              description: String(formData.get("description") || ""),
              date: String(formData.get("date") || ""),
              category: String(formData.get("category") || "Learning"),
              tags: splitList(formData.get("tags")),
              cover: resolvedCover || "/images/blog-notes.svg",
              draft: formData.get("draft") === "on",
              content: resolvedContent
            };
            const response = await fetch(
              isNew ? "/api/admin/posts" : `/api/admin/posts/${post.slug}`,
              {
                method: isNew ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              }
            );

            if (!response.ok) {
              await cleanupUploadedAssets(uploadedAssets);
              const data = (await response.json().catch(() => ({}))) as { error?: string };
              setMessage(data.error || "Không lưu được bài viết.");
              return;
            }

            setCover(resolvedCover);
            setCoverPending(null);
            setContent(resolvedContent);
            setContentPending([]);
            setMessage("Đã lưu bài viết.");
            router.push(`/admin/posts/${slug}`);
            router.refresh();
          } catch (error) {
            await cleanupUploadedAssets(uploadedAssets);
            setMessage(error instanceof Error ? error.message : "Không lưu được bài viết.");
          }
        });
      }}
    >
      <div className="brut-card grid gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" name="title" defaultValue={post?.title} required />
          <Field label="Slug" name="slug" defaultValue={post?.slug} required />
        </div>
        <Field
          label="Description"
          name="description"
          defaultValue={post?.description}
          multiline
          rows={3}
          required
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Date" name="date" type="date" defaultValue={post?.date} required />
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Category</span>
            <select
              name="category"
              defaultValue={post?.category || "Learning"}
              className="brut-input text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <MediaField
            label="Cover image"
            name="cover"
            value={cover}
            onValueChange={setCover}
            folder={mediaFolder}
            onPendingChange={setCoverPending}
            help="Paste a path or URL, upload a new image, or choose from the media library."
          />
        </div>
        <Field
          label="Tags"
          name="tags"
          defaultValue={post?.tags.join("\n")}
          multiline
          rows={4}
          help="Một tag mỗi dòng hoặc cách nhau bằng dấu phẩy."
        />
        <label className="flex items-center gap-2.5 text-sm font-medium">
          <input name="draft" type="checkbox" defaultChecked={post?.draft} />
          Draft, ẩn khỏi public site
        </label>
      </div>

      <div className="brut-card grid gap-3 p-5">
        <MdxEditorField
          label="Markdown/MDX content"
          name="content"
          value={content}
          onValueChange={setContent}
          defaultValue="## Mở đầu\n\nViết nội dung ở đây."
          folder={mediaFolder}
          onPendingChange={setContentPending}
          rows={18}
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="brut-card brut-press rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving" : "Save post"}
        </button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
