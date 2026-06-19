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
    "brut-press border-[2.5px] border-[var(--ink)] shadow-[var(--shadow-sm)] bg-[var(--accent)] text-[var(--ink)]",
  outline:
    "brut-press border-[2.5px] border-[var(--ink)] shadow-[var(--shadow-sm)] bg-[var(--surface)] text-[var(--ink)]",
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
        "inline-flex items-center gap-2 rounded-[var(--radius)] px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]",
        variants[variant],
        className
      )}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden size={16} weight="bold" />
    </Link>
  );
}
