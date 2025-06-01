import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectMappingController } from "@/server/projectMapping/project-mapping.controller";
import type { ProjectMappingService } from "@/server/projectMapping/project-mapping.service";

import { mockUserId } from "../../../mocks/mocks";
import { mockProjectId } from "../../../mocks/project";
import { mockProjectMapping } from "../../../mocks/project-mapping";

describe("ProjectMappingController - delete", () => {
  let controller: ProjectMappingController;
  let service: Pick<ProjectMappingService, "delete">;

  beforeEach(() => {
    service = {
      delete: vi.fn(),
    };

    controller = new ProjectMappingController(service as ProjectMappingService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should delete the project mapping", async () => {
    vi.mocked(service.delete).mockResolvedValue(mockProjectMapping);

    const result = await controller.delete(mockProjectId, mockUserId);
    expect(service.delete).toHaveBeenCalledWith({ projectId: mockProjectId, userId: mockUserId });
    expect(result).toEqual(mockProjectMapping);
  });

  it("should throw InternalServerErrorException on error", async () => {
    vi.mocked(service.delete).mockRejectedValue(new Error("Delete error"));
    await expect(controller.delete(mockProjectId, mockUserId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
