-- CreateEnum
CREATE TYPE "ClickEventType" AS ENUM ('REFERRAL_LANDING', 'DOWNLOAD_IOS', 'DOWNLOAD_ANDROID');

-- Clear dependent data before structural changes
DELETE FROM "ClickLog";
DELETE FROM "ConversionEvent";
DELETE FROM "Video";
DELETE FROM "Creator";
DELETE FROM "Campaign";

-- DropForeignKey
ALTER TABLE "ClickLog" DROP CONSTRAINT IF EXISTS "ClickLog_creatorId_fkey";
ALTER TABLE "ClickLog" DROP CONSTRAINT IF EXISTS "ClickLog_videoId_fkey";
ALTER TABLE "ConversionEvent" DROP CONSTRAINT IF EXISTS "ConversionEvent_creatorId_fkey";
ALTER TABLE "ConversionEvent" DROP CONSTRAINT IF EXISTS "ConversionEvent_videoId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Video";
DROP TABLE IF EXISTS "Creator";

-- DropEnum (only used by Platform after Creator drop)
DROP TYPE IF EXISTS "Platform";

-- AlterTable ClickLog - drop old columns before dropping DestinationType enum
ALTER TABLE "ClickLog" DROP COLUMN IF EXISTS "creatorId";
ALTER TABLE "ClickLog" DROP COLUMN IF EXISTS "videoId";
ALTER TABLE "ClickLog" DROP COLUMN IF EXISTS "destinationType";
ALTER TABLE "ClickLog" DROP COLUMN IF EXISTS "destinationUrl";
ALTER TABLE "ClickLog" ADD COLUMN "eventType" "ClickEventType";

DROP TYPE IF EXISTS "DestinationType";

-- AlterTable ConversionEvent
ALTER TABLE "ConversionEvent" DROP COLUMN IF EXISTS "creatorId";
ALTER TABLE "ConversionEvent" DROP COLUMN IF EXISTS "videoId";

-- AlterTable Campaign
ALTER TABLE "Campaign"
ADD COLUMN IF NOT EXISTS "slug" TEXT,
ADD COLUMN IF NOT EXISTS "xProfileUrl" TEXT,
ADD COLUMN IF NOT EXISTS "xHandle" TEXT,
ADD COLUMN IF NOT EXISTS "profileImageUrl" TEXT;

-- DropIndex
DROP INDEX IF EXISTS "ClickLog_creatorId_idx";
DROP INDEX IF EXISTS "ClickLog_videoId_idx";
DROP INDEX IF EXISTS "ConversionEvent_creatorId_idx";
DROP INDEX IF EXISTS "ConversionEvent_videoId_idx";

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Campaign_slug_key" ON "Campaign"("slug");
CREATE INDEX IF NOT EXISTS "ClickLog_eventType_idx" ON "ClickLog"("eventType");

-- Make required columns NOT NULL (tables are empty after delete)
ALTER TABLE "Campaign" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "Campaign" ALTER COLUMN "xProfileUrl" SET NOT NULL;
ALTER TABLE "Campaign" ALTER COLUMN "xHandle" SET NOT NULL;
ALTER TABLE "ClickLog" ALTER COLUMN "eventType" SET NOT NULL;
