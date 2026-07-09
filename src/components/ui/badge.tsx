import { clsx } from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  /** màu chấm dẫn (dùng cho category/tag) */
  accent?: string;
};

export function Badge({ children, className, accent }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)] px-2.5 py-0.5 text-sm font-medium text-[var(--ink)]",
        className
      )}
    >
      {accent ? (
        <span
          aria-hidden
          className="h-2 w-2 rounded-full border border-[var(--ink)]"
          style={{ background: accent }}
        />
      ) : null}
      {children}
    </span>
  );
}
