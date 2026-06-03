import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Platform } from "@/generated/prisma/client";
import { inferPlatformFromUrl, normalizeUrl, sanitizeSlugSeed } from "./profile";

describe("profile helpers", () => {
  it("normalizes bare URLs", () => {
    assert.equal(normalizeUrl("youtube.com/@creator"), "https://youtube.com/@creator");
  });

  it("detects supported video platforms", () => {
    assert.equal(inferPlatformFromUrl("https://www.youtube.com/watch?v=abc"), Platform.YOUTUBE);
    assert.equal(inferPlatformFromUrl("https://instagram.com/reel/abc"), Platform.INSTAGRAM);
    assert.equal(inferPlatformFromUrl("https://www.tiktok.com/@user/video/123"), Platform.TIKTOK);
    assert.equal(inferPlatformFromUrl("https://example.com/post"), Platform.OTHER);
  });

  it("sanitizes slug seeds", () => {
    assert.equal(sanitizeSlugSeed("Creator Launch Video!"), "creator-launch-video");
  });
});

