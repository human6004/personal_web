import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MediaField } from "./media-field";

describe("MediaField pending uploads", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps a local image pending instead of uploading immediately", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    const onPendingChange = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:cover"),
      revokeObjectURL: vi.fn()
    });

    const { container } = render(
      <MediaField
        label="Cover image"
        name="cover"
        defaultValue="/images/blog-notes.svg"
        folder="personal-web/posts"
        onPendingChange={onPendingChange}
      />
    );

    await user.upload(
      screen.getByLabelText(/choose local cover image/i),
      new File(["image"], "cover.png", { type: "image/png" })
    );

    const hiddenInput = container.querySelector<HTMLInputElement>('input[name="cover"]');
    expect(hiddenInput?.value).toMatch(/^pending:\/\//);
    expect(onPendingChange).toHaveBeenCalledWith(
      expect.objectContaining({ file: expect.any(File), folder: "personal-web/posts" })
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
