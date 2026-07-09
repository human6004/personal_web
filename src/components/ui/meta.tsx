import { clsx } from "clsx";

type MetaItem = {
  label: React.ReactNode;
  key?: string;
  dateTime?: string;
};

type MetaProps = {
  items: Array<MetaItem | string>;
  className?: string;
  size?: "card" | "detail";
};

const sizeClass = {
  card: "text-[0.66rem] uppercase tracking-[0.11em]",
  detail: "text-sm"
};

// Meta-row với dấu · phân tách (mono). Gom pattern lặp ở card + detail header.
export function Meta({ items, className, size = "card" }: MetaProps) {
  const normalized = items.map((item) =>
    typeof item === "string" ? { label: item } : item
  );

  return (
    <div
      className={clsx(
        "mono flex min-w-0 flex-wrap items-center gap-1.5 font-medium text-[var(--muted)]",
        sizeClass[size],
        className
      )}
    >
      {normalized.map((item, index) => (
        <span key={item.key ?? index} className="contents">
          {index > 0 ? (
            <span aria-hidden className="text-[var(--accent)]">
              ·
            </span>
          ) : null}
          {item.dateTime ? (
            <time dateTime={item.dateTime}>{item.label}</time>
          ) : (
            <span className="min-w-0 truncate">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
