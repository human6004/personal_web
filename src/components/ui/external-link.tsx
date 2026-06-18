import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { clsx } from "clsx";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "text";
};

const variants = {
  solid:
    "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--accent)] hover:text-[var(--ink)]",
  outline:
    "border border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--surface)]",
  text: "text-[var(--ink)] underline-offset-4 hover:underline"
};

export function ExternalLink({
  href,
  children,
  className,
  variant = "outline"
}: ExternalLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] active:translate-y-px",
        variants[variant],
        className
      )}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden size={16} weight="bold" />
    </Link>
  );
}
