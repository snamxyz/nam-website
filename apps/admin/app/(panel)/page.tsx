import Link from "next/link";
import { archiveCampaign, restoreCampaign } from "@/app/actions";
import {
  formatCurrency,
  formatPercent,
  getAllCampaignStats,
} from "@nam/core/stats";
import { getTrackingUrl } from "@nam/core/constants";

export default async function AdminDashboardPage() {
  const campaigns = await getAllCampaignStats();
  const activeCampaigns = campaigns.filter((campaign) => !campaign.archivedAt);
  const archivedCampaigns = campaigns.filter((campaign) => campaign.archivedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Creators</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Creator profiles with referral tracking and per-video performance.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
        >
          New creator
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-nam-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-nam-border bg-white/5 text-foreground/70">
            <tr>
              <th className="px-4 py-3 font-medium">Creator</th>
              <th className="px-4 py-3 font-medium">Referral link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Videos</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Spend</th>
              <th className="px-4 py-3 font-medium">Visits</th>
              <th className="px-4 py-3 font-medium">Downloads</th>
              <th className="px-4 py-3 font-medium">Rate</th>
              <th className="px-4 py-3 font-medium">Signups</th>
              <th className="px-4 py-3 font-medium">1st Receipts</th>
              <th className="px-4 py-3 font-medium">CAC</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeCampaigns.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-8 text-center text-foreground/50">
                  No active creators yet. Create your first creator to get started.
                </td>
              </tr>
            ) : (
              activeCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-nam-border/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="font-medium text-nam-green hover:underline"
                    >
                      {campaign.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={getTrackingUrl(campaign.slug)}
                      className="text-foreground/80 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {campaign.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3">{campaign.status}</td>
                  <td className="px-4 py-3">{campaign.videoCount}</td>
                  <td className="px-4 py-3">{campaign.totalViews.toLocaleString()}</td>
                  <td className="px-4 py-3">{formatCurrency(campaign.cappedSpend)}</td>
                  <td className="px-4 py-3">{campaign.referralVisits}</td>
                  <td className="px-4 py-3">{campaign.downloadClicks}</td>
                  <td className="px-4 py-3">
                    {campaign.downloadRate != null
                      ? formatPercent(campaign.downloadRate)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{campaign.signups}</td>
                  <td className="px-4 py-3">{campaign.firstVerifiedReceipts}</td>
                  <td className="px-4 py-3">
                    {campaign.cac != null ? formatCurrency(campaign.cac) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={archiveCampaign}>
                      <input type="hidden" name="id" value={campaign.id} />
                      <button className="text-foreground/70 hover:text-foreground" type="submit">
                        Archive
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Archived creators</h2>
        <div className="overflow-x-auto rounded-xl border border-nam-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-nam-border bg-white/5 text-foreground/70">
              <tr>
                <th className="px-4 py-3 font-medium">Creator</th>
                <th className="px-4 py-3 font-medium">Videos</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Archived</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-foreground/50">
                    No archived creators.
                  </td>
                </tr>
              ) : (
                archivedCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-nam-border/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="font-medium text-nam-green hover:underline"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{campaign.videoCount}</td>
                    <td className="px-4 py-3">{campaign.totalViews.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {campaign.archivedAt?.toLocaleDateString() ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <form action={restoreCampaign}>
                        <input type="hidden" name="id" value={campaign.id} />
                        <button className="text-nam-green hover:underline" type="submit">
                          Restore
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
