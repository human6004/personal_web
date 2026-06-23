import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PendingImageUpload } from "@/lib/cloudinary/pending-upload";
import { MdxEditorField } from "./mdx-editor-field";

describe("MdxEditorField pending uploads", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("inserts a pending token for local MDX images without uploading immediately", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    const onPendingChange = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:inline"),
      revokeObjectURL: vi.fn()
    });

    render(
      <MdxEditorField
        label="Content"
        name="content"
        defaultValue="Intro"
        folder="personal-web/posts"
        onPendingChange={onPendingChange}
      />
    );

    await user.upload(
      screen.getByLabelText(/choose local content image/i),
      new File(["image"], "inline.png", { type: "image/png" })
    );

    expect(
      (screen.getByRole("textbox", { name: /content/i }) as HTMLTextAreaElement).value
    ).toContain("pending://");
    expect(onPendingChange).toHaveBeenCalledWith([
      expect.objectContaining({ file: expect.any(File), folder: "personal-web/posts" })
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not update the parent while rendering", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    function Wrapper() {
      const [, setPendingUploads] = useState<PendingImageUpload[]>([]);

      return (
        <MdxEditorField
          label="Content"
          name="content"
          defaultValue="Intro"
          folder="personal-web/posts"
          onPendingChange={setPendingUploads}
        />
      );
    }

    render(<Wrapper />);

    expect(
      consoleError.mock.calls.some(([message]) =>
        String(message).includes("Cannot update a component")
      )
    ).toBe(false);
  });
});
