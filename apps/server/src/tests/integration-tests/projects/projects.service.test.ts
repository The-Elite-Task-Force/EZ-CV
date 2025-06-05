import { ProjectService } from "@/server/project/project.service";
import { setupIntegrationTestSuite } from "@/server/tests/setup-integration-suite";

import { mockCreateCompany, mockCreateSecondUser, mockCreateUser } from "../../mocks/mocks";

const { getPrisma } = setupIntegrationTestSuite();

describe("ProjectService Integration", () => {
  let projectService: ProjectService;

  beforeEach(() => {
    projectService = new ProjectService(getPrisma());
  });

  it("should create a project and fetch it by id", async () => {
    const prisma = getPrisma();

    const user = await prisma.user.create({ data: mockCreateUser });
    const company = await prisma.company.create({
      data: { ...mockCreateCompany, ownerId: user.id },
    });

    const created = await projectService.create(user.id, {
      name: "My Project",
      companyId: company.id,
    });

    const fetched = await projectService.findOneByProjectId(created.id);

    expect(fetched).toMatchObject({
      id: created.id,
      name: "My Project",
      userId: user.id,
      companyId: company.id,
    });
  });

  it("should fetch all projects for a company", async () => {
    const prisma = getPrisma();

    const user = await prisma.user.create({ data: mockCreateUser });
    const company = await prisma.company.create({
      data: { ...mockCreateCompany, ownerId: user.id },
    });

    await projectService.create(user.id, {
      name: "Project A",
      companyId: company.id,
    });

    await projectService.create(user.id, {
      name: "Project B",
      companyId: company.id,
    });

    const projects = await projectService.findProjectsFromCompany(company.id);

    expect(projects).toHaveLength(2);
    expect(projects.map((p) => p.name)).toEqual(expect.arrayContaining(["Project A", "Project B"]));
  });

  it("should fetch all projects for a specific user in a company", async () => {
    const prisma = getPrisma();

    const user1 = await prisma.user.create({ data: mockCreateUser });
    const user2 = await prisma.user.create({ data: mockCreateSecondUser });

    const company = await prisma.company.create({
      data: { ...mockCreateCompany, ownerId: user1.id },
    });

    await projectService.create(user1.id, {
      name: "User1 Project A",
      companyId: company.id,
    });

    await projectService.create(user1.id, {
      name: "User1 Project B",
      companyId: company.id,
    });

    await projectService.create(user2.id, {
      name: "User2 Project C",
      companyId: company.id,
    });

    const projects = await projectService.findUserProjectsByCompanyId(user1.id, company.id);

    expect(projects).toHaveLength(2);
    expect(projects.map((p) => p.name)).toEqual(
      expect.arrayContaining(["User1 Project A", "User1 Project B"]),
    );
  });
});
