import { createHash } from "crypto";
import { cookies, headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { ClickEventType } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export type CampaignSlugTarget = {
  campaignId: string;
  slug: string;
};

export const REFERRAL_COOKIE_NAME = "nam_ref";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function resolveCampaignSlug(
  slug: string,
): Promise<CampaignSlugTarget | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  });

  if (!campaign) return null;

  return {
    campaignId: campaign.id,
    slug: campaign.slug,
  };
}

export async function isCampaignSlugTaken(
  slug: string,
  excludeCampaignId?: string,
): Promise<boolean> {
  const campaign = await prisma.campaign.findUnique({ where: { slug } });
  if (!campaign) return false;
  return campaign.id !== excludeCampaignId;
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "default-salt";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export type { ReferralRedirectTarget } from "@/lib/referral-redirect";
export { getReferralRedirectTarget } from "@/lib/referral-redirect";

export function parseUserAgent(userAgent: string | null) {
  const parser = new UAParser(userAgent ?? undefined);
  const result = parser.getResult();

  return {
    deviceType: result.device.type ?? "desktop",
    os: result.os.name
      ? `${result.os.name}${result.os.version ? ` ${result.os.version}` : ""}`
      : "unknown",
    browser: result.browser.name
      ? `${result.browser.name}${result.browser.version ? ` ${result.browser.version}` : ""}`
      : "unknown",
  };
}

export async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headerStore.get("x-real-ip") ?? "unknown";
}

export async function getReferralSlugFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFERRAL_COOKIE_NAME)?.value ?? null;
}

export async function logCampaignClick(params: {
  target: CampaignSlugTarget;
  eventType: ClickEventType;
  userAgent: string | null;
  referrer: string | null;
  ip: string;
}) {
  const parsed = parseUserAgent(params.userAgent);

  await prisma.clickLog.create({
    data: {
      campaignId: params.target.campaignId,
      slug: params.target.slug,
      eventType: params.eventType,
      userAgent: params.userAgent,
      deviceType: parsed.deviceType,
      os: parsed.os,
      browser: parsed.browser,
      referrer: params.referrer,
      ipHash: hashIp(params.ip),
    },
  });
}
