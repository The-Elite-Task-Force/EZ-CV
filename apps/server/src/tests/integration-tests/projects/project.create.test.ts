import type { PrismaClient } from "@prisma/client";

import { mockCreateProject } from "../../mocks/project";
import { setupTestDatabase, teardownTestDatabase } from "../../setup-test-db";

let prisma: PrismaClient;

beforeAll(async () => {
  const setup = await setupTestDatabase();
  prisma = setup.prisma;
});

afterAll(async () => {
  await teardownTestDatabase();
});

describe("Project integration", () => {
  it("should create and fetch a project", async () => {
    const created = createMockProject()

    const fetched = await prisma.project.findUnique({
      where: { id: created.id },
    });

    expect(fetched).toMatchObject({
      id: created.id,
      ...mockCreateProject,
    });
  });
});
