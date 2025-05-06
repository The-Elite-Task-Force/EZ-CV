import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import type { Project } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { CreateProjectDto } from "@reactive-resume/dto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectController } from "../../project/project.controller";
import type { ProjectService } from "../../project/project.service";
import { mockUserWithoutPRI } from "../mocks/mocks";

describe("ProjectController", () => {
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

  const mockDto: CreateProjectDto = {
    name: "My Project",
    companyId: "company-456",
  };

  it("should call projectService.create and return result", async () => {
    const expectedResult: Project = {
      id: "project-999",
      name: mockDto.name,
      companyId: mockDto.companyId,
      updatedAt: new Date(),
      userId: "user-123",
      description: "",
    };

    vi.mocked(service.create).mockResolvedValue(expectedResult);

    const result = await controller.create(mockUserWithoutPRI, mockDto);

    expect(service.create).toHaveBeenCalledWith(mockUserWithoutPRI.id, mockDto);
    expect(result).toEqual(expectedResult);
  });

  it("should throw BadRequestException if project name already exists", async () => {
    const prismaError = new PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "4.0.0",
    });

    vi.mocked(service.create).mockRejectedValue(prismaError);

    await expect(controller.create(mockUserWithoutPRI, mockDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it("should throw InternalServerErrorException on unknown error", async () => {
    vi.mocked(service.create).mockRejectedValue(new Error("Something went wrong"));

    await expect(controller.create(mockUserWithoutPRI, mockDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
