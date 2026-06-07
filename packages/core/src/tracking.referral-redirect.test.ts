import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getReferralRedirectTarget } from "./referral-redirect";

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1";

const IPAD_UA =
  "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1";

const WINDOWS_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const MACOS_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const UNKNOWN_MOBILE_UA =
  "Mozilla/5.0 (Mobile; rv:120.0) Gecko/120.0 Firefox/120.0";

describe("getReferralRedirectTarget", () => {
  it("returns android for Android devices", () => {
    assert.equal(getReferralRedirectTarget(ANDROID_UA), "android");
  });

  it("returns ios for iPhone", () => {
    assert.equal(getReferralRedirectTarget(IPHONE_UA), "ios");
  });

  it("returns ios for iPad", () => {
    assert.equal(getReferralRedirectTarget(IPAD_UA), "ios");
  });

  it("returns desktop for Windows", () => {
    assert.equal(getReferralRedirectTarget(WINDOWS_UA), "desktop");
  });

  it("returns desktop for macOS (not App Store)", () => {
    assert.equal(getReferralRedirectTarget(MACOS_UA), "desktop");
  });

  it("returns desktop for unrecognized mobile", () => {
    assert.equal(getReferralRedirectTarget(UNKNOWN_MOBILE_UA), "desktop");
  });

  it("returns desktop for null user agent", () => {
    assert.equal(getReferralRedirectTarget(null), "desktop");
  });
});
