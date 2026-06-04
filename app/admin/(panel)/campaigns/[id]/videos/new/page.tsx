import Link from "next/link";
import { notFound } from "next/navigation";
import VideoForm from "@/app/admin/components/VideoForm";
import { prisma } from "@/lib/db";

export default async function NewVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    select: { id: true, name: true },
  });
  if (!campaign) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/campaigns/${campaign.id}`}
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          ← Back to {campaign.name}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">Add video</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Add a social video link and optionally enter its performance metrics.
        </p>
      </div>
      <VideoForm campaignId={campaign.id} />
    </div>
  );
}
