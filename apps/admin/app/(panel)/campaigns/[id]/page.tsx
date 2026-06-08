import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { archiveCampaign, restoreCampaign } from "@/app/actions";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { getTrackingUrl } from "@nam/core/constants";
import {
  formatCurrency,
  formatPercent,
  formatRatio,
  getCampaignVideoStats,
  getCampaignStats,
} from "@nam/core/stats";

function formatDate(date: Date | null): string {
  return date ? date.toLocaleDateString() : "—";
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stats = await getCampaignStats(id);
  if (!stats) notFound();
  const videos = await getCampaignVideoStats(id);

  const trackingUrl = getTrackingUrl(stats.slug);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
            ← Back to creators
          </Link>
          <h1 className="mt-3 text-2xl font-semibold">{stats.name}</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Status: {stats.status}
            {stats.archivedAt ? ` · Archived ${formatDate(stats.archivedAt)}` : ""}
          </p>
        </div>
        <form action={stats.archivedAt ? restoreCampaign : archiveCampaign}>
          <input type="hidden" name="id" value={stats.id} />
          <button
            type="submit"
            className="rounded-lg border border-nam-border px-4 py-2 text-sm text-foreground/80 transition hover:border-nam-green hover:text-nam-green"
          >
            {stats.archivedAt ? "Restore creator" : "Archive creator"}
          </button>
        </form>
      </div>

      <section className="rounded-xl border border-nam-border bg-nam-card p-5">
        <div className="flex flex-wrap items-center gap-5">
          {stats.profileImageUrl ? (
            <Image
              src={stats.profileImageUrl}
              alt={stats.name}
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 rounded-full border border-nam-border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-nam-border bg-black/[0.04] text-xl font-semibold">
              {stats.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <a
              href={stats.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-lg font-semibold text-nam-green hover:underline"
            >
              {stats.profileUrl}
            </a>
            {stats.contactInfo ? (
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/70">
                {stats.contactInfo}
              </p>
            ) : null}
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
          ["Videos", String(stats.videoCount)],
          ["Total views", stats.totalViews.toLocaleString()],
          ["Total likes", stats.totalLikes.toLocaleString()],
          ["Total comments", stats.totalComments.toLocaleString()],
          ["Fixed fees", formatCurrency(stats.fixedFees)],
          ["Estimated CPM spend", formatCurrency(stats.estimatedCpmSpend)],
          ["Uncapped spend", formatCurrency(stats.uncappedSpend)],
          ["Budget-capped spend", formatCurrency(stats.cappedSpend)],
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

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Video stats</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Spreadsheet-style performance for each social video link.
            </p>
          </div>
          <Link
            href={`/campaigns/${stats.id}/videos/new`}
            className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Add video
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-nam-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-nam-border bg-black/[0.04] text-foreground/70">
              <tr>
                <th className="sticky left-0 z-10 bg-background px-4 py-3 font-medium">Video</th>
                <th className="px-4 py-3 font-medium text-right">Views</th>
                <th className="px-4 py-3 font-medium text-right">Likes</th>
                <th className="px-4 py-3 font-medium text-right">Comments</th>
                <th className="px-4 py-3 font-medium">Planned</th>
                <th className="px-4 py-3 font-medium">Posted</th>
                <th className="px-4 py-3 font-medium">Fixed fee</th>
                <th className="px-4 py-3 font-medium">CPM</th>
                <th className="px-4 py-3 font-medium">Max budget</th>
                <th className="px-4 py-3 font-medium">Spend</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-foreground/50">
                    No videos yet.{" "}
                    <Link
                      href={`/campaigns/${stats.id}/videos/new`}
                      className="text-nam-green hover:underline"
                    >
                      Add a video
                    </Link>{" "}
                    to start tracking post-level stats.
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="border-b border-nam-border/60 align-top">
                    <td className="sticky left-0 z-10 max-w-72 bg-nam-card px-4 py-3">
                      <p className="font-medium">{video.name}</p>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-all text-xs text-nam-green hover:underline"
                      >
                        {video.videoUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">
                      {video.views.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {video.likes.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {video.comments.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{formatDate(video.plannedDate)}</td>
                    <td className="px-4 py-3">{formatDate(video.postedDate)}</td>
                    <td className="px-4 py-3">{formatCurrency(video.fixedFee)}</td>
                    <td className="px-4 py-3">{formatCurrency(video.variableFee)}</td>
                    <td className="px-4 py-3">
                      {video.maxBudget == null ? "—" : formatCurrency(video.maxBudget)}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(video.cappedSpend)}</td>
                    <td className="px-4 py-3">{video.slug}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/campaigns/${stats.id}/videos/${video.id}/edit`}
                        className="text-nam-green hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {videos.length > 0 ? (
              <tfoot className="border-t border-nam-border bg-black/[0.04] font-semibold">
                <tr>
                  <td className="sticky left-0 z-10 bg-background px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {stats.totalViews.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {stats.totalLikes.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {stats.totalComments.toLocaleString()}
                  </td>
                  <td className="px-4 py-3" colSpan={5} />
                  <td className="px-4 py-3">{formatCurrency(stats.cappedSpend)}</td>
                  <td className="px-4 py-3" colSpan={2} />
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>
    </div>
  );
}
