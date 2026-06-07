import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ClickEventType } from "@nam/db/client";
import { APP_STORE_URL, getPlayStoreUrl } from "@nam/core/constants";
import {
  getClientIp,
  getReferralSlugFromCookie,
  logCampaignClick,
  resolveCampaignSlug,
} from "@nam/core/tracking";

const bodySchema = z.object({
  platform: z.enum(["ios", "android"]),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { platform } = parsed.data;
  const slug = await getReferralSlugFromCookie();

  if (slug) {
    const target = await resolveCampaignSlug(slug);
    if (target) {
      await logCampaignClick({
        target,
        eventType:
          platform === "ios"
            ? ClickEventType.DOWNLOAD_IOS
            : ClickEventType.DOWNLOAD_ANDROID,
        userAgent: request.headers.get("user-agent"),
        referrer: request.headers.get("referer"),
        ip: await getClientIp(),
      });
    }
  }

  const url =
    platform === "ios" ? APP_STORE_URL : getPlayStoreUrl(slug ?? undefined);

  return NextResponse.json({ url, attributed: Boolean(slug) });
}
