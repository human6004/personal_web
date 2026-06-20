"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { EditableProfile } from "@/lib/profile";
import { Field } from "./field";

function splitLines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfileForm({ profile }: { profile: EditableProfile }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");
        const formData = new FormData(event.currentTarget);
        const payload: EditableProfile = {
          name: String(formData.get("name") || ""),
          title: String(formData.get("title") || ""),
          description: String(formData.get("description") || ""),
          tagline: String(formData.get("tagline") || ""),
          englishTagline: String(formData.get("englishTagline") || ""),
          socials: {
            github: String(formData.get("github") || ""),
            linkedin: String(formData.get("linkedin") || ""),
            facebook: String(formData.get("facebook") || ""),
            email: String(formData.get("email") || ""),
            cv: String(formData.get("cv") || "")
          },
          home: {
            heroEyebrow: String(formData.get("heroEyebrow") || ""),
            heroTitle: String(formData.get("heroTitle") || ""),
            heroDescription: String(formData.get("heroDescription") || ""),
            nowTitle: String(formData.get("nowTitle") || ""),
            nowBody: splitLines(formData.get("nowBody"))
          },
          about: {
            metadataDescription: String(formData.get("metadataDescription") || ""),
            eyebrow: String(formData.get("aboutEyebrow") || "About"),
            title: String(formData.get("aboutTitle") || ""),
            intro: String(formData.get("aboutIntro") || ""),
            interestsTitle: String(formData.get("interestsTitle") || ""),
            interests: splitLines(formData.get("interests")),
            practicesTitle: String(formData.get("practicesTitle") || ""),
            practices: [
              {
                title: String(formData.get("practice1Title") || ""),
                body: String(formData.get("practice1Body") || "")
              },
              {
                title: String(formData.get("practice2Title") || ""),
                body: String(formData.get("practice2Body") || "")
              },
              {
                title: String(formData.get("practice3Title") || ""),
                body: String(formData.get("practice3Body") || "")
              }
            ].filter((item) => item.title && item.body),
            directionTitle: String(formData.get("directionTitle") || ""),
            directionBody: String(formData.get("directionBody") || "")
          }
        };

        startTransition(async () => {
          const response = await fetch("/api/admin/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const data = (await response.json().catch(() => ({}))) as { error?: string };
            setMessage(data.error || "Không lưu được profile.");
            return;
          }

          setMessage("Đã lưu profile.");
          router.refresh();
        });
      }}
    >
      <section className="brut-card grid gap-4 p-5">
        <h2 className="font-display text-xl font-semibold tracking-[-0.005em]">Site identity</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" name="name" defaultValue={profile.name} required />
          <Field label="Site title" name="title" defaultValue={profile.title} required />
        </div>
        <Field label="Description" name="description" defaultValue={profile.description} multiline rows={3} required />
        <Field label="Tagline" name="tagline" defaultValue={profile.tagline} multiline rows={3} required />
        <Field label="English tagline" name="englishTagline" defaultValue={profile.englishTagline} />
      </section>

      <section className="brut-card grid gap-4 p-5">
        <h2 className="font-display text-xl font-semibold tracking-[-0.005em]">Social links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="GitHub" name="github" defaultValue={profile.socials.github} />
          <Field label="LinkedIn" name="linkedin" defaultValue={profile.socials.linkedin} />
          <Field label="Facebook" name="facebook" defaultValue={profile.socials.facebook} />
          <Field label="Email" name="email" defaultValue={profile.socials.email} />
          <Field label="CV URL" name="cv" defaultValue={profile.socials.cv} />
        </div>
      </section>

      <section className="brut-card grid gap-4 p-5">
        <h2 className="font-display text-xl font-semibold tracking-[-0.005em]">Homepage</h2>
        <Field label="Hero eyebrow" name="heroEyebrow" defaultValue={profile.home.heroEyebrow} />
        <Field label="Hero title" name="heroTitle" defaultValue={profile.home.heroTitle} required />
        <Field label="Hero description" name="heroDescription" defaultValue={profile.home.heroDescription} multiline rows={3} required />
        <Field label="Now title" name="nowTitle" defaultValue={profile.home.nowTitle} required />
        <Field label="Now body" name="nowBody" defaultValue={profile.home.nowBody.join("\n")} multiline rows={5} required help="Mỗi dòng là một đoạn văn." />
      </section>

      <section className="brut-card grid gap-4 p-5">
        <h2 className="font-display text-xl font-semibold tracking-[-0.005em]">About</h2>
        <Field label="Metadata description" name="metadataDescription" defaultValue={profile.about.metadataDescription} multiline rows={3} required />
        <Field label="Eyebrow" name="aboutEyebrow" defaultValue={profile.about.eyebrow} />
        <Field label="About title" name="aboutTitle" defaultValue={profile.about.title} required />
        <Field label="Intro" name="aboutIntro" defaultValue={profile.about.intro} multiline rows={5} required />
        <Field label="Interests title" name="interestsTitle" defaultValue={profile.about.interestsTitle} required />
        <Field label="Interests" name="interests" defaultValue={profile.about.interests.join("\n")} multiline rows={6} required />
        <Field label="Practices title" name="practicesTitle" defaultValue={profile.about.practicesTitle} required />
        {[0, 1, 2].map((index) => (
          <div key={index} className="grid gap-3.5 rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface-strong)] p-3.5 md:grid-cols-2">
            <Field label={`Practice ${index + 1} title`} name={`practice${index + 1}Title`} defaultValue={profile.about.practices[index]?.title || ""} />
            <Field label={`Practice ${index + 1} body`} name={`practice${index + 1}Body`} defaultValue={profile.about.practices[index]?.body || ""} multiline rows={3} />
          </div>
        ))}
        <Field label="Direction title" name="directionTitle" defaultValue={profile.about.directionTitle} required />
        <Field label="Direction body" name="directionBody" defaultValue={profile.about.directionBody} multiline rows={4} required />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="brut-card brut-press rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving" : "Save profile"}
        </button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
