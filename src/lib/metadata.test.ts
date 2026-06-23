import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./metadata";

describe("absoluteUrl", () => {
  it("keeps absolute image URLs unchanged", () => {
    expect(
      absoluteUrl("https://res.cloudinary.com/demo/image/upload/sample.jpg")
    ).toBe("https://res.cloudinary.com/demo/image/upload/sample.jpg");
  });

  it("normalizes local paths against the site URL", () => {
    expect(absoluteUrl("/blog/demo")).toBe("http://localhost:3000/blog/demo");
  });
});
