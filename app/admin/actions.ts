"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CampaignStatus, Platform, Prisma } from "@/generated/prisma/client";
import { isValidSlug } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { inferPlatformFromUrl, normalizeUrl, sanitizeSlugSeed } from "@/lib/profile";
import { isCampaignSlugTaken } from "@/lib/tracking";
import { refreshVideoMetrics } from "@/lib/video-metrics";

export type ActionState = {
  error?: string;
  success?: boolean;
};

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  status: z.nativeEnum(CampaignStatus),
  platform: z.nativeEnum(Platform),
  profileUrl: z.string().min(1, "Profile link is required"),
  contactInfo: z.string().optional(),
  slug: z.string().optional(),
});

const videoSchema = z.object({
  campaignId: z.string().min(1, "Creator is required"),
  name: z.string().min(1, "Video name is required"),
  videoUrl: z.string().min(1, "Video link is required"),
  platform: z.union([z.nativeEnum(Platform), z.literal("AUTO")]),
  plannedDate: z.string().optional(),
  postedDate: z.string().optional(),
  fixedFee: z.coerce.number().min(0, "Fixed fee must be zero or greater"),
  variableFee: z.coerce.number().min(0, "Variable fee must be zero or greater"),
  maxBudget: z.string().optional(),
  slug: z.string().optional(),
});

async function validateCampaignSlug(slug: string) {
  if (!isValidSlug(slug)) {
    return "Slug must be 2-64 characters, lowercase letters, numbers, and hyphens only.";
  }

  if (await isCampaignSlugTaken(slug)) {
    return `Slug "${slug}" is already in use by another campaign.`;
  }

  return null;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  while (await isCampaignSlugTaken(slug)) {
    slug = `${baseSlug}${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function isVideoSlugTaken(slug: string): Promise<boolean> {
  const video = await prisma.video.findUnique({ where: { slug } });
  return Boolean(video);
}

async function ensureUniqueVideoSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  while (await isVideoSlugTaken(slug)) {
    slug = `${baseSlug}${suffix}`;
    suffix += 1;
  }

  return slug;
}

function optionalDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function optionalMoney(value: string | undefined): Prisma.Decimal | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return new Prisma.Decimal(parsed);
}

export async function createCampaign(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = campaignSchema.safeParse({
    name: formData.get("name"),
    status: formData.get("status"),
    platform: formData.get("platform"),
    profileUrl: formData.get("profileUrl"),
    contactInfo: String(formData.get("contactInfo") ?? "").trim() || undefined,
    slug: String(formData.get("slug") ?? "").trim() || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid campaign data" };
  }

  const profileUrl = normalizeUrl(parsed.data.profileUrl);
  if (!profileUrl) {
    return { error: "Enter a valid profile link." };
  }

  const requestedSlug = parsed.data.slug
    ? sanitizeSlugSeed(parsed.data.slug)
    : sanitizeSlugSeed(parsed.data.name);

  const slugError = parsed.data.slug
    ? await validateCampaignSlug(requestedSlug)
    : null;

  if (slugError) return { error: slugError };

  const slug = parsed.data.slug
    ? requestedSlug
    : await ensureUniqueSlug(requestedSlug);

  const campaign = await prisma.campaign.create({
    data: {
      name: parsed.data.name,
      status: parsed.data.status,
      slug,
      profileUrl,
      platform: parsed.data.platform,
      contactInfo: parsed.data.contactInfo,
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/campaigns/${campaign.id}`);
}

export async function archiveCampaign(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.campaign.update({
    where: { id },
    data: { archivedAt: new Date() },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/campaigns/${id}`);
}

export async function restoreCampaign(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.campaign.update({
    where: { id },
    data: { archivedAt: null, status: CampaignStatus.ACTIVE },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/campaigns/${id}`);
}

export async function createVideo(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = videoSchema.safeParse({
    campaignId: formData.get("campaignId"),
    name: formData.get("name"),
    videoUrl: formData.get("videoUrl"),
    platform: formData.get("platform"),
    plannedDate: String(formData.get("plannedDate") ?? "").trim() || undefined,
    postedDate: String(formData.get("postedDate") ?? "").trim() || undefined,
    fixedFee: formData.get("fixedFee") || "0",
    variableFee: formData.get("variableFee") || "0",
    maxBudget: String(formData.get("maxBudget") ?? "").trim() || undefined,
    slug: String(formData.get("slug") ?? "").trim() || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid video data" };
  }

  const videoUrl = normalizeUrl(parsed.data.videoUrl);
  if (!videoUrl) return { error: "Enter a valid video link." };

  const requestedSlug = parsed.data.slug
    ? sanitizeSlugSeed(parsed.data.slug, "video")
    : sanitizeSlugSeed(parsed.data.name, "video");

  if (!isValidSlug(requestedSlug)) {
    return { error: "Slug must be 2-64 characters, lowercase letters, numbers, and hyphens only." };
  }

  if (parsed.data.slug && (await isVideoSlugTaken(requestedSlug))) {
    return { error: `Slug "${requestedSlug}" is already in use by another video.` };
  }

  const maxBudget = optionalMoney(parsed.data.maxBudget);
  if (parsed.data.maxBudget && !maxBudget) {
    return { error: "Max budget must be zero or greater." };
  }

  const slug = parsed.data.slug
    ? requestedSlug
    : await ensureUniqueVideoSlug(requestedSlug);

  const platform =
    parsed.data.platform === "AUTO"
      ? inferPlatformFromUrl(videoUrl)
      : parsed.data.platform;

  const video = await prisma.video.create({
    data: {
      campaignId: parsed.data.campaignId,
      name: parsed.data.name,
      videoUrl,
      platform,
      plannedDate: optionalDate(parsed.data.plannedDate),
      postedDate: optionalDate(parsed.data.postedDate),
      fixedFee: new Prisma.Decimal(parsed.data.fixedFee),
      variableFee: new Prisma.Decimal(parsed.data.variableFee),
      maxBudget,
      slug,
    },
  });

  await refreshVideoMetrics(video.id);

  revalidatePath(`/admin/campaigns/${parsed.data.campaignId}`);
  redirect(`/admin/campaigns/${parsed.data.campaignId}`);
}

export async function refreshVideoMetricsAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const campaignId = String(formData.get("campaignId") ?? "");
  if (!id) return;

  await refreshVideoMetrics(id);
  if (campaignId) revalidatePath(`/admin/campaigns/${campaignId}`);
}

export async function refreshCampaignVideosAction(formData: FormData) {
  const campaignId = String(formData.get("campaignId") ?? "");
  if (!campaignId) return;

  const videos = await prisma.video.findMany({
    where: { campaignId },
    select: { id: true },
  });

  for (const video of videos) {
    await refreshVideoMetrics(video.id);
  }

  revalidatePath(`/admin/campaigns/${campaignId}`);
}

export async function logoutAction() {
  const { logoutAdmin } = await import("@/lib/auth");
  await logoutAdmin();
  redirect("/admin/login");
}
