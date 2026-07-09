import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";

// Nội dung MDX do admin viết. Chặn 2 lớp:
// 1. mdxOptions.format "md" ở dưới -> parser coi <script>/<img onerror> là text thô,
//    không compile thành JSX thật (mặc định "mdx" thì compile thẳng thành createElement).
// 2. href protocol check ở đây -> markdown link `[x](javascript:...)` vẫn ra <a href>
//    bình thường dù ở format nào, nên phải tự chặn protocol nguy hiểm.
const dangerousProtocols = new Set(["javascript:", "data:", "vbscript:"]);

function isDangerousHref(href: string) {
  try {
    return dangerousProtocols.has(new URL(href).protocol);
  } catch {
    return false;
  }
}

const components: MDXComponents = {
  h2: (props) => <h2 className="article-heading" {...props} />,
  h3: (props) => <h3 className="article-subheading" {...props} />,
  p: (props) => <p className="article-paragraph" {...props} />,
  ul: (props) => <ul className="article-list" {...props} />,
  ol: (props) => <ol className="article-list list-decimal" {...props} />,
  li: (props) => <li className="article-list-item" {...props} />,
  a: (props) => {
    const rawHref = typeof props.href === "string" ? props.href : undefined;
    const href = rawHref && !isDangerousHref(rawHref) ? rawHref : undefined;

    return (
      <a
        className="article-link"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
        href={href}
      />
    );
  },
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
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { format: "md" } }}
      />
    </div>
  );
}
