"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Project } from "@/lib/content";
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

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

type ProjectFormProps = {
  project?: Project;
  cloudinaryFolder?: string;
};

export function ProjectForm({ project, cloudinaryFolder = "personal-web" }: ProjectFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const isNew = !project;
  const mediaFolder = `${cloudinaryFolder}/projects`;
  const [cover, setCover] = useState(project?.cover || "/images/project-portfolio.svg");
  const [coverPending, setCoverPending] = useState<PendingImageUpload | null>(null);
  const [content, setContent] = useState(
    project?.content || "## Project này là gì?\n\nMô tả project ở đây."
  );
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
              summary: String(formData.get("summary") || ""),
              year: String(formData.get("year") || ""),
              role: String(formData.get("role") || ""),
              stack: splitList(formData.get("stack")),
              tags: splitList(formData.get("tags")),
              status: String(formData.get("status") || ""),
              cover: resolvedCover || "/images/project-portfolio.svg",
              repoUrl: String(formData.get("repoUrl") || ""),
              demoUrl: String(formData.get("demoUrl") || ""),
              caseStudyUrl: String(formData.get("caseStudyUrl") || ""),
              externalUrl: String(formData.get("externalUrl") || ""),
              highlights: splitList(formData.get("highlights")),
              featured: formData.get("featured") === "on",
              draft: formData.get("draft") === "on",
              content: resolvedContent
            };
            const response = await fetch(
              isNew ? "/api/admin/projects" : `/api/admin/projects/${project.slug}`,
              {
                method: isNew ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              }
            );

            if (!response.ok) {
              await cleanupUploadedAssets(uploadedAssets);
              const data = (await response.json().catch(() => ({}))) as { error?: string };
              setMessage(data.error || "Không lưu được project.");
              return;
            }

            setCover(resolvedCover);
            setCoverPending(null);
            setContent(resolvedContent);
            setContentPending([]);
            setMessage("Đã lưu project.");
            router.push(`/admin/projects/${slug}`);
            router.refresh();
          } catch (error) {
            await cleanupUploadedAssets(uploadedAssets);
            setMessage(error instanceof Error ? error.message : "Không lưu được project.");
          }
        });
      }}
    >
      <div className="brut-card grid gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" name="title" defaultValue={project?.title} required />
          <Field label="Slug" name="slug" defaultValue={project?.slug} required />
        </div>
        <Field
          label="Summary"
          name="summary"
          defaultValue={project?.summary}
          multiline
          rows={3}
          required
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Year" name="year" defaultValue={project?.year || "2026"} required />
          <Field label="Role" name="role" defaultValue={project?.role} required />
          <Field label="Status" name="status" defaultValue={project?.status || "In progress"} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Stack" name="stack" defaultValue={project?.stack.join("\n")} multiline rows={4} />
          <Field label="Tags" name="tags" defaultValue={project?.tags.join("\n")} multiline rows={4} />
        </div>
        <MediaField
          label="Cover image"
          name="cover"
          value={cover}
          onValueChange={setCover}
          folder={mediaFolder}
          onPendingChange={setCoverPending}
          help="Paste a path or URL, upload a new image, or choose from the media library."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="GitHub repo URL" name="repoUrl" defaultValue={project?.repoUrl || ""} />
          <Field label="Live demo URL" name="demoUrl" defaultValue={project?.demoUrl || ""} />
          <Field label="Case study URL" name="caseStudyUrl" defaultValue={project?.caseStudyUrl || ""} />
          <Field label="External URL" name="externalUrl" defaultValue={project?.externalUrl || ""} />
        </div>
        <Field
          label="Highlights"
          name="highlights"
          defaultValue={project?.highlights.join("\n")}
          multiline
          rows={5}
        />
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input name="featured" type="checkbox" defaultChecked={project?.featured} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input name="draft" type="checkbox" defaultChecked={project?.draft} />
            Draft, ẩn khỏi public site
          </label>
        </div>
      </div>

      <div className="brut-card grid gap-3 p-5">
        <MdxEditorField
          label="Markdown/MDX case study"
          name="content"
          value={content}
          onValueChange={setContent}
          defaultValue="## Project này là gì?\n\nMô tả project ở đây."
          folder={mediaFolder}
          onPendingChange={setContentPending}
          rows={20}
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="brut-card brut-press rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving" : "Save project"}
        </button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
