import Link from "next/link";
import { notFound } from "next/navigation";
import VideoEditForm from "@/app/admin/components/VideoEditForm";
import { prisma } from "@/lib/db";
import { toNumber } from "@/lib/stats";

function formatDateInput(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>;
}) {
  const { id: campaignId, videoId } = await params;
  const video = await prisma.video.findFirst({
    where: { id: videoId, campaignId },
    include: { campaign: { select: { id: true, name: true } } },
  });
  if (!video) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/campaigns/${campaignId}`}
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          ← Back to {video.campaign.name}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">Edit video</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Update video details and enter views, likes, and comments manually.
        </p>
      </div>
      <VideoEditForm
        defaults={{
          videoId: video.id,
          campaignId: video.campaignId,
          name: video.name,
          videoUrl: video.videoUrl,
          slug: video.slug,
          plannedDate: formatDateInput(video.plannedDate),
          postedDate: formatDateInput(video.postedDate),
          fixedFee: String(toNumber(video.fixedFee)),
          variableFee: String(toNumber(video.variableFee)),
          maxBudget: video.maxBudget == null ? "" : String(toNumber(video.maxBudget)),
          views: video.views,
          likes: video.likes,
          comments: video.comments,
        }}
      />
    </div>
  );
}
