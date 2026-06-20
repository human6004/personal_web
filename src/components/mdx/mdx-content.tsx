import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";

const components: MDXComponents = {
  h2: (props) => <h2 className="article-heading" {...props} />,
  h3: (props) => <h3 className="article-subheading" {...props} />,
  p: (props) => <p className="article-paragraph" {...props} />,
  ul: (props) => <ul className="article-list" {...props} />,
  ol: (props) => <ol className="article-list list-decimal" {...props} />,
  li: (props) => <li className="article-list-item" {...props} />,
  a: (props) => (
    <a
      className="article-link"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  img: (props) => {
    const src = typeof props.src === "string" ? props.src : "";
    const alt = typeof props.alt === "string" ? props.alt : "";

    return (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={760}
        unoptimized
        className="my-7 rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] shadow-[var(--shadow)]"
      />
    );
  },
  blockquote: (props) => <blockquote className="article-quote" {...props} />,
  code: (props) => <code className="article-code" {...props} />,
  pre: (props) => <pre className="article-pre" {...props} />
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="article">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
