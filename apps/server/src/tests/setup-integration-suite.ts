import type { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach } from "vitest";

import { cleanDatabase } from "./clean-db";
import { setupTestDatabase, teardownTestDatabase } from "./setup-test-db";

export const setupIntegrationTestSuite = () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    const setup = await setupTestDatabase();
    prisma = setup.prisma;
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  const getPrisma = () => prisma;
  return { getPrisma };
};
