import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectMappingController } from "@/server/projectMapping/project-mapping.controller";
import type { ProjectMappingService } from "@/server/projectMapping/project-mapping.service";

import { mockProjectId } from "../../../mocks/project";
import { mockProjectMappingList } from "../../../mocks/project-mapping";

describe("ProjectMappingController - findByProjectId", () => {
  let controller: ProjectMappingController;
  let service: Pick<ProjectMappingService, "findByProjectId">;

  beforeEach(() => {
    service = {
      findByProjectId: vi.fn(),
    };

    controller = new ProjectMappingController(service as ProjectMappingService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return project mappings", async () => {
    vi.mocked(service.findByProjectId).mockResolvedValue(mockProjectMappingList);

    const result = await controller.findByProjectId(mockProjectId);
    expect(service.findByProjectId).toHaveBeenCalledWith(mockProjectId);
    expect(result).toEqual(mockProjectMappingList);
  });

  it("should throw InternalServerErrorException on error", async () => {
    vi.mocked(service.findByProjectId).mockRejectedValue(new Error("DB Failure"));
    await expect(controller.findByProjectId(mockProjectId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
