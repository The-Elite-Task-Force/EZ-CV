import { ProjectMappingService } from "@/server/projectMapping/project-mapping.service";
import { setupIntegrationTestSuite } from "@/server/tests/setup-integration-suite";

import { mockCreateSecondUser, mockCreateUser } from "../../mocks/mocks";
import { setupProjectWithUser } from "../utils/setup-project-with-user";

const { getPrisma } = setupIntegrationTestSuite();

describe("ProjectMappingService Integration", () => {
  let projectMappingService: ProjectMappingService;

  beforeEach(() => {
    projectMappingService = new ProjectMappingService(getPrisma());
  });

  it("should create a project mapping", async () => {
    const prisma = getPrisma();
    const { user, project } = await setupProjectWithUser(mockCreateUser, "Project Alpha", prisma);

    const mapping = await projectMappingService.create({
      userId: user.id,
      projectId: project.id,
    });

    expect(mapping).toMatchObject({
      projectId: project.id,
      userId: user.id,
      resumeId: null,
    });
  });

  it("should create a project mapping with a resumeId", async () => {
    const prisma = getPrisma();
    const { user, project } = await setupProjectWithUser(
      mockCreateSecondUser,
      "Project Beta",
      prisma,
    );

    const resume = await prisma.resume.create({
      data: {
        title: "Beta Resume",
        slug: "beta-resume",
        userId: user.id,
      },
    });

    const mapping = await projectMappingService.create({
      userId: user.id,
      projectId: project.id,
      resumeId: resume.id,
    });

    expect(mapping.resumeId).toBe(resume.id);
  });

  it("should find project mappings by projectId", async () => {
    const prisma = getPrisma();
    const { user: user1, project } = await setupProjectWithUser(
      mockCreateUser,
      "Team Project",
      prisma,
    );

    const user2 = await prisma.user.create({ data: mockCreateSecondUser });

    await projectMappingService.create({ userId: user1.id, projectId: project.id });
    await projectMappingService.create({ userId: user2.id, projectId: project.id });

    const mappings = await projectMappingService.findByProjectId(project.id);

    expect(mappings).toHaveLength(2);
    expect(mappings.map((m) => m.userId)).toEqual(expect.arrayContaining([user1.id, user2.id]));
  });

  it("should update a project mapping resumeId", async () => {
    const prisma = getPrisma();
    const { user, project } = await setupProjectWithUser(mockCreateUser, "Project Alpha", prisma);

    await projectMappingService.create({
      userId: user.id,
      projectId: project.id,
    });

    const resume = await prisma.resume.create({
      data: { title: "Sample Resume", slug: "sample-resume", userId: user.id },
    });

    const updated = await projectMappingService.update({
      userId: user.id,
      projectId: project.id,
      resumeId: resume.id,
    });

    expect(updated.resumeId).toBe(resume.id);
  });

  it("should update a project mapping resumeId to null when undefined", async () => {
    const prisma = getPrisma();
    const { user, project } = await setupProjectWithUser(
      mockCreateSecondUser,
      "Project Gamma",
      prisma,
    );

    const resume = await prisma.resume.create({
      data: {
        title: "Gamma Resume",
        slug: "gamma-resume",
        userId: user.id,
      },
    });

    await projectMappingService.create({
      userId: user.id,
      projectId: project.id,
      resumeId: resume.id,
    });

    const updated = await projectMappingService.update({
      userId: user.id,
      projectId: project.id,
      resumeId: undefined,
    });

    expect(updated.resumeId).toBeNull();
  });

  it("should delete a project mapping", async () => {
    const prisma = getPrisma();
    const { user, project } = await setupProjectWithUser(mockCreateUser, "Project Alpha", prisma);

    await projectMappingService.create({
      userId: user.id,
      projectId: project.id,
    });

    const deleted = await projectMappingService.delete({
      userId: user.id,
      projectId: project.id,
    });

    expect(deleted.userId).toBe(user.id);
    expect(deleted.projectId).toBe(project.id);

    const remaining = await prisma.projectMapping.findMany();
    expect(remaining).toHaveLength(0);
  });
});
