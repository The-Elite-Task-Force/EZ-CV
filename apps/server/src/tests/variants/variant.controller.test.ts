/* eslint-disable @typescript-eslint/no-misused-spread */
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VariantController } from "../../variant/variant.controller";
import type { VariantService } from "../../variant/variant.service";
import { mockSavedVariant, mockUser } from "../mocks/resumeMocks";
import { VariantDto, UpdateVariantDto } from "@reactive-resume/dto";
import { create } from "node:domain";
import { createId } from "@paralleldrive/cuid2";

describe("ProjectController", () => {
  let controller: VariantController;
  let service: Pick<
    VariantService,
    "createVariant" | "remove" | "update" | "findOne" | "findAll" | "printResume" | "printPreview"
  >;

  beforeEach(() => {
    service = {
      createVariant: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
      findOne: vi.fn(),
      findAll: vi.fn(),
      printResume: vi.fn(),
      printPreview: vi.fn(),
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

  it("should call service.remove and return result", async () => {
    const mockId = "variant123";

    vi.mocked(service.remove).mockResolvedValue(undefined);

    const result = await controller.remove(mockUser, mockId);

    expect(service.remove).toHaveBeenCalledWith(mockUser.id, mockId);
    expect(result).toBeUndefined();
  });

  it("should throw InternalServerErrorException on service.remove error", async () => {
    const mockId = "variant123";

    // Mock the service to throw an actual InternalServerErrorException
    vi.mocked(service.remove).mockRejectedValue(
      new InternalServerErrorException("Something went wrong"),
    );

    await expect(controller.remove(mockUser, mockId)).rejects.toThrow(InternalServerErrorException);
  });

  it("should call service.update and return result", async () => {
    const mockId = "variant123";
    const mockUpdateDto: UpdateVariantDto = { title: "Updated Variant", userId: "userId" };
    const expectedResult = { id: mockId, ...mockUpdateDto };

    vi.mocked(service.update).mockResolvedValue(expectedResult);

    const result = await controller.update(mockUser, mockId, mockUpdateDto);

    expect(service.update).toHaveBeenCalledWith(mockUser.id, mockId, mockUpdateDto);
    expect(result).toEqual(expectedResult);
  });

  it("should throw BadRequestException on invalid update data", async () => {
    const mockId = "variant123";
    const mockUpdateDto: UpdateVariantDto = { userId: createId() };

    vi.mocked(service.update).mockRejectedValue(new BadRequestException("Invalid data"));

    await expect(controller.update(mockUser, mockId, mockUpdateDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it("should call service.findOne and return result", () => {
    const mockVariant: VariantDto = mockSavedVariant;

    const result = controller.findOne(mockVariant);

    expect(result).toEqual(mockVariant);
  });

  it("should call service.findAll and return result", async () => {
    const mockVariants: VariantDto[] = [mockSavedVariant];

    vi.mocked(service.findAll).mockResolvedValue(mockVariants);

    const result = await controller.findall(mockUser.id);

    expect(service.findAll).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(mockVariants);
  });

  it("should call service.printResume and return URL", async () => {
    const mockVariant: VariantDto = mockSavedVariant;
    const mockUrl = "http://ezcv.com/print";

    vi.mocked(service.printResume).mockResolvedValue(mockUrl);

    const result = await controller.printResume(undefined, mockVariant);

    expect(service.printResume).toHaveBeenCalledWith(mockVariant);
    expect(result).toEqual({ url: mockUrl });
  });

  it("should call service.printPreview and return URL", async () => {
    const mockVariant: VariantDto = mockSavedVariant;
    const mockUrl = "http://ezcv.com/preview";

    vi.mocked(service.printPreview).mockResolvedValue(mockUrl);

    const result = await controller.printPreview(mockVariant);

    expect(service.printPreview).toHaveBeenCalledWith(mockVariant);
    expect(result).toEqual({ url: mockUrl });
  });
});
