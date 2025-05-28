import { execSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer } from "testcontainers";

let container: StartedTestContainer;
let prisma: PrismaClient;

export const setupTestDatabase = async () => {
  container = await new GenericContainer("postgres")
    .withEnvironment({
      POSTGRES_USER: "test",
      POSTGRES_PASSWORD: "test",
      POSTGRES_DB: "test",
    })
    .withExposedPorts(5432)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const url = `postgresql://test:test@${host}:${port}/test`;

  process.env.DATABASE_URL = url;

  // Push the Prisma schema to the container DB
  execSync(`npx prisma db push`, {
    env: { ...process.env, DATABASE_URL: url },
  });

  prisma = new PrismaClient();
  await prisma.$connect();

  return {
    prisma,
    container,
    url,
  };
};

export const teardownTestDatabase = async () => {
  await prisma.$disconnect();
  await container.stop();
};
