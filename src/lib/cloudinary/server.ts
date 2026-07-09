import { v2 as cloudinary } from "cloudinary";
import { mapCloudinaryResource, type CloudinaryMediaAsset } from "./media";

export const defaultCloudinaryUploadFolder = "personal-web";
export const maxCloudinaryImageSizeBytes = 10 * 1024 * 1024;

const allowedImageMimeTypes = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

export class CloudinaryMediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryMediaValidationError";
  }
}

type CloudinarySettings = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadFolder: string;
};

function readCloudinarySettings(): CloudinarySettings {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "",
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim() || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim() || "",
    uploadFolder:
      process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || defaultCloudinaryUploadFolder
  };
}

export function getCloudinaryUploadFolder() {
  return readCloudinarySettings().uploadFolder;
}

export function hasCloudinaryConfig() {
  const settings = readCloudinarySettings();
  return Boolean(settings.cloudName && settings.apiKey && settings.apiSecret);
}

export function getRequiredCloudinarySettings() {
  const settings = readCloudinarySettings();

  if (!settings.cloudName || !settings.apiKey || !settings.apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }

  return settings;
}

function configuredCloudinary() {
  const settings = getRequiredCloudinarySettings();

  cloudinary.config({
    cloud_name: settings.cloudName,
    api_key: settings.apiKey,
    api_secret: settings.apiSecret,
    secure: true
  });

  return cloudinary;
}

function normalizeCloudinaryPath(value: string) {
  return value
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .join("/");
}

function getNormalizedUploadFolder() {
  return normalizeCloudinaryPath(getCloudinaryUploadFolder());
}

function isInsideUploadFolder(value: string, allowRoot = false) {
  const uploadFolder = getNormalizedUploadFolder();

  return allowRoot
    ? value === uploadFolder || value.startsWith(`${uploadFolder}/`)
    : value.startsWith(`${uploadFolder}/`);
}

function hasUnsafePathSegment(value: string) {
  return value.split("/").some((segment) => segment === "." || segment === "..");
}

export function assertCloudinaryUploadFolder(folder: unknown, options?: { allowRoot?: boolean }) {
  if (typeof folder !== "string") {
    throw new CloudinaryMediaValidationError("Invalid Cloudinary folder.");
  }

  const normalized = normalizeCloudinaryPath(folder);
  if (
    !normalized ||
    hasUnsafePathSegment(normalized) ||
    !isInsideUploadFolder(normalized, options?.allowRoot ?? false)
  ) {
    throw new CloudinaryMediaValidationError("Invalid Cloudinary folder.");
  }

  return normalized;
}

export function assertCloudinaryPublicIdsInUploadFolder(publicIds: unknown) {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    throw new CloudinaryMediaValidationError("Invalid Cloudinary public id.");
  }

  return publicIds.map((publicId) => {
    if (typeof publicId !== "string") {
      throw new CloudinaryMediaValidationError("Invalid Cloudinary public id.");
    }

    const normalized = normalizeCloudinaryPath(publicId);
    if (
      !normalized ||
      hasUnsafePathSegment(normalized) ||
      !isInsideUploadFolder(normalized, false)
    ) {
      throw new CloudinaryMediaValidationError("Invalid Cloudinary public id.");
    }

    return normalized;
  });
}

export function validateCloudinaryImageFile(file: unknown) {
  if (
    !file ||
    typeof file !== "object" ||
    typeof (file as File).arrayBuffer !== "function" ||
    typeof (file as File).type !== "string" ||
    typeof (file as File).size !== "number"
  ) {
    throw new CloudinaryMediaValidationError("Image file is required.");
  }

  const imageFile = file as File;

  if (!allowedImageMimeTypes.has(imageFile.type)) {
    throw new CloudinaryMediaValidationError("Only image uploads are allowed.");
  }

  if (imageFile.size <= 0) {
    throw new CloudinaryMediaValidationError("Image file is required.");
  }

  if (imageFile.size > maxCloudinaryImageSizeBytes) {
    throw new CloudinaryMediaValidationError("Image must be 10MB or smaller.");
  }

  return imageFile;
}

type SignableValue = string | number | boolean | string[] | number[];

export function sanitizeSignatureParams(paramsToSign: unknown) {
  if (!paramsToSign || typeof paramsToSign !== "object") {
    throw new Error("Invalid Cloudinary signature payload.");
  }

  return Object.entries(paramsToSign as Record<string, unknown>).reduce(
    (params, [key, value]) => {
      if (
        value === null ||
        typeof value === "undefined" ||
        key === "file" ||
        key === "signature" ||
        key === "api_key"
      ) {
        return params;
      }

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        params[key] = value;
        return params;
      }

      if (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string" || typeof item === "number")
      ) {
        params[key] = value as string[] | number[];
      }

      return params;
    },
    {} as Record<string, SignableValue>
  );
}

export function signCloudinaryUploadParams(paramsToSign: unknown) {
  const settings = getRequiredCloudinarySettings();
  const params = sanitizeSignatureParams(paramsToSign);

  if (typeof params.folder === "string") {
    params.folder = assertCloudinaryUploadFolder(params.folder, { allowRoot: true });
  }

  // public_id điều khiển cả path lưu trên Cloudinary; nếu không validate, client có thể
  // ký một public_id ngoài upload folder (hoặc trùng asset khác) và overwrite nó.
  if (typeof params.public_id === "string") {
    params.public_id = assertCloudinaryUploadFolder(params.public_id, { allowRoot: true });
  }

  return cloudinary.utils.api_sign_request(params, settings.apiSecret);
}

export async function uploadCloudinaryImage(file: File, folder: string) {
  const safeFolder = assertCloudinaryUploadFolder(folder);
  const client = configuredCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<unknown>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: safeFolder,
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
        use_filename: true
      },
      (error, uploadResult) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(uploadResult);
      }
    );

    stream.end(buffer);
  });
  const asset = mapCloudinaryResource(result as Record<string, unknown>);

  if (!asset) {
    throw new Error("Cloudinary upload did not return a valid image.");
  }

  return asset;
}

export async function deleteCloudinaryImages(publicIds: string[]) {
  const safePublicIds = assertCloudinaryPublicIdsInUploadFolder(publicIds);
  const client = configuredCloudinary();

  await Promise.all(
    safePublicIds.map((publicId) =>
      client.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true
      })
    )
  );
}

type CloudinaryResourcesResponse = {
  resources?: unknown[];
  next_cursor?: string;
};

export async function listCloudinaryResources(nextCursor?: string) {
  const client = configuredCloudinary();
  const uploadFolder = getCloudinaryUploadFolder();
  const response = (await client.api.resources({
    type: "upload",
    resource_type: "image",
    prefix: `${uploadFolder}/`,
    max_results: 30,
    next_cursor: nextCursor || undefined,
    direction: "desc"
  })) as CloudinaryResourcesResponse;

  return {
    assets: (response.resources || [])
      .map((resource) => mapCloudinaryResource(resource as Record<string, unknown>))
      .filter((asset): asset is CloudinaryMediaAsset => Boolean(asset)),
    nextCursor: response.next_cursor || null
  };
}
