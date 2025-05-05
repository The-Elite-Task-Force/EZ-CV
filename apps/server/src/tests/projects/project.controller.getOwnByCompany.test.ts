import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectController } from "../../project/project.controller";
import type { ProjectService } from "../../project/project.service";
import { mockUserWithoutPRI } from "../mocks/mocks";
import { mockCompanyId, mockProjects } from "../mocks/project";

describe("ProjectController - getOwnByCompanyId", () => {
  let controller: ProjectController;
  let service: Pick<ProjectService, "getUserProjectsByCompanyId">;

  beforeEach(() => {
    service = {
      getUserProjectsByCompanyId: vi.fn(),
    };

    controller = new ProjectController(service as ProjectService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return projects for the user and company", async () => {
    vi.mocked(service.getUserProjectsByCompanyId).mockResolvedValue(mockProjects);

    const result = await controller.getOwnByCompanyId(mockUserWithoutPRI, mockCompanyId);

    expect(service.getUserProjectsByCompanyId).toHaveBeenCalledWith(
      mockUserWithoutPRI.id,
      mockCompanyId,
    );
    expect(result).toEqual(mockProjects);
  });

  it("should throw InternalServerErrorException on error", async () => {
    vi.mocked(service.getUserProjectsByCompanyId).mockRejectedValue(new Error("Unexpected"));

    await expect(controller.getOwnByCompanyId(mockUserWithoutPRI, mockCompanyId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
