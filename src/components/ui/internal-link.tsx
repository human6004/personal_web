import { LinkButton } from "./link-button";

type InternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "compact";
  variant?: "solid" | "outline" | "text";
};

export function InternalLink(props: InternalLinkProps) {
  return <LinkButton {...props} />;
}
