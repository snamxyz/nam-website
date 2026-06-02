import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/app/admin/components/CopyLinkButton";
import { getTrackingUrl } from "@/lib/constants";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatPercent,
  formatRatio,
  getCampaignStats,
} from "@/lib/stats";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  const stats = await getCampaignStats(id);
  if (!stats) notFound();

  const trackingUrl = getTrackingUrl(campaign.slug);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-foreground/60 hover:text-foreground">
          ← Back to campaigns
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">{campaign.name}</h1>
        <p className="mt-1 text-sm text-foreground/60">Status: {campaign.status}</p>
      </div>

      <section className="rounded-xl border border-nam-border bg-nam-card p-5">
        <div className="flex flex-wrap items-center gap-5">
          {stats.profileImageUrl ? (
            <img
              src={stats.profileImageUrl}
              alt={`@${stats.xHandle}`}
              className="h-16 w-16 rounded-full border border-nam-border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-nam-border bg-white/5 text-xl font-semibold">
              {stats.xHandle.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground/50">X influencer</p>
            <a
              href={stats.xProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-lg font-semibold text-nam-green hover:underline"
            >
              @{stats.xHandle}
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-nam-border pt-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-foreground/50">
              Referral link
            </p>
            <p className="mt-1 break-all font-mono text-sm">{trackingUrl}</p>
          </div>
          <CopyLinkButton url={trackingUrl} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Budget", formatCurrency(stats.budget)],
          ["Referral visits", String(stats.referralVisits)],
          ["Download clicks", String(stats.downloadClicks)],
          ["Download rate", stats.downloadRate != null ? formatPercent(stats.downloadRate) : "—"],
          ["iOS downloads", String(stats.iosDownloads)],
          ["Android downloads", String(stats.androidDownloads)],
          ["Signups", String(stats.signups)],
          ["1st receipts", String(stats.firstVerifiedReceipts)],
          ["CAC", stats.cac != null ? formatCurrency(stats.cac) : "—"],
          [
            "Signup rate",
            formatRatio(stats.signups, stats.downloadClicks),
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-nam-border bg-nam-card px-4 py-3"
          >
            <p className="text-xs uppercase tracking-wide text-foreground/50">{label}</p>
            <p className="mt-1 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
