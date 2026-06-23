"use client";

import { useEffect, useRef, useState } from "react";
import { FolderOpen, UploadSimple, X } from "@phosphor-icons/react";
import type { CloudinaryMediaAsset } from "@/lib/cloudinary/media";
import {
  createPendingImageId,
  createPendingImageToken,
  isPendingImageToken,
  type PendingImageUpload
} from "@/lib/cloudinary/pending-upload";
import { MediaPickerDialog } from "./media-picker-dialog";

type MediaFieldProps = {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  folder: string;
  help?: string;
  onValueChange?: (value: string) => void;
  onPendingChange?: (upload: PendingImageUpload | null) => void;
};

export function MediaField({
  label,
  name,
  value,
  defaultValue = "",
  folder,
  help,
  onValueChange,
  onPendingChange
}: MediaFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isControlled = typeof value === "string";
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = isControlled ? value : innerValue;
  const [pendingUpload, setPendingUpload] = useState<PendingImageUpload | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (pendingUpload?.previewUrl) {
        URL.revokeObjectURL(pendingUpload.previewUrl);
      }
    };
  }, [pendingUpload?.previewUrl]);

  useEffect(() => {
    if (pendingUpload && !isPendingImageToken(currentValue)) {
      setPendingUpload(null);
      onPendingChange?.(null);
    }
  }, [currentValue, onPendingChange, pendingUpload]);

  function setFieldValue(nextValue: string) {
    if (!isControlled) {
      setInnerValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function replacePendingUpload(nextUpload: PendingImageUpload | null) {
    if (pendingUpload?.previewUrl && pendingUpload.previewUrl !== nextUpload?.previewUrl) {
      URL.revokeObjectURL(pendingUpload.previewUrl);
    }

    setPendingUpload(nextUpload);
    onPendingChange?.(nextUpload);

    if (!nextUpload && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function selectAsset(asset: CloudinaryMediaAsset) {
    setMessage("");
    replacePendingUpload(null);
    setFieldValue(asset.secureUrl);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Only image files are allowed.");
      return;
    }

    const id = createPendingImageId();
    const upload = {
      id,
      file,
      folder,
      previewUrl: URL.createObjectURL(file),
      altText: file.name.replace(/\.[^.]+$/, "") || "Image"
    };

    setMessage("");
    replacePendingUpload(upload);
    setFieldValue(createPendingImageToken(id));
  }

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage("");
    replacePendingUpload(null);
    setFieldValue(event.target.value);
  }

  function clearPendingUpload() {
    setMessage("");
    replacePendingUpload(null);
    setFieldValue(defaultValue);
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <input name={name} type="hidden" value={currentValue} />
        <input
          type="text"
          value={pendingUpload ? `Pending local image: ${pendingUpload.file.name}` : currentValue}
          onChange={handleTextChange}
          readOnly={Boolean(pendingUpload)}
          className="brut-input text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="brut-card brut-press inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--ink)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[var(--ink)]">
            <UploadSimple size={16} weight="bold" aria-hidden />
            Upload
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label={`Choose local ${label.toLowerCase()}`}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="brut-card brut-press inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          >
            <FolderOpen size={16} weight="bold" aria-hidden />
            Library
          </button>
          {pendingUpload ? (
            <button
              type="button"
              onClick={clearPendingUpload}
              className="brut-card brut-press inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              <X size={16} weight="bold" aria-hidden />
              Clear
            </button>
          ) : null}
        </div>
      </div>
      {currentValue || pendingUpload ? (
        <div className="max-w-sm overflow-hidden rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface)]">
          <img
            src={pendingUpload?.previewUrl || currentValue}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}
      {message ? <span className="text-xs leading-5 text-red-700">{message}</span> : null}
      {help ? <span className="text-xs leading-5 text-[var(--muted)]">{help}</span> : null}
      <MediaPickerDialog
        folder={folder}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={selectAsset}
      />
    </div>
  );
}
