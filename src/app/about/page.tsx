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
    <div className="mx-auto grid max-w-7xl gap-14 px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-5">
          <p className="eyebrow">{about.eyebrow}</p>
          <h1 className="display-hero max-w-5xl">{about.title}</h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            {about.intro}
          </p>
        </section>
      </Reveal>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal className="grid content-start gap-2.5">
          <p className="eyebrow">Interests</p>
          <h2 className="display-section">{about.interestsTitle}</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2.5">
            {about.interests.map((interest, index) => (
              <div
                key={interest}
                className="brut-card inline-flex items-center gap-2 rounded-[var(--radius)] px-3.5 py-2 text-sm font-semibold"
              >
                <span aria-hidden className="mono text-xs text-[var(--muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {interest}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="grid gap-6">
        <Reveal className="grid gap-2.5">
          <p className="eyebrow eyebrow--plain">How I work</p>
          <h2 className="display-section">{about.practicesTitle}</h2>
        </Reveal>
        <div className="grid gap-3.5 md:grid-cols-3">
          {about.practices.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="brut-card grid h-full gap-3 p-5">
                <span
                  aria-hidden
                  className="mono text-2xl font-bold text-[var(--accent)]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-semibold tracking-[-0.005em]">
                  {item.title}
                </h3>
                <p className="leading-7 text-[var(--muted)]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="brut-card grid gap-4 p-5 md:p-10">
          <p className="eyebrow eyebrow--plain">What's next</p>
          <h2 className="display-section">{about.directionTitle}</h2>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
            {about.directionBody}
          </p>
        </section>
      </Reveal>
    </div>
  );
}
