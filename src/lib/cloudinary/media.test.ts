import { describe, expect, it } from "vitest";
import {
  insertMarkdownImage,
  mapCloudinaryResource,
  readableAssetName
} from "./media";

describe("cloudinary media helpers", () => {
  it("maps Cloudinary resources into admin media assets", () => {
    expect(
      mapCloudinaryResource({
        public_id: "personal-web/posts/demo",
        secure_url: "https://res.cloudinary.com/demo/image/upload/demo.jpg",
        width: 1200,
        height: 800,
        format: "jpg",
        created_at: "2026-06-23T00:00:00Z",
        bytes: 12345,
        display_name: "Demo cover"
      })
    ).toEqual({
      publicId: "personal-web/posts/demo",
      secureUrl: "https://res.cloudinary.com/demo/image/upload/demo.jpg",
      width: 1200,
      height: 800,
      format: "jpg",
      createdAt: "2026-06-23T00:00:00Z",
      bytes: 12345,
      thumbnailUrl: undefined,
      displayName: "Demo cover"
    });
  });

  it("rejects incomplete Cloudinary resources", () => {
    expect(mapCloudinaryResource({ public_id: "missing-url" })).toBeNull();
  });

  it("uses the public id as a readable fallback name", () => {
    expect(readableAssetName({ publicId: "personal-web/blog/photo", displayName: "" })).toBe(
      "photo"
    );
  });

  it("inserts markdown images at the selected textarea position", () => {
    const result = insertMarkdownImage(
      "Intro\n\nOutro",
      "https://res.cloudinary.com/demo/image/upload/photo.jpg",
      "Photo",
      7,
      7
    );

    expect(result.value).toBe(
      "Intro\n\n![Photo](https://res.cloudinary.com/demo/image/upload/photo.jpg)\n\nOutro"
    );
    expect(result.cursor).toBe(73);
  });
});
