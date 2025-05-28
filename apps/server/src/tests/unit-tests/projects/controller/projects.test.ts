import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectController } from "@/server/project/project.controller";
import type { ProjectService } from "@/server/project/project.service";

import { mockProjects } from "../../../mocks/project";

describe("ProjectController", () => {
  let controller: ProjectController;
  let mockProjectService: Partial<ProjectService>;

  beforeEach(() => {
    mockProjectService = {
      findProjectsFromCompany: vi.fn(),
    };

    controller = new ProjectController(mockProjectService as ProjectService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getProjectsFromCompany", () => {
    it("should get all projects from a specific company", async () => {
      vi.mocked(mockProjectService.findProjectsFromCompany).mockResolvedValue(mockProjects);

      const result = await controller.findProjectsFromCompany("companyId");

      expect(mockProjectService.findProjectsFromCompany).toHaveBeenCalledWith("companyId");

      expect(result).toEqual(mockProjects);
    });

    it("should throw an InternalServerErrorException if company id does not exists", async () => {
      vi.mocked(mockProjectService.findProjectsFromCompany).mockRejectedValue(
        new Error("Company with ID: wrongCompanyId - does not exist."),
      );

      await expect(controller.findProjectsFromCompany("wrongCompanyId")).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockProjectService.findProjectsFromCompany).toHaveBeenCalledWith("wrongCompanyId");
    });
  });
});
