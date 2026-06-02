import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConversionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { resolveCampaignSlug } from "@/lib/tracking";

const conversionSchema = z.object({
  type: z.enum([
    "signup",
    "first_receipt_verified",
    "second_receipt_verified",
  ]),
  slug: z.string().min(2).max(64),
  externalUserId: z.string().min(1).optional(),
  timestamp: z.string().datetime().optional(),
});

function mapConversionType(type: string): ConversionType {
  switch (type) {
    case "signup":
      return ConversionType.SIGNUP;
    case "first_receipt_verified":
      return ConversionType.FIRST_RECEIPT_VERIFIED;
    case "second_receipt_verified":
      return ConversionType.SECOND_RECEIPT_VERIFIED;
    default:
      throw new Error("Invalid conversion type");
  }
}

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret || !authHeader) return false;
  return authHeader === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = conversionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { type, slug, externalUserId, timestamp } = parsed.data;
  const target = await resolveCampaignSlug(slug);

  if (!target) {
    return NextResponse.json({ error: "Slug not found" }, { status: 404 });
  }

  const conversionType = mapConversionType(type);

  if (externalUserId) {
    const existing = await prisma.conversionEvent.findFirst({
      where: {
        type: conversionType,
        slug,
        externalUserId,
      },
    });

    if (existing) {
      return NextResponse.json({ ok: true, id: existing.id, duplicate: true });
    }
  }

  const event = await prisma.conversionEvent.create({
    data: {
      type: conversionType,
      campaignId: target.campaignId,
      slug: target.slug,
      externalUserId,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    },
  });

  return NextResponse.json({ ok: true, id: event.id });
}
