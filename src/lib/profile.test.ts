import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  defaultProfile,
  getProfile,
  getProfileFromFile,
  profileSchema,
  writeProfileToFile
} from "./profile";

let tmpRoot = "";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "");
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "profile-test-"));
});

afterEach(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

describe("profile content", () => {
  it("validates the default editable profile shape", () => {
    const parsed = profileSchema.parse(defaultProfile);

    expect(parsed.name).toBeTruthy();
    expect(parsed.home.avatarImage).toBe("/images/avatar.svg");
    expect(parsed.home.nowBody.length).toBeGreaterThan(0);
    expect(parsed.about.practices[0]).toHaveProperty("title");
  });

  it("falls back to the default profile when profile.json is missing", async () => {
    expect((await getProfile(tmpRoot)).name).toBe(defaultProfile.name);
  });

  it("writes and reads a profile JSON file", async () => {
    const nextProfile = {
      ...defaultProfile,
      name: "Updated Name",
      socials: {
        ...defaultProfile.socials,
        github: "https://github.com/example"
      }
    };

    writeProfileToFile(nextProfile, tmpRoot);

    expect(getProfileFromFile(tmpRoot).name).toBe("Updated Name");
    expect((await getProfile(tmpRoot)).socials.github).toBe(
      "https://github.com/example"
    );
  });

  it("defaults avatarImage for older profile data", () => {
    const parsed = profileSchema.parse({
      ...defaultProfile,
      home: {
        heroEyebrow: defaultProfile.home.heroEyebrow,
        heroTitle: defaultProfile.home.heroTitle,
        heroDescription: defaultProfile.home.heroDescription,
        nowTitle: defaultProfile.home.nowTitle,
        nowBody: defaultProfile.home.nowBody
      }
    });

    expect(parsed.home.avatarImage).toBe("/images/avatar.svg");
  });
});
