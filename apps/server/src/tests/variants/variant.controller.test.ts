import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { ResumeVariant } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { DuplicateAsVariantDto, VariantDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VariantController } from "../../variant/variant.controller";
import { VariantService } from "../../variant/variant.service";
import { mockUserWithoutPRI } from "../mocks/mocks";
import { mockSavedVariant, mockUser } from "../mocks/resumeMocks";

describe("ProjectController", () => {
  let controller: VariantController;
  let service: Pick<VariantService, "createVariant">;

  beforeEach(() => {
    service = {
      createVariant: vi.fn(),
    };

    controller = new VariantController(service as VariantService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call projectService.create and return result", async () => {
    const expectedResult: VariantDto = mockSavedVariant;

    vi.mocked(service.createVariant).mockResolvedValue(expectedResult);

    const result = await controller.create(mockSavedVariant, mockUser);

    expect(service.createVariant).toHaveBeenCalledWith(mockSavedVariant);
    expect(result).toEqual(expectedResult);
  });

  it("should throw BadRequestException if variant name already exists", async () => {
    const prismaError = new PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "4.0.0",
    });
    vi.mocked(service.createVariant).mockRejectedValue(prismaError);

    await expect(controller.create(mockSavedVariant, mockUser)).rejects.toThrow(prismaError);
    expect(service.createVariant).toHaveBeenCalledWith(mockSavedVariant);
    expect(service.createVariant).toHaveBeenCalledTimes(1);
  });

  it("should throw InternalServerErrorException on unknown error", async () => {
    vi.mocked(service.createVariant).mockRejectedValue(new Error("Something went wrong"));

    await expect(controller.create(mockSavedVariant, mockUser)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
