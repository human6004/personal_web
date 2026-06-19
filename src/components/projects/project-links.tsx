import { GithubLogo, LockSimple, RocketLaunch } from "@phosphor-icons/react/dist/ssr";
import { isPrivateRepo, type Project } from "@/lib/content";
import { ExternalLink } from "@/components/ui/external-link";
import { InternalLink } from "@/components/ui/internal-link";

type ProjectLinksProps = {
  project: Project;
  showCaseStudy?: boolean;
  compact?: boolean;
};

export function ProjectLinks({
  project,
  showCaseStudy = true,
  compact = false
}: ProjectLinksProps) {
  const privateRepo = isPrivateRepo(project);
  const caseStudyHref = project.caseStudyUrl || `/projects/${project.slug}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showCaseStudy ? (
        <InternalLink href={caseStudyHref} variant="solid">
          View case study
        </InternalLink>
      ) : null}

      {project.repoUrl && !privateRepo ? (
        <ExternalLink href={project.repoUrl} variant="outline">
          <GithubLogo aria-hidden size={compact ? 16 : 18} weight="fill" />
          GitHub repo
        </ExternalLink>
      ) : null}

      {privateRepo ? (
        <span className="inline-flex items-center gap-2 rounded-[var(--radius)] border-[2.5px] border-[var(--ink)] px-4 py-2 text-sm font-bold text-[var(--ink)]">
          <LockSimple aria-hidden size={16} />
          Private repo
        </span>
      ) : null}

      {project.demoUrl ? (
        <ExternalLink href={project.demoUrl} variant="outline">
          <RocketLaunch aria-hidden size={compact ? 16 : 18} />
          Live demo
        </ExternalLink>
      ) : null}
    </div>
  );
}
