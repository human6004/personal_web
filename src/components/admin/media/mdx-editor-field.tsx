"use client";

import { useEffect, useRef, useState } from "react";
import { FolderOpen, UploadSimple } from "@phosphor-icons/react";
import {
  insertMarkdownImage,
  readableAssetName,
  type CloudinaryMediaAsset
} from "@/lib/cloudinary/media";
import {
  createPendingImageId,
  createPendingImageToken,
  findPendingImageTokenIds,
  type PendingImageUpload
} from "@/lib/cloudinary/pending-upload";
import { MediaPickerDialog } from "./media-picker-dialog";

type MdxEditorFieldProps = {
  label: string;
  name: string;
  value?: string;
  defaultValue: string;
  folder: string;
  rows?: number;
  required?: boolean;
  onValueChange?: (value: string) => void;
  onPendingChange?: (uploads: PendingImageUpload[]) => void;
};

export function MdxEditorField({
  label,
  name,
  value,
  defaultValue,
  folder,
  rows = 18,
  required = false,
  onValueChange,
  onPendingChange
}: MdxEditorFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadsRef = useRef<PendingImageUpload[]>([]);
  const isControlled = typeof value === "string";
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = isControlled ? value : innerValue;
  const [pendingUploads, setPendingUploads] = useState<PendingImageUpload[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    onPendingChange?.(pendingUploads);
  }, [onPendingChange, pendingUploads]);

  useEffect(() => {
    pendingUploadsRef.current = pendingUploads;
  }, [pendingUploads]);

  useEffect(() => {
    return () => {
      for (const upload of pendingUploadsRef.current) {
        URL.revokeObjectURL(upload.previewUrl);
      }
    };
  }, []);

  useEffect(() => {
    prunePendingUploads(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  function setEditorValue(nextValue: string) {
    if (!isControlled) {
      setInnerValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function updatePendingUploads(updater: (uploads: PendingImageUpload[]) => PendingImageUpload[]) {
    setPendingUploads((uploads) => {
      const nextUploads = updater(uploads);

      if (
        nextUploads.length === uploads.length &&
        nextUploads.every((upload, index) => upload === uploads[index])
      ) {
        return uploads;
      }

      return nextUploads;
    });
  }

  function prunePendingUploads(source: string) {
    const activeIds = new Set(findPendingImageTokenIds(source));

    updatePendingUploads((uploads) => {
      const nextUploads = uploads.filter((upload) => activeIds.has(upload.id));

      for (const upload of uploads) {
        if (!activeIds.has(upload.id)) {
          URL.revokeObjectURL(upload.previewUrl);
        }
      }

      return nextUploads;
    });
  }

  function insertAsset(asset: CloudinaryMediaAsset) {
    const textarea = textareaRef.current;
    const result = insertMarkdownImage(
      currentValue,
      asset.secureUrl,
      readableAssetName(asset),
      textarea?.selectionStart,
      textarea?.selectionEnd
    );

    setMessage("");
    setEditorValue(result.value);
    window.requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(result.cursor, result.cursor);
    });
  }

  function insertPendingFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setMessage("Only image files are allowed.");
      return;
    }

    const textarea = textareaRef.current;
    const id = createPendingImageId();
    const altText = file.name.replace(/\.[^.]+$/, "") || "Image";
    const upload = {
      id,
      file,
      folder,
      previewUrl: URL.createObjectURL(file),
      altText
    };
    const result = insertMarkdownImage(
      currentValue,
      createPendingImageToken(id),
      altText,
      textarea?.selectionStart,
      textarea?.selectionEnd
    );

    setMessage("");
    updatePendingUploads((uploads) => [...uploads, upload]);
    setEditorValue(result.value);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(result.cursor, result.cursor);
    });
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        <div className="flex flex-wrap items-center gap-2">
          <label className="brut-card brut-press inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--ink)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[var(--ink)]">
            <UploadSimple size={16} weight="bold" aria-hidden />
            Upload image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label={`Choose local ${label.toLowerCase()} image`}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];

                if (file) {
                  insertPendingFile(file);
                }
              }}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="brut-card brut-press inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          >
            <FolderOpen size={16} weight="bold" aria-hidden />
            Insert from library
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        name={name}
        aria-label={label}
        value={currentValue}
        onChange={(event) => {
          setMessage("");
          setEditorValue(event.target.value);
          prunePendingUploads(event.target.value);
        }}
        rows={rows}
        required={required}
        className="brut-input text-sm"
      />
      {pendingUploads.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pendingUploads.map((upload) => (
            <span
              key={upload.id}
              className="inline-flex items-center rounded-[var(--radius)] border-[var(--border-w)] border-[var(--ink)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs font-semibold"
            >
              {upload.file.name}
            </span>
          ))}
        </div>
      ) : null}
      {message ? <span className="text-xs leading-5 text-red-700">{message}</span> : null}
      <span className="text-xs leading-5 text-[var(--muted)]">
        Local images are uploaded when the form is saved.
      </span>
      <MediaPickerDialog
        folder={folder}
        open={pickerOpen}
        title="Insert image"
        onClose={() => setPickerOpen(false)}
        onSelect={insertAsset}
      />
    </div>
  );
}
