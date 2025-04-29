import { InternalServerErrorException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ResumeService } from "../../resume/resume.service";
import { VariantController } from "../../variant/variant.controller";
import type { VariantService } from "../../variant/variant.service";
import { mockResume, mockSavedVariant, mockTranslatedData, mockUser } from "../mocks/resumeMocks";

describe("VariantController", () => {
  let controller: VariantController;
  let mockVariantService: Partial<VariantService>;
  let mockResumeService: Partial<ResumeService>;

  beforeEach(() => {
    mockVariantService = {
      translate: vi.fn(),
      saveVariant: vi.fn(),
    };

    mockResumeService = {};

    controller = new VariantController(
      mockResumeService as ResumeService,
      mockVariantService as VariantService,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("translate", () => {
    it("should translate a resume and save the variant", async () => {
      vi.mocked(mockVariantService.translate).mockResolvedValue(mockTranslatedData);
      vi.mocked(mockVariantService.saveVariant).mockResolvedValue(mockSavedVariant);

      const result = await controller.translate(mockUser, mockResume);

      expect(mockVariantService.translate).toHaveBeenCalledWith(mockResume);
      expect(mockVariantService.saveVariant).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          resumeId: mockTranslatedData.id,
          creatorId: mockUser.id,
          userId: mockUser.id,
        }),
      );
      expect(result).toEqual(mockSavedVariant);
    });

    it("should throw an InternalServerErrorException if translation fails", async () => {
      vi.mocked(mockVariantService.translate).mockRejectedValue(new Error("Translation failed"));

      await expect(controller.translate(mockUser, mockResume)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockVariantService.translate).toHaveBeenCalledWith(mockResume);
      expect(mockVariantService.saveVariant).not.toHaveBeenCalled();
    });
  });
});
