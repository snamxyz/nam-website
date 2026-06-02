import { NextRequest, NextResponse } from "next/server";
import { ClickEventType } from "@/generated/prisma/client";
import { getReferralRedirectUrl } from "@/lib/constants";
import {
  getClientIp,
  getReferralRedirectTarget,
  logCampaignClick,
  REFERRAL_COOKIE_MAX_AGE,
  REFERRAL_COOKIE_NAME,
  resolveCampaignSlug,
} from "@/lib/tracking";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const target = await resolveCampaignSlug(slug);

  if (!target) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent");
  const referrer = request.headers.get("referer");
  const ip = await getClientIp();

  await logCampaignClick({
    target,
    eventType: ClickEventType.REFERRAL_LANDING,
    userAgent,
    referrer,
    ip,
  });

  const redirectTarget = getReferralRedirectTarget(userAgent);
  const destination = getReferralRedirectUrl(
    redirectTarget,
    slug,
    request.url,
  );
  const response = NextResponse.redirect(destination, 302);
  response.cookies.set(REFERRAL_COOKIE_NAME, slug, {
    path: "/",
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
