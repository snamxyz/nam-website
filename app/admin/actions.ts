"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CampaignStatus, Prisma } from "@/generated/prisma/client";
import { isValidSlug } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { isCampaignSlugTaken } from "@/lib/tracking";
import {
  fetchXProfileImageUrl,
  parseXProfileUrl,
  sanitizeCampaignSlug,
} from "@/lib/x-profile";

export type ActionState = {
  error?: string;
  success?: boolean;
};

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  status: z.nativeEnum(CampaignStatus),
  budget: z.coerce.number().min(0, "Budget must be zero or greater"),
  xProfileUrl: z.string().min(1, "X profile URL is required"),
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

export async function createCampaign(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = campaignSchema.safeParse({
    name: formData.get("name"),
    status: formData.get("status"),
    budget: formData.get("budget"),
    xProfileUrl: formData.get("xProfileUrl"),
    slug: String(formData.get("slug") ?? "").trim() || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid campaign data" };
  }

  const xProfile = parseXProfileUrl(parsed.data.xProfileUrl);
  if (!xProfile) {
    return { error: "Enter a valid X profile URL (e.g. https://x.com/username)." };
  }

  const requestedSlug = parsed.data.slug
    ? sanitizeCampaignSlug(xProfile.handle, parsed.data.slug)
    : sanitizeCampaignSlug(xProfile.handle);

  const slugError = parsed.data.slug
    ? await validateCampaignSlug(requestedSlug)
    : null;

  if (slugError) return { error: slugError };

  const slug = parsed.data.slug
    ? requestedSlug
    : await ensureUniqueSlug(requestedSlug);

  const profileImageUrl = await fetchXProfileImageUrl(xProfile.handle);

  const campaign = await prisma.campaign.create({
    data: {
      name: parsed.data.name,
      status: parsed.data.status,
      budget: new Prisma.Decimal(parsed.data.budget),
      slug,
      xProfileUrl: xProfile.profileUrl,
      xHandle: xProfile.handle,
      profileImageUrl,
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/campaigns/${campaign.id}`);
}

export async function logoutAction() {
  const { logoutAdmin } = await import("@/lib/auth");
  await logoutAdmin();
  redirect("/admin/login");
}
