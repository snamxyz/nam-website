import Link from "next/link";
import CampaignForm from "@/app/components/CampaignForm";

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/campaigns" className="text-sm text-foreground/60 hover:text-foreground">
          ← Back to creators
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">New creator</h1>
      </div>
      <CampaignForm />
    </div>
  );
}
