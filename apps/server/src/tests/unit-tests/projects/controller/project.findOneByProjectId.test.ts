import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectController } from "../../../../project/project.controller";
import type { ProjectService } from "../../../../project/project.service";
import { mockProject } from "../../../mocks/project";

describe("ProjectController - findOneByProjectId", () => {
  let controller: ProjectController;
  let service: Pick<ProjectService, "findOneByProjectId">;

  beforeEach(() => {
    service = {
      findOneByProjectId: vi.fn(),
    };

    controller = new ProjectController(service as ProjectService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return the project with the given id", async () => {
    vi.mocked(service.findOneByProjectId).mockResolvedValue(mockProject);

    const result = await controller.findOneByProjectId(mockProject.id);

    expect(service.findOneByProjectId).toHaveBeenCalledWith(mockProject.id);
    expect(result).toEqual(mockProject);
  });

  it("should throw InternalServerErrorException on error", async () => {
    vi.mocked(service.findOneByProjectId).mockRejectedValue(new Error("Unexpected"));

    await expect(controller.findOneByProjectId(mockProject.id)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
