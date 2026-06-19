"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Project } from "@/lib/content";
import { Field } from "./field";

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

type ProjectFormProps = {
  project?: Project;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const isNew = !project;

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");
        const formData = new FormData(event.currentTarget);
        const slug = String(formData.get("slug") || "");
        const payload = {
          slug,
          title: String(formData.get("title") || ""),
          summary: String(formData.get("summary") || ""),
          year: String(formData.get("year") || ""),
          role: String(formData.get("role") || ""),
          stack: splitList(formData.get("stack")),
          tags: splitList(formData.get("tags")),
          status: String(formData.get("status") || ""),
          cover: String(formData.get("cover") || "/images/project-portfolio.svg"),
          repoUrl: String(formData.get("repoUrl") || ""),
          demoUrl: String(formData.get("demoUrl") || ""),
          caseStudyUrl: String(formData.get("caseStudyUrl") || ""),
          externalUrl: String(formData.get("externalUrl") || ""),
          highlights: splitList(formData.get("highlights")),
          featured: formData.get("featured") === "on",
          draft: formData.get("draft") === "on",
          content: String(formData.get("content") || "")
        };

        startTransition(async () => {
          const response = await fetch(
            isNew ? "/api/admin/projects" : `/api/admin/projects/${project.slug}`,
            {
              method: isNew ? "POST" : "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            }
          );

          if (!response.ok) {
            const data = (await response.json().catch(() => ({}))) as { error?: string };
            setMessage(data.error || "Không lưu được project.");
            return;
          }

          setMessage("Đã lưu project.");
          router.push(`/admin/projects/${slug}`);
          router.refresh();
        });
      }}
    >
      <div className="brut-card grid gap-5 p-6">
        <div className="grid gap-5 md:grid-cols-2">
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
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Year" name="year" defaultValue={project?.year || "2026"} required />
          <Field label="Role" name="role" defaultValue={project?.role} required />
          <Field label="Status" name="status" defaultValue={project?.status || "In progress"} required />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Stack" name="stack" defaultValue={project?.stack.join("\n")} multiline rows={4} />
          <Field label="Tags" name="tags" defaultValue={project?.tags.join("\n")} multiline rows={4} />
        </div>
        <Field label="Cover path" name="cover" defaultValue={project?.cover || "/images/project-portfolio.svg"} />
        <div className="grid gap-5 md:grid-cols-2">
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
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-3 text-sm font-bold">
            <input name="featured" type="checkbox" defaultChecked={project?.featured} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-3 text-sm font-bold">
            <input name="draft" type="checkbox" defaultChecked={project?.draft} />
            Draft, ẩn khỏi public site
          </label>
        </div>
      </div>

      <div className="brut-card grid gap-3 p-6">
        <Field
          label="Markdown/MDX case study"
          name="content"
          defaultValue={project?.content || "## Project này là gì?\n\nMô tả project ở đây."}
          multiline
          rows={20}
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="brut-card brut-press rounded-[var(--radius)] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving" : "Save project"}
        </button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
