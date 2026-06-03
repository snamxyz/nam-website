import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizeDatabaseUrl } from "../lib/database-url";

const adapter = new PrismaPg({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL!),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.campaign.findFirst({
    where: { slug: "rish" },
  });

  if (existing) {
    console.log("Seed data already exists.");
    return;
  }

  const campaign = await prisma.campaign.create({
    data: {
      name: "Launch Campaign",
      status: "ACTIVE",
      slug: "rish",
      profileUrl: "https://www.youtube.com/@rish",
      platform: "YOUTUBE",
      contactInfo: "rish@example.com",
      profileImageUrl: "https://unavatar.io/x/rish",
      videos: {
        create: {
          name: "Launch video",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          platform: "YOUTUBE",
          slug: "rish-launch-video",
        },
      },
    },
  });

  console.log(`Seeded campaign ${campaign.id} with referral /ref/${campaign.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
