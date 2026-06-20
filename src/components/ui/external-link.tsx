import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { clsx } from "clsx";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  size?: "default" | "compact";
  variant?: "solid" | "outline" | "text";
};

const variants = {
  solid:
    "brut-press border-[var(--border-w)] border-[var(--ink)] shadow-[var(--shadow-sm)] bg-[var(--accent)] text-[var(--ink)]",
  outline:
    "brut-press border-[var(--border-w)] border-[var(--ink)] shadow-[var(--shadow-sm)] bg-[var(--surface)] text-[var(--ink)]",
  text: "text-[var(--ink)] underline-offset-4 hover:underline"
};

const sizes = {
  default: "gap-2 px-3.5 py-1.5 text-sm font-semibold",
  compact: "gap-1.5 px-2.5 py-1 text-xs font-semibold"
};

export function ExternalLink({
  href,
  children,
  className,
  showArrow = true,
  size = "default",
  variant = "outline"
}: ExternalLinkProps) {
  const sizeClassName =
    variant === "text" && size === "compact"
      ? "gap-1.5 px-0 py-0 text-xs font-medium leading-5"
      : sizes[size];

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "inline-flex items-center rounded-[var(--radius)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]",
        sizeClassName,
        variants[variant],
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">{children}</span>
      {showArrow ? (
        <ArrowUpRight aria-hidden size={size === "compact" ? 13 : 15} weight="bold" />
      ) : null}
    </Link>
  );
}
