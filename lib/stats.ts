import { ClickEventType, ConversionType, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

export function formatRatio(numerator: number, denominator: number): string {
  if (denominator === 0) return "—";
  return formatPercent(numerator / denominator);
}

export function toNumber(value: Prisma.Decimal | number | null | undefined): number {
  if (value == null) return 0;
  return Number(value);
}

async function countConversions(
  where: Prisma.ConversionEventWhereInput,
  type: ConversionType,
): Promise<number> {
  return prisma.conversionEvent.count({
    where: { ...where, type },
  });
}

async function countClickEvents(
  where: Prisma.ClickLogWhereInput,
  eventType?: ClickEventType,
): Promise<number> {
  return prisma.clickLog.count({
    where: eventType ? { ...where, eventType } : where,
  });
}

export type CampaignStats = {
  id: string;
  name: string;
  status: string;
  slug: string;
  xHandle: string;
  xProfileUrl: string;
  profileImageUrl: string | null;
  budget: number;
  referralVisits: number;
  downloadClicks: number;
  iosDownloads: number;
  androidDownloads: number;
  downloadRate: number | null;
  signups: number;
  firstVerifiedReceipts: number;
  cac: number | null;
};

export async function getCampaignStats(campaignId: string): Promise<CampaignStats | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) return null;

  const clickWhere = { campaignId };
  const conversionWhere = { campaignId };

  const [
    referralVisits,
    iosDownloads,
    androidDownloads,
    signups,
    firstVerifiedReceipts,
  ] = await Promise.all([
    countClickEvents(clickWhere, ClickEventType.REFERRAL_LANDING),
    countClickEvents(clickWhere, ClickEventType.DOWNLOAD_IOS),
    countClickEvents(clickWhere, ClickEventType.DOWNLOAD_ANDROID),
    countConversions(conversionWhere, ConversionType.SIGNUP),
    countConversions(conversionWhere, ConversionType.FIRST_RECEIPT_VERIFIED),
  ]);

  const downloadClicks = iosDownloads + androidDownloads;
  const spend = toNumber(campaign.budget);

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    slug: campaign.slug,
    xHandle: campaign.xHandle,
    xProfileUrl: campaign.xProfileUrl,
    profileImageUrl: campaign.profileImageUrl,
    budget: spend,
    referralVisits,
    downloadClicks,
    iosDownloads,
    androidDownloads,
    downloadRate: referralVisits > 0 ? downloadClicks / referralVisits : null,
    signups,
    firstVerifiedReceipts,
    cac: firstVerifiedReceipts > 0 ? spend / firstVerifiedReceipts : null,
  };
}

export async function getAllCampaignStats(): Promise<CampaignStats[]> {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  const stats = await Promise.all(
    campaigns.map((campaign) => getCampaignStats(campaign.id)),
  );

  return stats.filter((item): item is CampaignStats => item !== null);
}
