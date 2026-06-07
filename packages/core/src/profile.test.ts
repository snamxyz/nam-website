import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeUrl, sanitizeSlugSeed } from "./profile";

describe("profile helpers", () => {
  it("normalizes bare URLs", () => {
    assert.equal(normalizeUrl("youtube.com/@creator"), "https://youtube.com/@creator");
  });

  it("sanitizes slug seeds", () => {
    assert.equal(sanitizeSlugSeed("Creator Launch Video!"), "creator-launch-video");
  });
});
