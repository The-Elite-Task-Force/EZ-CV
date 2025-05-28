import { setupIntegrationTestSuite } from "../../setup-integration-suite";
import { createMockProject } from "./utils/create-project";

const { getPrisma } = setupIntegrationTestSuite();

describe("Project integration", () => {
  it("should create and fetch a project", async () => {
    const prisma = getPrisma();

    const { project } = await createMockProject(prisma);

    const fetched = await prisma.project.findUnique({
      where: { id: project.id },
    });

    expect(fetched).toMatchObject({
      id: project.id,
      name: "My Project",
      userId: project.userId,
      companyId: project.companyId,
    });
  });
});
