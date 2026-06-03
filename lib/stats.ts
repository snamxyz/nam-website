import { ClickEventType, ConversionType, Platform, Prisma } from "@/generated/prisma/client";
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
  platform: Platform;
  profileUrl: string;
  contactInfo: string | null;
  profileImageUrl: string | null;
  archivedAt: Date | null;
  budget: number;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  fixedFees: number;
  estimatedCpmSpend: number;
  uncappedSpend: number;
  cappedSpend: number;
  referralVisits: number;
  downloadClicks: number;
  iosDownloads: number;
  androidDownloads: number;
  downloadRate: number | null;
  signups: number;
  firstVerifiedReceipts: number;
  cac: number | null;
};

export type VideoStats = {
  id: string;
  name: string;
  videoUrl: string;
  platform: Platform;
  plannedDate: Date | null;
  postedDate: Date | null;
  fixedFee: number;
  variableFee: number;
  maxBudget: number | null;
  slug: string;
  views: number;
  likes: number;
  comments: number;
  metricsFetchedAt: Date | null;
  metricsFetchError: string | null;
  estimatedCpmSpend: number;
  uncappedSpend: number;
  cappedSpend: number;
};

export function getVideoSpend(video: {
  fixedFee: Prisma.Decimal | number;
  variableFee: Prisma.Decimal | number;
  maxBudget: Prisma.Decimal | number | null;
  views: number;
}) {
  const fixedFee = toNumber(video.fixedFee);
  const estimatedCpmSpend = (video.views / 1000) * toNumber(video.variableFee);
  const uncappedSpend = fixedFee + estimatedCpmSpend;
  const maxBudget = video.maxBudget == null ? null : toNumber(video.maxBudget);
  const cappedSpend = maxBudget == null ? uncappedSpend : Math.min(uncappedSpend, maxBudget);

  return {
    fixedFee,
    estimatedCpmSpend,
    uncappedSpend,
    cappedSpend,
  };
}

function toVideoStats(video: {
  id: string;
  name: string;
  videoUrl: string;
  platform: Platform;
  plannedDate: Date | null;
  postedDate: Date | null;
  fixedFee: Prisma.Decimal;
  variableFee: Prisma.Decimal;
  maxBudget: Prisma.Decimal | null;
  slug: string;
  views: number;
  likes: number;
  comments: number;
  metricsFetchedAt: Date | null;
  metricsFetchError: string | null;
}): VideoStats {
  const spend = getVideoSpend(video);

  return {
    id: video.id,
    name: video.name,
    videoUrl: video.videoUrl,
    platform: video.platform,
    plannedDate: video.plannedDate,
    postedDate: video.postedDate,
    fixedFee: spend.fixedFee,
    variableFee: toNumber(video.variableFee),
    maxBudget: video.maxBudget == null ? null : toNumber(video.maxBudget),
    slug: video.slug,
    views: video.views,
    likes: video.likes,
    comments: video.comments,
    metricsFetchedAt: video.metricsFetchedAt,
    metricsFetchError: video.metricsFetchError,
    estimatedCpmSpend: spend.estimatedCpmSpend,
    uncappedSpend: spend.uncappedSpend,
    cappedSpend: spend.cappedSpend,
  };
}

export async function getCampaignStats(campaignId: string): Promise<CampaignStats | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { videos: true },
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
  const videos = campaign.videos.map(toVideoStats);
  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0);
  const totalComments = videos.reduce((sum, video) => sum + video.comments, 0);
  const fixedFees = videos.reduce((sum, video) => sum + video.fixedFee, 0);
  const estimatedCpmSpend = videos.reduce((sum, video) => sum + video.estimatedCpmSpend, 0);
  const uncappedSpend = videos.reduce((sum, video) => sum + video.uncappedSpend, 0);
  const cappedSpend = videos.reduce((sum, video) => sum + video.cappedSpend, 0);

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    slug: campaign.slug,
    platform: campaign.platform,
    profileUrl: campaign.profileUrl,
    contactInfo: campaign.contactInfo,
    profileImageUrl: campaign.profileImageUrl,
    archivedAt: campaign.archivedAt,
    budget: toNumber(campaign.budget),
    videoCount: videos.length,
    totalViews,
    totalLikes,
    totalComments,
    fixedFees,
    estimatedCpmSpend,
    uncappedSpend,
    cappedSpend,
    referralVisits,
    downloadClicks,
    iosDownloads,
    androidDownloads,
    downloadRate: referralVisits > 0 ? downloadClicks / referralVisits : null,
    signups,
    firstVerifiedReceipts,
    cac: firstVerifiedReceipts > 0 ? cappedSpend / firstVerifiedReceipts : null,
  };
}

export async function getCampaignVideoStats(campaignId: string): Promise<VideoStats[]> {
  const videos = await prisma.video.findMany({
    where: { campaignId },
    orderBy: [{ postedDate: "desc" }, { createdAt: "desc" }],
  });

  return videos.map(toVideoStats);
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
