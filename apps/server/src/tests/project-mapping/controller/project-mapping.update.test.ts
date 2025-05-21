import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectMappingController } from "@/server/projectMapping/project-mapping.controller";
import type { ProjectMappingService } from "@/server/projectMapping/project-mapping.service";

import { mockUserId } from "../../mocks/mocks";
import { mockProjectId } from "../../mocks/project";
import { mockProjectMapping, mockUpdateResumeId } from "../../mocks/project-mapping";

describe("ProjectMappingController - update", () => {
  let controller: ProjectMappingController;
  let service: Pick<ProjectMappingService, "update">;

  beforeEach(() => {
    service = {
      update: vi.fn(),
    };

    controller = new ProjectMappingController(service as ProjectMappingService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should update the project mapping", async () => {
    const updated = { ...mockProjectMapping, resumeId: mockUpdateResumeId };
    vi.mocked(service.update).mockResolvedValue(updated);

    const result = await controller.update(mockProjectId, mockUserId, {
      resumeId: mockUpdateResumeId,
    });

    expect(service.update).toHaveBeenCalledWith({
      projectId: mockProjectId,
      userId: mockUserId,
      resumeId: mockUpdateResumeId,
    });
    expect(result).toEqual(updated);
  });

  it("should throw InternalServerErrorException on error", async () => {
    vi.mocked(service.update).mockRejectedValue(new Error("Update error"));
    await expect(
      controller.update(mockProjectId, mockUserId, { resumeId: mockUpdateResumeId }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
