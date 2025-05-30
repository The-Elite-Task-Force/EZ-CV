import { execSync } from "node:child_process";

import type { StartedTestContainer } from "testcontainers";
import { GenericContainer } from "testcontainers";

import { TestPrismaService } from "./integration-tests/test-prisma-service";

let container: StartedTestContainer;
let prisma: TestPrismaService;

export const setupTestDatabase = async () => {
  let container;
  try {
    container = await new GenericContainer("postgres")
      .withEnvironment({
        POSTGRES_USER: "test",
        POSTGRES_PASSWORD: "test",
        POSTGRES_DB: "test",
      })
      .withExposedPorts(5432)
      .start();
  } catch (error) {
    if (container) {
      const logs = await container.logs();
      for await (const line of logs) {
        console.log(line.toString());
      }
    }
    throw error;
  }

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const url = `postgresql://test:test@${host}:${port}/test`;

  process.env.DATABASE_URL = url;

  execSync(`pnpm prisma db push`, {
    env: { ...process.env, DATABASE_URL: url },
  });

  prisma = new TestPrismaService(url);
  await prisma.onModuleInit();

  return {
    prisma,
    container,
    url,
  };
};

export const teardownTestDatabase = async () => {
  await prisma.onModuleDestroy();
  await container.stop();
};
