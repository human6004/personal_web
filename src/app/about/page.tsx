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
    <div className="mx-auto grid max-w-7xl gap-20 px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-6">
          <p className="eyebrow">{about.eyebrow}</p>
          <h1 className="display-hero max-w-5xl">{about.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {about.intro}
          </p>
        </section>
      </Reveal>

      <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal className="grid content-start gap-3">
          <p className="eyebrow">Interests</p>
          <h2 className="display-section">{about.interestsTitle}</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {about.interests.map((interest) => (
              <div
                key={interest}
                className="brut-card rounded-[var(--radius)] p-4 text-sm font-bold"
              >
                {interest}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="grid gap-8">
        <Reveal className="grid gap-3">
          <p className="eyebrow">How I work</p>
          <h2 className="display-section">{about.practicesTitle}</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {about.practices.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="brut-card h-full p-6">
                <h3 className="font-display text-xl font-bold tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-[var(--muted)]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="brut-card grid gap-5 p-6 md:p-12">
          <p className="eyebrow">What's next</p>
          <h2 className="display-section">{about.directionTitle}</h2>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {about.directionBody}
          </p>
        </section>
      </Reveal>
    </div>
  );
}
