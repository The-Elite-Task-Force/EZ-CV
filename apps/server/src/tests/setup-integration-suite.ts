import { afterAll, beforeAll, beforeEach } from "vitest";

import { cleanDatabase } from "./clean-db";
import type { TestPrismaService } from "./integration-tests/test-prisma-service";
import { setupTestDatabase, teardownTestDatabase } from "./setup-test-db";

export const setupIntegrationTestSuite = () => {
  let prisma: TestPrismaService;

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
