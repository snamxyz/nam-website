-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'OTHER');

-- AlterTable
ALTER TABLE "Campaign" RENAME COLUMN "xProfileUrl" TO "profileUrl";
ALTER TABLE "Campaign" DROP COLUMN "xHandle";
ALTER TABLE "Campaign" ADD COLUMN "platform" "Platform" NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Campaign" ADD COLUMN "contactInfo" TEXT;
ALTER TABLE "Campaign" ADD COLUMN "archivedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "plannedDate" TIMESTAMP(3),
    "postedDate" TIMESTAMP(3),
    "fixedFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "variableFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "maxBudget" DECIMAL(12,2),
    "slug" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "metricsFetchedAt" TIMESTAMP(3),
    "metricsFetchError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_slug_key" ON "Video"("slug");
CREATE INDEX "Video_campaignId_idx" ON "Video"("campaignId");
CREATE INDEX "Video_platform_idx" ON "Video"("platform");
CREATE INDEX "Video_postedDate_idx" ON "Video"("postedDate");
CREATE INDEX "Campaign_archivedAt_idx" ON "Campaign"("archivedAt");
CREATE INDEX "Campaign_platform_idx" ON "Campaign"("platform");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
