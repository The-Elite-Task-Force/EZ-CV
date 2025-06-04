import type { PrismaClient } from "@prisma/client";

export const cleanDatabase = async (prisma: PrismaClient) => {
  // Get all public table names except migrations
  const tablenames = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname='public';
  `;

  // Truncate each table
  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
};
