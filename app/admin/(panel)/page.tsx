import Link from "next/link";
import {
  formatCurrency,
  formatPercent,
  getAllCampaignStats,
} from "@/lib/stats";
import { getTrackingUrl } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const campaigns = await getAllCampaignStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="mt-1 text-sm text-foreground/60">
            X influencer campaigns with referral and download tracking.
          </p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
        >
          New campaign
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-nam-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-nam-border bg-white/5 text-foreground/70">
            <tr>
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-4 py-3 font-medium">X handle</th>
              <th className="px-4 py-3 font-medium">Referral link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Budget</th>
              <th className="px-4 py-3 font-medium">Visits</th>
              <th className="px-4 py-3 font-medium">Downloads</th>
              <th className="px-4 py-3 font-medium">Rate</th>
              <th className="px-4 py-3 font-medium">Signups</th>
              <th className="px-4 py-3 font-medium">1st Receipts</th>
              <th className="px-4 py-3 font-medium">CAC</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-foreground/50">
                  No campaigns yet. Create your first campaign to get started.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-nam-border/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/campaigns/${campaign.id}`}
                      className="font-medium text-nam-green hover:underline"
                    >
                      {campaign.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">@{campaign.xHandle}</td>
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
                  <td className="px-4 py-3">{formatCurrency(campaign.budget)}</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
