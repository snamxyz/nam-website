export const APP_STORE_URL =
  "https://apps.apple.com/us/app/nam-rewards/id6757811340";

export const PLAY_STORE_BASE_URL =
  "https://play.google.com/store/apps/details?id=xyz.nam.namrewards";

export const PLAY_STORE_PACKAGE = "xyz.nam.namrewards";

export function getPlayStoreUrl(slug?: string): string {
  if (!slug) {
    return PLAY_STORE_BASE_URL;
  }

  const referrer = encodeURIComponent(
    `utm_source=influencer&utm_content=${slug}`,
  );
  return `${PLAY_STORE_BASE_URL}&referrer=${referrer}`;
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.nam.xyz"
  );
}

export function getTrackingUrl(slug: string): string {
  return `${getSiteUrl()}/ref/${slug}`;
}

export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$/;

export function isValidSlug(slug: string): boolean {
  if (slug.length < 2 || slug.length > 64) return false;
  return SLUG_PATTERN.test(slug);
}
