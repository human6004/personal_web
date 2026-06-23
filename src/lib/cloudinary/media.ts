export type CloudinaryMediaAsset = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  createdAt: string;
  bytes: number;
  thumbnailUrl?: string;
  displayName?: string;
};

type CloudinaryResourceLike = {
  public_id?: unknown;
  secure_url?: unknown;
  width?: unknown;
  height?: unknown;
  format?: unknown;
  created_at?: unknown;
  bytes?: unknown;
  thumbnail_url?: unknown;
  display_name?: unknown;
  original_filename?: unknown;
};

export function mapCloudinaryResource(
  resource: CloudinaryResourceLike
): CloudinaryMediaAsset | null {
  if (
    typeof resource.public_id !== "string" ||
    typeof resource.secure_url !== "string"
  ) {
    return null;
  }

  return {
    publicId: resource.public_id,
    secureUrl: resource.secure_url,
    width: typeof resource.width === "number" ? resource.width : 0,
    height: typeof resource.height === "number" ? resource.height : 0,
    format: typeof resource.format === "string" ? resource.format : "",
    createdAt: typeof resource.created_at === "string" ? resource.created_at : "",
    bytes: typeof resource.bytes === "number" ? resource.bytes : 0,
    thumbnailUrl:
      typeof resource.thumbnail_url === "string" ? resource.thumbnail_url : undefined,
    displayName:
      typeof resource.display_name === "string"
        ? resource.display_name
        : typeof resource.original_filename === "string"
          ? resource.original_filename
          : undefined
  } satisfies CloudinaryMediaAsset;
}

export function assetFromUploadInfo(info: unknown) {
  if (!info || typeof info !== "object") {
    return null;
  }

  return mapCloudinaryResource(info as CloudinaryResourceLike);
}

export function readableAssetName(asset: Pick<CloudinaryMediaAsset, "publicId" | "displayName">) {
  if (asset.displayName) {
    return asset.displayName;
  }

  return asset.publicId.split("/").pop() || "image";
}

export function insertMarkdownImage(
  source: string,
  imageUrl: string,
  altText = "Image",
  selectionStart = source.length,
  selectionEnd = selectionStart
) {
  const start = Math.max(0, Math.min(selectionStart, source.length));
  const end = Math.max(start, Math.min(selectionEnd, source.length));
  const before = source.slice(0, start);
  const after = source.slice(end);
  const prefix = before && !before.endsWith("\n") ? "\n\n" : "";
  const suffix = after && !after.startsWith("\n") ? "\n\n" : "";
  const markdown = `${prefix}![${altText}](${imageUrl})${suffix}`;
  const value = `${before}${markdown}${after}`;

  return {
    value,
    cursor: before.length + markdown.length
  };
}
