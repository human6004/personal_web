"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Images } from "@phosphor-icons/react";
import {
  readableAssetName,
  type CloudinaryMediaAsset
} from "@/lib/cloudinary/media";
import { CloudinaryUploadButton } from "./cloudinary-upload-button";

type MediaResponse = {
  assets: CloudinaryMediaAsset[];
  nextCursor: string | null;
};

type MediaLibraryProps = {
  folder: string;
  onSelect?: (asset: CloudinaryMediaAsset) => void;
};

export function MediaLibrary({ folder, onSelect }: MediaLibraryProps) {
  const [assets, setAssets] = useState<CloudinaryMediaAsset[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedPublicId, setCopiedPublicId] = useState("");

  const loadAssets = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError("");

    const query = cursor ? `?nextCursor=${encodeURIComponent(cursor)}` : "";
    const response = await fetch(`/api/admin/cloudinary/resources${query}`);

    if (!response.ok) {
      setError("Could not load the media library.");
      setLoading(false);
      return;
    }

    const data = (await response.json()) as MediaResponse;
    setAssets((current) => (cursor ? [...current, ...data.assets] : data.assets));
    setNextCursor(data.nextCursor);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  function handleUploaded(asset: CloudinaryMediaAsset) {
    setAssets((current) => [asset, ...current]);
    onSelect?.(asset);
  }

  async function copyUrl(asset: CloudinaryMediaAsset) {
    await navigator.clipboard?.writeText(asset.secureUrl);
    setCopiedPublicId(asset.publicId);
    window.setTimeout(() => setCopiedPublicId(""), 1600);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <Images size={18} weight="bold" aria-hidden />
          <span>{folder}</span>
        </div>
        <CloudinaryUploadButton folder={folder} label="Upload image" onSelect={handleUploaded} />
      </div>

      {error ? <p className="text-sm text-[var(--muted)]">{error}</p> : null}

      {!loading && assets.length === 0 && !error ? (
        <div className="brut-card grid gap-2 p-5">
          <p className="font-display text-lg font-semibold">No Cloudinary images yet.</p>
          <p className="text-sm leading-6 text-[var(--muted)]">
            Upload the first image, then reuse it here for covers, avatar,
            or MDX content.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <article key={asset.publicId} className="brut-card grid overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden border-b-[var(--border-w)] border-[var(--ink)] bg-[var(--surface-strong)]">
              <img
                src={asset.thumbnailUrl || asset.secureUrl}
                alt={readableAssetName(asset)}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid gap-3 p-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{readableAssetName(asset)}</p>
                <p className="truncate text-xs text-[var(--muted)]">{asset.publicId}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(asset)}
                    className="brut-card brut-press rounded-[var(--radius)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
                  >
                    Select
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => void copyUrl(asset)}
                  className="brut-card brut-press inline-flex items-center gap-1.5 rounded-[var(--radius)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
                >
                  {copiedPublicId === asset.publicId ? (
                    <Check size={14} weight="bold" aria-hidden />
                  ) : (
                    <Copy size={14} weight="bold" aria-hidden />
                  )}
                  Copy URL
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {nextCursor ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => void loadAssets(nextCursor)}
          className="brut-card brut-press w-fit rounded-[var(--radius)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading" : "Load more"}
        </button>
      ) : null}
    </div>
  );
}
