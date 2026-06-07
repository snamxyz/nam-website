"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CampaignStatus, Prisma } from "@nam/db/client";
import { isAdminAuthenticated } from "@nam/core/auth";
import { isValidSlug } from "@nam/core/constants";
import { prisma } from "@nam/core/db";
import { normalizeUrl, sanitizeSlugSeed } from "@nam/core/profile";
import { isCampaignSlugTaken } from "@nam/core/tracking";

export type ActionState = {
  error?: string;
  success?: boolean;
};

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  status: z.nativeEnum(CampaignStatus),
  profileUrl: z.string().min(1, "Profile link is required"),
  contactInfo: z.string().optional(),
  slug: z.string().optional(),
});

const videoSchema = z.object({
  campaignId: z.string().min(1, "Creator is required"),
  name: z.string().min(1, "Video name is required"),
  videoUrl: z.string().min(1, "Video link is required"),
  plannedDate: z.string().optional(),
  postedDate: z.string().optional(),
  fixedFee: z.coerce.number().min(0, "Fixed fee must be zero or greater"),
  variableFee: z.coerce.number().min(0, "Variable fee must be zero or greater"),
  maxBudget: z.string().optional(),
  slug: z.string().optional(),
  views: z.coerce.number().int().min(0).optional(),
  likes: z.coerce.number().int().min(0).optional(),
  comments: z.coerce.number().int().min(0).optional(),
});

const updateVideoSchema = videoSchema.extend({
  videoId: z.string().min(1, "Video is required"),
});

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }
}

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

async function isVideoSlugTaken(slug: string, excludeVideoId?: string): Promise<boolean> {
  const video = await prisma.video.findUnique({ where: { slug } });
  if (!video) return false;
  if (excludeVideoId && video.id === excludeVideoId) return false;
  return true;
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
  await requireAdmin();

  const parsed = campaignSchema.safeParse({
    name: formData.get("name"),
    status: formData.get("status"),
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
      contactInfo: parsed.data.contactInfo,
    },
  });

  revalidatePath("/");
  redirect(`/campaigns/${campaign.id}`);
}

export async function archiveCampaign(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.campaign.update({
    where: { id },
    data: { archivedAt: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/campaigns/${id}`);
}

export async function restoreCampaign(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.campaign.update({
    where: { id },
    data: { archivedAt: null, status: CampaignStatus.ACTIVE },
  });

  revalidatePath("/");
  revalidatePath(`/campaigns/${id}`);
}

export async function createVideo(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = videoSchema.safeParse({
    campaignId: formData.get("campaignId"),
    name: formData.get("name"),
    videoUrl: formData.get("videoUrl"),
    plannedDate: String(formData.get("plannedDate") ?? "").trim() || undefined,
    postedDate: String(formData.get("postedDate") ?? "").trim() || undefined,
    fixedFee: formData.get("fixedFee") || "0",
    variableFee: formData.get("variableFee") || "0",
    maxBudget: String(formData.get("maxBudget") ?? "").trim() || undefined,
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    views: formData.get("views") ?? "0",
    likes: formData.get("likes") ?? "0",
    comments: formData.get("comments") ?? "0",
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

  await prisma.video.create({
    data: {
      campaignId: parsed.data.campaignId,
      name: parsed.data.name,
      videoUrl,
      plannedDate: optionalDate(parsed.data.plannedDate),
      postedDate: optionalDate(parsed.data.postedDate),
      fixedFee: new Prisma.Decimal(parsed.data.fixedFee),
      variableFee: new Prisma.Decimal(parsed.data.variableFee),
      maxBudget,
      slug,
      views: parsed.data.views ?? 0,
      likes: parsed.data.likes ?? 0,
      comments: parsed.data.comments ?? 0,
    },
  });

  revalidatePath(`/campaigns/${parsed.data.campaignId}`);
  redirect(`/campaigns/${parsed.data.campaignId}`);
}

export async function updateVideo(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateVideoSchema.safeParse({
    videoId: formData.get("videoId"),
    campaignId: formData.get("campaignId"),
    name: formData.get("name"),
    videoUrl: formData.get("videoUrl"),
    plannedDate: String(formData.get("plannedDate") ?? "").trim() || undefined,
    postedDate: String(formData.get("postedDate") ?? "").trim() || undefined,
    fixedFee: formData.get("fixedFee") || "0",
    variableFee: formData.get("variableFee") || "0",
    maxBudget: String(formData.get("maxBudget") ?? "").trim() || undefined,
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    views: formData.get("views") ?? "0",
    likes: formData.get("likes") ?? "0",
    comments: formData.get("comments") ?? "0",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid video data" };
  }

  const existing = await prisma.video.findFirst({
    where: { id: parsed.data.videoId, campaignId: parsed.data.campaignId },
  });
  if (!existing) return { error: "Video not found." };

  const videoUrl = normalizeUrl(parsed.data.videoUrl);
  if (!videoUrl) return { error: "Enter a valid video link." };

  const requestedSlug = parsed.data.slug
    ? sanitizeSlugSeed(parsed.data.slug, "video")
    : sanitizeSlugSeed(parsed.data.name, "video");

  if (!isValidSlug(requestedSlug)) {
    return { error: "Slug must be 2-64 characters, lowercase letters, numbers, and hyphens only." };
  }

  if (await isVideoSlugTaken(requestedSlug, parsed.data.videoId)) {
    return { error: `Slug "${requestedSlug}" is already in use by another video.` };
  }

  const maxBudget = optionalMoney(parsed.data.maxBudget);
  if (parsed.data.maxBudget && !maxBudget) {
    return { error: "Max budget must be zero or greater." };
  }

  await prisma.video.update({
    where: { id: parsed.data.videoId },
    data: {
      name: parsed.data.name,
      videoUrl,
      plannedDate: optionalDate(parsed.data.plannedDate) ?? null,
      postedDate: optionalDate(parsed.data.postedDate) ?? null,
      fixedFee: new Prisma.Decimal(parsed.data.fixedFee),
      variableFee: new Prisma.Decimal(parsed.data.variableFee),
      maxBudget: maxBudget ?? null,
      slug: requestedSlug,
      views: parsed.data.views ?? 0,
      likes: parsed.data.likes ?? 0,
      comments: parsed.data.comments ?? 0,
    },
  });

  revalidatePath(`/campaigns/${parsed.data.campaignId}`);
  redirect(`/campaigns/${parsed.data.campaignId}`);
}

export async function logoutAction() {
  const { logoutAdmin } = await import("@nam/core/auth");
  await logoutAdmin();
  redirect("/login");
}
