import { LinkButton } from "./link-button";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  size?: "default" | "compact";
  variant?: "solid" | "outline" | "text";
};

export function ExternalLink(props: ExternalLinkProps) {
  return <LinkButton {...props} external />;
}
