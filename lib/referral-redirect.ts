import { UAParser } from "ua-parser-js";

export type ReferralRedirectTarget = "android" | "ios" | "desktop";

export function getReferralRedirectTarget(
  userAgent: string | null,
): ReferralRedirectTarget {
  const parser = new UAParser(userAgent ?? undefined);
  const osName = parser.getOS().name?.toLowerCase();

  if (osName === "android") return "android";
  if (osName === "ios" || osName === "ipados") return "ios";
  return "desktop";
}
