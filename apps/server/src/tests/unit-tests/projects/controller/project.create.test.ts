import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectController } from "../../../../project/project.controller";
import type { ProjectService } from "../../../../project/project.service";
import { mockUserWithoutPRI } from "../../../mocks/mocks";
import { mockCreateProjectDto, mockProject } from "../../../mocks/project";

describe("ProjectController - create", () => {
  let controller: ProjectController;
  let service: Pick<ProjectService, "create">;

  beforeEach(() => {
    service = {
      create: vi.fn(),
    };

    controller = new ProjectController(service as ProjectService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call projectService.create and return result", async () => {
    vi.mocked(service.create).mockResolvedValue(mockProject);

    const result = await controller.create(mockUserWithoutPRI, mockCreateProjectDto);

    expect(service.create).toHaveBeenCalledWith(mockUserWithoutPRI.id, mockCreateProjectDto);
    expect(result).toEqual(mockProject);
  });

  it("should throw BadRequestException if project name already exists", async () => {
    const prismaError = new PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "4.0.0",
    });

    vi.mocked(service.create).mockRejectedValue(prismaError);

    await expect(controller.create(mockUserWithoutPRI, mockCreateProjectDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it("should throw InternalServerErrorException on unknown error", async () => {
    vi.mocked(service.create).mockRejectedValue(new Error("Something went wrong"));

    await expect(controller.create(mockUserWithoutPRI, mockCreateProjectDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
