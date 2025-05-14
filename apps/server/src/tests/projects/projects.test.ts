import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ProjectService } from "@/server/project/project.service";

import { ProjectController } from "../../project/project.controller";
import { mockProjects } from "../mocks/projects";

describe("ProjectController", () => {
  let controller: ProjectController;
  let mockProjectService: Partial<ProjectService>;

  beforeEach(() => {
    mockProjectService = {
      getProjectsFromCompany: vi.fn(),
    };

    controller = new ProjectController(mockProjectService as ProjectService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getProjectsFromCompany", () => {
    it("should get all projects from a specific company", async () => {
      vi.mocked(mockProjectService.getProjectsFromCompany).mockResolvedValue(mockProjects);

      const result = await controller.getProjectsFromCompany("companyId");

      expect(mockProjectService.getProjectsFromCompany).toHaveBeenCalledWith("companyId");

      expect(result).toEqual(mockProjects);
    });

    it("should throw an InternalServerErrorException if company id does not exists", async () => {
      vi.mocked(mockProjectService.getProjectsFromCompany).mockRejectedValue(
        new Error("Company with ID: wrongCompanyId - does not exist."),
      );

      await expect(controller.getProjectsFromCompany("wrongCompanyId")).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockProjectService.getProjectsFromCompany).toHaveBeenCalledWith("wrongCompanyId");
    });
  });
});
