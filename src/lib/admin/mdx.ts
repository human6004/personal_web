type FrontmatterValue = string | boolean | string[] | undefined | null;

function formatScalar(value: string | boolean) {
  if (typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

export function serializeMdx(
  data: Record<string, FrontmatterValue>,
  content: string
) {
  const lines: string[] = ["---"];

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return;
      }

      lines.push(`${key}:`);
      value.forEach((item) => {
        lines.push(`  - ${formatScalar(item)}`);
      });
      return;
    }

    lines.push(`${key}: ${formatScalar(value)}`);
  });

  lines.push("---", "", content.trim(), "");
  return lines.join("\n");
}
