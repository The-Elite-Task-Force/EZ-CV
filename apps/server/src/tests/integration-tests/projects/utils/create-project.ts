import type { PrismaClient } from "@prisma/client";

import { mockCreateCompany, mockCreateUser } from "@/server/tests/mocks/mocks";

export const createMockProject = async (prisma: PrismaClient) => {
  const user = await prisma.user.create({
    data: mockCreateUser,
  });

  const company = await prisma.company.create({
    data: { ownerId: user.id, ...mockCreateCompany },
  });

  const project = await prisma.project.create({
    data: {
      name: "My Project",
      userId: user.id,
      companyId: company.id,
    },
  });

  return { user, company, project };
};
