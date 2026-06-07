import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeDatabaseUrl } from "./database-url";

describe("normalizeDatabaseUrl", () => {
  it("upgrades sslmode=require to verify-full", () => {
    const url = normalizeDatabaseUrl(
      "postgresql://user:pass@host/db?sslmode=require",
    );
    assert.equal(new URL(url).searchParams.get("sslmode"), "verify-full");
  });

  it("adds verify-full when sslmode is missing", () => {
    const url = normalizeDatabaseUrl("postgresql://user:pass@host/db");
    assert.equal(new URL(url).searchParams.get("sslmode"), "verify-full");
  });

  it("leaves verify-full unchanged", () => {
    const input = "postgresql://user:pass@host/db?sslmode=verify-full";
    assert.equal(normalizeDatabaseUrl(input), input);
  });
});
