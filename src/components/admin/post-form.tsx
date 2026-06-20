"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Post } from "@/lib/content";
import { Field } from "./field";

const categories = ["Tech", "Learning", "Reading Notes", "Projects", "Tools", "Life"];

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

type PostFormProps = {
  post?: Post;
};

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const isNew = !post;

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");
        const formData = new FormData(event.currentTarget);
        const slug = String(formData.get("slug") || "");
        const payload = {
          slug,
          title: String(formData.get("title") || ""),
          description: String(formData.get("description") || ""),
          date: String(formData.get("date") || ""),
          category: String(formData.get("category") || "Learning"),
          tags: splitList(formData.get("tags")),
          cover: String(formData.get("cover") || "/images/blog-notes.svg"),
          draft: formData.get("draft") === "on",
          content: String(formData.get("content") || "")
        };

        startTransition(async () => {
          const response = await fetch(
            isNew ? "/api/admin/posts" : `/api/admin/posts/${post.slug}`,
            {
              method: isNew ? "POST" : "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            }
          );

          if (!response.ok) {
            const data = (await response.json().catch(() => ({}))) as { error?: string };
            setMessage(data.error || "Không lưu được bài viết.");
            return;
          }

          setMessage("Đã lưu bài viết.");
          router.push(`/admin/posts/${slug}`);
          router.refresh();
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
          <Field label="Cover path" name="cover" defaultValue={post?.cover || "/images/blog-notes.svg"} />
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
        <Field
          label="Markdown/MDX content"
          name="content"
          defaultValue={post?.content || "## Mở đầu\n\nViết nội dung ở đây."}
          multiline
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
