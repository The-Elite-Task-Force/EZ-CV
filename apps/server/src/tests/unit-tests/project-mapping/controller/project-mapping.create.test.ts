import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectMappingController } from "@/server/projectMapping/project-mapping.controller";
import type { ProjectMappingService } from "@/server/projectMapping/project-mapping.service";

import { mockCreateProjectMapping, mockProjectMapping } from "../../../mocks/project-mapping";

describe("ProjectMappingController - create", () => {
  let controller: ProjectMappingController;
  let service: Pick<ProjectMappingService, "create">;

  beforeEach(() => {
    service = {
      create: vi.fn(),
    };

    controller = new ProjectMappingController(service as ProjectMappingService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create a new project mapping", async () => {
    vi.mocked(service.create).mockResolvedValue(mockProjectMapping);

    const result = await controller.create(mockCreateProjectMapping);
    expect(service.create).toHaveBeenCalledWith(mockCreateProjectMapping);
    expect(result).toEqual(mockProjectMapping);
  });

  it("should throw InternalServerErrorException on error", async () => {
    vi.mocked(service.create).mockRejectedValue(new Error("Unexpected"));
    await expect(controller.create(mockCreateProjectMapping)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
