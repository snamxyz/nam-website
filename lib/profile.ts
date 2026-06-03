import { Platform } from "@/generated/prisma/client";

export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = trimmed.startsWith("http") ? new URL(trimmed) : new URL(`https://${trimmed}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function inferPlatformFromUrl(input: string): Platform {
  const normalized = normalizeUrl(input);
  if (!normalized) return Platform.OTHER;

  const host = new URL(normalized).hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtu.be" || host.endsWith("youtube.com")) return Platform.YOUTUBE;
  if (host.endsWith("instagram.com")) return Platform.INSTAGRAM;
  if (host.endsWith("tiktok.com")) return Platform.TIKTOK;
  return Platform.OTHER;
}

export function formatPlatform(platform: Platform | string): string {
  switch (platform) {
    case Platform.YOUTUBE:
      return "YouTube";
    case Platform.INSTAGRAM:
      return "Instagram";
    case Platform.TIKTOK:
      return "TikTok";
    case Platform.OTHER:
    default:
      return "Other";
  }
}

export function sanitizeSlugSeed(input: string, fallback = "creator"): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

  if (slug.length >= 2) return slug;
  return fallback;
}

