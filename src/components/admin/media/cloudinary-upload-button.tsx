"use client";

import { useState } from "react";
import { UploadSimple } from "@phosphor-icons/react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults
} from "next-cloudinary";
import {
  assetFromUploadInfo,
  type CloudinaryMediaAsset
} from "@/lib/cloudinary/media";

type CloudinaryUploadButtonProps = {
  folder: string;
  label?: string;
  onSelect: (asset: CloudinaryMediaAsset) => void;
};

const uploadSources = ["local", "url", "camera"] as const;
const allowedImageFormats = ["jpg", "jpeg", "png", "webp", "gif", "svg"];

export function CloudinaryUploadButton({
  folder,
  label = "Upload",
  onSelect
}: CloudinaryUploadButtonProps) {
  const [message, setMessage] = useState("");
  const cloudinaryReady = Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  );

  if (!cloudinaryReady) {
    return (
      <span className="text-xs leading-5 text-[var(--muted)]">
        Cloudinary env vars are not configured.
      </span>
    );
  }

  function handleSuccess(results: CloudinaryUploadWidgetResults) {
    const asset = assetFromUploadInfo(results.info);

    if (!asset) {
      setMessage("Upload finished, but the image URL could not be read.");
      return;
    }

    setMessage("");
    onSelect(asset);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CldUploadWidget
        signatureEndpoint="/api/admin/cloudinary/signature"
        options={{
          folder,
          multiple: false,
          maxFiles: 1,
          resourceType: "image",
          sources: [...uploadSources],
          clientAllowedFormats: allowedImageFormats,
          maxImageFileSize: 10_000_000
        }}
        onSuccess={handleSuccess}
        onError={() => setMessage("Could not upload the image. Check Cloudinary env vars.")}
      >
        {({ open, isLoading }) => (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => open?.()}
            className="brut-card brut-press inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadSimple size={16} weight="bold" aria-hidden />
            {label}
          </button>
        )}
      </CldUploadWidget>
      {message ? <span className="text-xs text-[var(--muted)]">{message}</span> : null}
    </div>
  );
}
