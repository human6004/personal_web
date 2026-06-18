import type { Metadata } from "next";
import { Reveal } from "@/components/sections/reveal";
import { buildMetadata } from "@/lib/metadata";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return buildMetadata({
    title: "About",
    description: profile.about.metadataDescription,
    path: "/about"
  });
}

export default async function AboutPage() {
  const profile = await getProfile();
  const about = profile.about;

  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-6">
          <p className="max-w-fit rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)]">
            {about.eyebrow}
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
            {about.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {about.intro}
          </p>
        </section>
      </Reveal>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">
            {about.interestsTitle}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {about.interests.map((interest) => (
              <div
                key={interest}
                className="rounded-[18px] border border-[var(--line)] bg-[var(--paper)] p-4 text-sm font-medium"
              >
                {interest}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="grid gap-6">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">
            {about.practicesTitle}
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {about.practices.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="h-full rounded-[24px] border border-[var(--line)] bg-[var(--paper)] p-6">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-[var(--muted)]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 md:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">
            {about.directionTitle}
          </h2>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {about.directionBody}
          </p>
        </section>
      </Reveal>
    </div>
  );
}
