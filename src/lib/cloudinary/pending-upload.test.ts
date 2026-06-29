import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanupUploadedAssets,
  createPendingImageToken,
  getPendingImageId,
  replacePendingImageTokens,
  resolvePendingMarkdown,
  resolvePendingMediaValue,
  selectPendingUploadsForMarkdown,
  uploadPendingImage,
  type PendingImageUpload
} from "./pending-upload";

const imageFile = new File(["image"], "cover.png", { type: "image/png" });

function pendingUpload(id: string): PendingImageUpload {
  return {
    id,
    file: imageFile,
    folder: "personal-web/posts",
    previewUrl: `blob:${id}`,
    altText: "Cover"
  };
}

const uploadedAsset = {
  publicId: "personal-web/posts/cover",
  secureUrl: "https://res.cloudinary.com/demo/image/upload/cover.png",
  width: 1200,
  height: 800,
  format: "png",
  createdAt: "2026-06-23T00:00:00Z",
  bytes: 1234
};

describe("pending Cloudinary uploads", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates and resolves pending image tokens", () => {
    expect(createPendingImageToken("image-1")).toBe("pending://image-1");
    expect(getPendingImageId("pending://image-1")).toBe("image-1");
    expect(getPendingImageId("https://example.com/image.png")).toBeNull();
  });

  it("selects only pending MDX uploads still referenced by content", () => {
    expect(
      selectPendingUploadsForMarkdown(
        "![Cover](pending://keep)\n\nDeleted token is gone.",
        [pendingUpload("keep"), pendingUpload("drop")]
      ).map((upload) => upload.id)
    ).toEqual(["keep"]);
  });

  it("replaces pending MDX tokens with Cloudinary URLs", () => {
    expect(
      replacePendingImageTokens("![Cover](pending://image-1)", {
        "image-1": uploadedAsset.secureUrl
      })
    ).toBe(`![Cover](${uploadedAsset.secureUrl})`);
  });

  it("uploads a pending image only when explicitly resolved", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ asset: uploadedAsset })
    });
    vi.stubGlobal("fetch", fetchMock);

    const asset = await uploadPendingImage(pendingUpload("cover"));

    expect(asset).toEqual(uploadedAsset);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/cloudinary/upload",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("resolves pending cover and MDX values during save", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ asset: uploadedAsset })
    });
    vi.stubGlobal("fetch", fetchMock);

    const uploaded: (typeof uploadedAsset)[] = [];
    await expect(
      resolvePendingMediaValue("pending://cover", pendingUpload("cover"), uploaded)
    ).resolves.toBe(uploadedAsset.secureUrl);
    await expect(
      resolvePendingMarkdown("Intro\n\n![Cover](pending://mdx)", [pendingUpload("mdx")], uploaded)
    ).resolves.toContain(uploadedAsset.secureUrl);
    expect(uploaded).toEqual([uploadedAsset, uploadedAsset]);
  });

  it("cleans up uploaded assets when save fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await cleanupUploadedAssets([uploadedAsset]);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/cloudinary/delete",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ publicIds: [uploadedAsset.publicId] })
      })
    );
  });
});
