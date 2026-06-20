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
  const size = compact ? "compact" : "default";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showCaseStudy ? (
        <InternalLink href={caseStudyHref} variant="solid" size={size}>
          View case study
        </InternalLink>
      ) : null}

      {project.repoUrl && !privateRepo ? (
        <ExternalLink
          href={project.repoUrl}
          variant={compact ? "text" : "outline"}
          size={size}
          showArrow={!compact}
          className={compact ? "text-[var(--muted)] hover:text-[var(--ink)]" : undefined}
        >
          <GithubLogo aria-hidden size={compact ? 15 : 17} weight="fill" />
          GitHub repo
        </ExternalLink>
      ) : null}

      {privateRepo ? (
        <span
          className={
            compact
              ? "inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]"
              : "inline-flex items-center gap-1.5 rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)]"
          }
        >
          <LockSimple aria-hidden size={15} />
          Private repo
        </span>
      ) : null}

      {project.demoUrl ? (
        <ExternalLink
          href={project.demoUrl}
          variant={compact ? "text" : "outline"}
          size={size}
          showArrow={!compact}
          className={compact ? "text-[var(--muted)] hover:text-[var(--ink)]" : undefined}
        >
          <RocketLaunch aria-hidden size={compact ? 15 : 17} />
          Live demo
        </ExternalLink>
      ) : null}
    </div>
  );
}
