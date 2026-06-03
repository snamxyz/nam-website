import { Platform } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { inferPlatformFromUrl, normalizeUrl } from "@/lib/profile";

export type VideoMetrics = {
  views: number;
  likes: number;
  comments: number;
};

function toCount(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 0;
}

export function getYouTubeVideoId(input: string): string | null {
  const normalized = normalizeUrl(input);
  if (!normalized) return null;

  const url = new URL(normalized);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] ?? null;
  if (host.endsWith("youtube.com")) {
    if (url.pathname === "/watch") return url.searchParams.get("v");
    const segments = url.pathname.split("/").filter(Boolean);
    if (["shorts", "embed", "live"].includes(segments[0] ?? "")) {
      return segments[1] ?? null;
    }
  }

  return null;
}

function getInstagramMediaId(input: string): string | null {
  const normalized = normalizeUrl(input);
  if (!normalized) return null;

  const url = new URL(normalized);
  return url.searchParams.get("media_id") ?? url.searchParams.get("id");
}

function getTikTokVideoId(input: string): string | null {
  const normalized = normalizeUrl(input);
  if (!normalized) return null;

  const url = new URL(normalized);
  const segments = url.pathname.split("/").filter(Boolean);
  const videoIndex = segments.findIndex((segment) => segment === "video");
  return videoIndex >= 0 ? segments[videoIndex + 1] ?? null : null;
}

async function fetchYouTubeMetrics(videoUrl: string): Promise<VideoMetrics> {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_DATA_API_KEY is not set.");

  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) throw new Error("Could not parse a YouTube video ID from this URL.");

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "statistics");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API returned ${response.status}.`);
  }

  const data = (await response.json()) as {
    items?: Array<{ statistics?: { viewCount?: string; likeCount?: string; commentCount?: string } }>;
  };
  const statistics = data.items?.[0]?.statistics;
  if (!statistics) throw new Error("YouTube video was not found or has no public statistics.");

  return {
    views: toCount(statistics.viewCount),
    likes: toCount(statistics.likeCount),
    comments: toCount(statistics.commentCount),
  };
}

async function fetchInstagramMetrics(videoUrl: string): Promise<VideoMetrics> {
  const accessToken = process.env.INSTAGRAM_GRAPH_ACCESS_TOKEN;
  if (!accessToken) throw new Error("INSTAGRAM_GRAPH_ACCESS_TOKEN is not set.");

  const mediaId = getInstagramMediaId(videoUrl);
  if (!mediaId) {
    throw new Error(
      "Official Instagram insights require an Instagram Media ID. Add ?media_id=... to the stored URL or use a URL containing an id query parameter.",
    );
  }

  const host = process.env.INSTAGRAM_GRAPH_HOST ?? "graph.instagram.com";
  const version = process.env.INSTAGRAM_GRAPH_VERSION ?? "v25.0";
  const url = new URL(`https://${host}/${version}/${mediaId}/insights`);
  url.searchParams.set("metric", "views,likes,comments");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Instagram Graph API returned ${response.status}.`);
  }

  const data = (await response.json()) as {
    data?: Array<{ name?: string; values?: Array<{ value?: number }>; total_value?: { value?: number } }>;
  };

  const metrics = new Map(
    data.data?.map((item) => [
      item.name,
      toCount(item.total_value?.value ?? item.values?.[0]?.value),
    ]) ?? [],
  );

  return {
    views: metrics.get("views") ?? metrics.get("total_views") ?? 0,
    likes: metrics.get("likes") ?? metrics.get("total_likes") ?? 0,
    comments: metrics.get("comments") ?? metrics.get("total_comments") ?? 0,
  };
}

function formatTikTokDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

async function fetchTikTokMetrics(videoUrl: string, postedDate: Date | null): Promise<VideoMetrics> {
  const accessToken = process.env.TIKTOK_RESEARCH_ACCESS_TOKEN;
  if (!accessToken) throw new Error("TIKTOK_RESEARCH_ACCESS_TOKEN is not set.");

  const videoId = getTikTokVideoId(videoUrl);
  if (!videoId) throw new Error("Could not parse a TikTok video ID from this URL.");
  if (!postedDate) {
    throw new Error("TikTok Research API requires a posted date to query the 30-day window.");
  }

  const start = new Date(postedDate);
  start.setUTCDate(start.getUTCDate() - 15);
  const end = new Date(postedDate);
  end.setUTCDate(end.getUTCDate() + 15);

  const url = new URL("https://open.tiktokapis.com/v2/research/video/query/");
  url.searchParams.set("fields", "id,view_count,like_count,comment_count");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        and: [
          {
            operation: "EQ",
            field_name: "video_id",
            field_values: [videoId],
          },
        ],
      },
      start_date: formatTikTokDate(start),
      end_date: formatTikTokDate(end),
      max_count: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`TikTok Research API returned ${response.status}.`);
  }

  const data = (await response.json()) as {
    data?: { videos?: Array<{ view_count?: number; like_count?: number; comment_count?: number }> };
  };
  const video = data.data?.videos?.[0];
  if (!video) throw new Error("TikTok video was not found in the requested date window.");

  return {
    views: toCount(video.view_count),
    likes: toCount(video.like_count),
    comments: toCount(video.comment_count),
  };
}

export async function fetchVideoMetrics(params: {
  videoUrl: string;
  platform: Platform;
  postedDate: Date | null;
}): Promise<VideoMetrics> {
  const platform = params.platform === Platform.OTHER ? inferPlatformFromUrl(params.videoUrl) : params.platform;

  switch (platform) {
    case Platform.YOUTUBE:
      return fetchYouTubeMetrics(params.videoUrl);
    case Platform.INSTAGRAM:
      return fetchInstagramMetrics(params.videoUrl);
    case Platform.TIKTOK:
      return fetchTikTokMetrics(params.videoUrl, params.postedDate);
    case Platform.OTHER:
    default:
      throw new Error("Choose YouTube, Instagram, or TikTok to fetch metrics.");
  }
}

export async function refreshVideoMetrics(videoId: string): Promise<void> {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) return;

  try {
    const metrics = await fetchVideoMetrics({
      videoUrl: video.videoUrl,
      platform: video.platform,
      postedDate: video.postedDate,
    });

    await prisma.video.update({
      where: { id: video.id },
      data: {
        ...metrics,
        metricsFetchedAt: new Date(),
        metricsFetchError: null,
      },
    });
  } catch (error) {
    await prisma.video.update({
      where: { id: video.id },
      data: {
        metricsFetchedAt: new Date(),
        metricsFetchError: error instanceof Error ? error.message : "Failed to fetch metrics.",
      },
    });
  }
}

