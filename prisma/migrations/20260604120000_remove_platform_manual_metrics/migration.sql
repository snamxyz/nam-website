-- Drop platform indexes
DROP INDEX IF EXISTS "Campaign_platform_idx";
DROP INDEX IF EXISTS "Video_platform_idx";

-- Drop platform and fetch metadata columns
ALTER TABLE "Campaign" DROP COLUMN IF EXISTS "platform";
ALTER TABLE "Video" DROP COLUMN IF EXISTS "platform";
ALTER TABLE "Video" DROP COLUMN IF EXISTS "metricsFetchedAt";
ALTER TABLE "Video" DROP COLUMN IF EXISTS "metricsFetchError";

-- Drop Platform enum
DROP TYPE IF EXISTS "Platform";
