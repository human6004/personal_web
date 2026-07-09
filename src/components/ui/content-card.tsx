import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

type ContentCardProps = {
  href: string;
  title: string;
  cover: string;
  coverAlt: string;
  ariaLabel: string;
  meta: React.ReactNode;
  summary: string;
  footer?: React.ReactNode;
  priority?: boolean;
  /** tô một dải màu category ở mép trên ảnh */
  accent?: string;
  coverAspect?: string;
  className?: string;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]";

// Card dùng chung cho post + project. Slot-based, tránh copy-paste 2 file.
export function ContentCard({
  href,
  title,
  cover,
  coverAlt,
  ariaLabel,
  meta,
  summary,
  footer,
  priority = false,
  accent,
  coverAspect = "aspect-[16/7]",
  className
}: ContentCardProps) {
  return (
    <article
      className={clsx(
        "brut-card brut-press group flex h-full flex-col overflow-hidden",
        className
      )}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className={clsx(
          "relative block overflow-hidden border-b-[var(--border-w)] border-[var(--ink)]",
          focusRing
        )}
      >
        {accent ? (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 z-10 h-1.5"
            style={{ background: accent }}
          />
        ) : null}
        <Image
          src={cover}
          alt={coverAlt}
          width={960}
          height={620}
          priority={priority}
          unoptimized
          className={clsx(
            coverAspect,
            "w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
          )}
        />
      </Link>
      <div className="flex h-full flex-col gap-2.5 p-3.5 sm:p-4">
        <div className="grid gap-2">
          {meta}
          <div className="grid gap-1.5">
            <h3 className="content-card-title font-display text-lg font-semibold leading-snug tracking-[-0.005em]">
              <Link href={href} className={focusRing}>
                {title}
              </Link>
            </h3>
            <p className="content-card-summary text-sm leading-6 text-[var(--muted)]">
              {summary}
            </p>
          </div>
        </div>
        {footer ? <div className="mt-auto pt-1">{footer}</div> : null}
      </div>
    </article>
  );
}
