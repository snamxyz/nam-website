import Link from "next/link";
import CampaignForm from "@/app/admin/components/CampaignForm";

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-foreground/60 hover:text-foreground">
          ← Back to campaigns
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">New campaign</h1>
      </div>
      <CampaignForm />
    </div>
  );
}
