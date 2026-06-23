import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertCloudinaryPublicIdsInUploadFolder,
  assertCloudinaryUploadFolder,
  maxCloudinaryImageSizeBytes,
  sanitizeSignatureParams,
  validateCloudinaryImageFile
} from "./server";

describe("cloudinary server helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps only safe signable upload params", () => {
    expect(
      sanitizeSignatureParams({
        timestamp: 123,
        folder: "personal-web/posts",
        tags: ["post", "cover"],
        file: "ignored",
        signature: "ignored",
        api_key: "ignored",
        nested: { nope: true },
        empty: null
      })
    ).toEqual({
      timestamp: 123,
      folder: "personal-web/posts",
      tags: ["post", "cover"]
    });
  });

  it("accepts folders under the configured Cloudinary root", () => {
    vi.stubEnv("CLOUDINARY_UPLOAD_FOLDER", "personal-web");

    expect(assertCloudinaryUploadFolder("personal-web/posts")).toBe("personal-web/posts");
  });

  it("rejects folders outside the configured Cloudinary root", () => {
    vi.stubEnv("CLOUDINARY_UPLOAD_FOLDER", "personal-web");

    expect(() => assertCloudinaryUploadFolder("other-web/posts")).toThrow(
      "Invalid Cloudinary folder"
    );
    expect(() => assertCloudinaryUploadFolder("personal-web/../other")).toThrow(
      "Invalid Cloudinary folder"
    );
  });

  it("rejects public ids outside the configured Cloudinary root", () => {
    vi.stubEnv("CLOUDINARY_UPLOAD_FOLDER", "personal-web");

    expect(assertCloudinaryPublicIdsInUploadFolder(["personal-web/posts/demo"])).toEqual([
      "personal-web/posts/demo"
    ]);
    expect(() => assertCloudinaryPublicIdsInUploadFolder(["other/demo"])).toThrow(
      "Invalid Cloudinary public id"
    );
  });

  it("validates pending image files before upload", () => {
    const image = new File(["image"], "cover.png", { type: "image/png" });

    expect(validateCloudinaryImageFile(image)).toBe(image);
    expect(() =>
      validateCloudinaryImageFile(new File(["text"], "notes.txt", { type: "text/plain" }))
    ).toThrow("Only image uploads are allowed");
    expect(() =>
      validateCloudinaryImageFile(
        new File([new Uint8Array(maxCloudinaryImageSizeBytes + 1)], "large.png", {
          type: "image/png"
        })
      )
    ).toThrow("Image must be 10MB or smaller");
  });
});
