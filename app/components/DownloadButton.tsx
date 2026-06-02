"use client";

import { ReactNode } from "react";
import { APP_STORE_URL, getPlayStoreUrl } from "@/lib/constants";

type DownloadButtonProps = {
  platform: "ios" | "android";
  className?: string;
  children: ReactNode;
};

function getFallbackUrl(platform: "ios" | "android") {
  return platform === "ios" ? APP_STORE_URL : getPlayStoreUrl();
}

export default function DownloadButton({
  platform,
  className,
  children,
}: DownloadButtonProps) {
  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    try {
      const response = await fetch("/api/track/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      if (response.ok) {
        const data = (await response.json()) as { url?: string };
        window.location.href = data.url ?? getFallbackUrl(platform);
        return;
      }
    } catch {
      // fall through to direct navigation
    }

    window.location.href = getFallbackUrl(platform);
  }

  return (
    <a href={getFallbackUrl(platform)} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
