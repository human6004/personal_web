"use client";

import { X } from "@phosphor-icons/react";
import type { CloudinaryMediaAsset } from "@/lib/cloudinary/media";
import { MediaLibrary } from "./media-library";

type MediaPickerDialogProps = {
  folder: string;
  open: boolean;
  title?: string;
  onClose: () => void;
  onSelect: (asset: CloudinaryMediaAsset) => void;
};

export function MediaPickerDialog({
  folder,
  open,
  title = "Choose image",
  onClose,
  onSelect
}: MediaPickerDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid bg-[rgba(20,18,16,0.42)] p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="brut-card m-auto grid max-h-[88dvh] w-full max-w-6xl gap-5 overflow-auto bg-[var(--paper)] p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.01em]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="brut-card brut-press inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-[var(--surface)] text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            aria-label="Close media picker"
          >
            <X size={18} weight="bold" aria-hidden />
          </button>
        </div>
        <MediaLibrary
          folder={folder}
          onSelect={(asset) => {
            onSelect(asset);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
