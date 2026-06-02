import "dotenv/config";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
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
      budget: new Prisma.Decimal(10000),
      slug: "rish",
      xProfileUrl: "https://x.com/rish",
      xHandle: "rish",
      profileImageUrl: "https://unavatar.io/x/rish",
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
