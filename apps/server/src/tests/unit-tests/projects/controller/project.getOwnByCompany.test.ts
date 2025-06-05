import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectController } from "@/server/project/project.controller";
import type { ProjectService } from "@/server/project/project.service";

import { mockUserWithoutPRI } from "../../../mocks/mocks";
import { mockCompanyId, mockProjects } from "../../../mocks/project";

describe("ProjectController - getOwnByCompanyId", () => {
  let controller: ProjectController;
  let service: Pick<ProjectService, "findUserProjectsByCompanyId">;

  beforeEach(() => {
    service = {
      findUserProjectsByCompanyId: vi.fn(),
    };

    controller = new ProjectController(service as ProjectService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return projects for the user and company", async () => {
    vi.mocked(service.findUserProjectsByCompanyId).mockResolvedValue(mockProjects);

    const result = await controller.findOwnByCompanyId(mockUserWithoutPRI, mockCompanyId);

    expect(service.findUserProjectsByCompanyId).toHaveBeenCalledWith(
      mockUserWithoutPRI.id,
      mockCompanyId,
    );
    expect(result).toEqual(mockProjects);
  });

  it("should throw InternalServerErrorException on error", async () => {
    vi.mocked(service.findUserProjectsByCompanyId).mockRejectedValue(new Error("Unexpected"));

    await expect(controller.findOwnByCompanyId(mockUserWithoutPRI, mockCompanyId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
