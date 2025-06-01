import type { PrismaService } from "nestjs-prisma";

import { mockCreateCompany, mockCreateUser } from "../../mocks/mocks";

export async function setupProjectWithUser(
  userData = mockCreateUser,
  projectName: string,
  prisma: PrismaService,
) {
  const user = await prisma.user.create({ data: userData });
  const company = await prisma.company.create({
    data: { ownerId: user.id, ...mockCreateCompany },
  });
  const project = await prisma.project.create({
    data: {
      name: projectName,
      userId: user.id,
      companyId: company.id,
    },
  });

  return { prisma, user, company, project };
}
