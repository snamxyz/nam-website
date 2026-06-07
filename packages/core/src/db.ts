import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@nam/db/client";
import { config as loadEnv } from "dotenv";
import { normalizeDatabaseUrl } from "./database-url";

loadEnv({ path: "../../.env" });

// Bump when schema changes so dev hot-reload picks up a fresh client after prisma generate.
const PRISMA_SCHEMA_VERSION = "20260603221700_creator_video_tracking";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaVersion?: string;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({
    connectionString: normalizeDatabaseUrl(connectionString),
  });
  return new PrismaClient({ adapter });
}

function getPrismaClient() {
  if (globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION) {
    void globalForPrisma.prisma?.$disconnect();
    globalForPrisma.prisma = undefined;
    globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();