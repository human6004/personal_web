import { clsx } from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)] px-2.5 py-0.5 text-sm font-medium text-[var(--ink)]",
        className
      )}
    >
      {children}
    </span>
  );
}
