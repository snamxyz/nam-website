const X_HOSTS = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com"]);

export type ParsedXProfile = {
  handle: string;
  profileUrl: string;
};

export function parseXProfileUrl(input: string): ParsedXProfile | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = trimmed.startsWith("http") ? new URL(trimmed) : new URL(`https://${trimmed}`);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (!X_HOSTS.has(host) && !X_HOSTS.has(url.hostname.toLowerCase())) {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;

    const handle = segments[0]!.replace(/^@/, "").toLowerCase();
    if (!/^[a-z0-9_]{1,15}$/i.test(handle)) return null;

    return {
      handle,
      profileUrl: `https://x.com/${handle}`,
    };
  } catch {
    const handle = trimmed.replace(/^@/, "").toLowerCase();
    if (/^[a-z0-9_]{1,15}$/i.test(handle)) {
      return {
        handle,
        profileUrl: `https://x.com/${handle}`,
      };
    }
    return null;
  }
}

export function sanitizeCampaignSlug(handle: string, override?: string): string {
  const base = (override || handle).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (base.length >= 2) return base.slice(0, 64);
  return handle.toLowerCase().slice(0, 64);
}

export async function fetchXProfileImageUrl(handle: string): Promise<string> {
  const fallback = `https://unavatar.io/x/${encodeURIComponent(handle)}`;

  try {
    const response = await fetch(
      `https://unavatar.io/x/${encodeURIComponent(handle)}?json`,
      { next: { revalidate: 86400 } },
    );

    if (!response.ok) return fallback;

    const data = (await response.json()) as { url?: string };
    if (data.url) return data.url;
  } catch {
    // fall through to fallback
  }

  return fallback;
}
