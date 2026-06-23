import type { CloudinaryMediaAsset } from "./media";

export type PendingImageUpload = {
  id: string;
  file: File;
  folder: string;
  previewUrl: string;
  altText: string;
};

const pendingImagePrefix = "pending://";
const pendingImagePattern = /pending:\/\/([A-Za-z0-9_-]+)/g;

export function createPendingImageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `image-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createPendingImageToken(id: string) {
  return `${pendingImagePrefix}${id}`;
}

export function getPendingImageId(value: string) {
  if (!value.startsWith(pendingImagePrefix)) {
    return null;
  }

  const id = value.slice(pendingImagePrefix.length);
  return id && /^[A-Za-z0-9_-]+$/.test(id) ? id : null;
}

export function isPendingImageToken(value: string) {
  return Boolean(getPendingImageId(value));
}

export function findPendingImageTokenIds(source: string) {
  const ids = new Set<string>();

  for (const match of source.matchAll(pendingImagePattern)) {
    ids.add(match[1]);
  }

  return [...ids];
}

export function replacePendingImageTokens(source: string, replacements: Record<string, string>) {
  return source.replace(pendingImagePattern, (token, id: string) => replacements[id] || token);
}

export function selectPendingUploadsForMarkdown(
  source: string,
  uploads: PendingImageUpload[]
) {
  const uploadsById = new Map(uploads.map((upload) => [upload.id, upload]));

  return findPendingImageTokenIds(source).map((id) => {
    const upload = uploadsById.get(id);

    if (!upload) {
      throw new Error("Pending image is missing. Please choose it again.");
    }

    return upload;
  });
}

async function readJson(response: Response) {
  return (await response.json().catch(() => ({}))) as {
    asset?: CloudinaryMediaAsset;
    error?: string;
  };
}

export async function uploadPendingImage(upload: PendingImageUpload) {
  const formData = new FormData();
  formData.set("file", upload.file);
  formData.set("folder", upload.folder);

  const response = await fetch("/api/admin/cloudinary/upload", {
    method: "POST",
    body: formData
  });
  const data = await readJson(response);

  if (!response.ok || !data.asset) {
    throw new Error(data.error || "Could not upload image.");
  }

  return data.asset;
}

export async function resolvePendingMediaValue(
  value: string,
  upload: PendingImageUpload | null,
  uploadedAssets: CloudinaryMediaAsset[]
) {
  const id = getPendingImageId(value);

  if (!id) {
    return value;
  }

  if (!upload || upload.id !== id) {
    throw new Error("Pending image is missing. Please choose it again.");
  }

  const asset = await uploadPendingImage(upload);
  uploadedAssets.push(asset);

  return asset.secureUrl;
}

export async function resolvePendingMarkdown(
  source: string,
  uploads: PendingImageUpload[],
  uploadedAssets: CloudinaryMediaAsset[]
) {
  const replacements: Record<string, string> = {};

  for (const upload of selectPendingUploadsForMarkdown(source, uploads)) {
    const asset = await uploadPendingImage(upload);
    uploadedAssets.push(asset);
    replacements[upload.id] = asset.secureUrl;
  }

  return replacePendingImageTokens(source, replacements);
}

export async function cleanupUploadedAssets(assets: CloudinaryMediaAsset[]) {
  const publicIds = [...new Set(assets.map((asset) => asset.publicId).filter(Boolean))];

  if (publicIds.length === 0) {
    return;
  }

  await fetch("/api/admin/cloudinary/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicIds })
  }).catch(() => undefined);
}
