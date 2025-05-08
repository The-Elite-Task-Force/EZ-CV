import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  DuplicateAsVariantDto,
  ResumeDto,
  resumeSchema,
  UpdateResumeDto,
  VariantDto,
  variantSchema,
} from "@reactive-resume/dto";
import { ERROR_MESSAGE } from "@reactive-resume/utils";
import { PrismaService } from "nestjs-prisma";

import { translateSections } from "../ai/translator";
import { PrinterService } from "../printer/printer.service";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class VariantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly printerService: PrinterService,
  ) {}

  async createVariant(createVariantDto: DuplicateAsVariantDto) {
    const { resumeId, userId, creatorId } = createVariantDto;
    try {
      const resume = await this.prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: userId,
        },
      });

      if (!resume) {
        Logger.error("Resume not found", { resumeId, userId });
        throw new BadRequestException("Resume not found");
      }

      // Validate the entire resume object
      const validatedResume = resumeSchema.safeParse(resume);
      if (!validatedResume.success) {
        Logger.error("Invalid resume", validatedResume.error);
        throw new BadRequestException("Invalid resume");
      }

      const variantData: Prisma.ResumeVariantCreateInput = {
        title: createVariantDto.title,
        slug: createVariantDto.slug,
        data: validatedResume.data.data,
        visibility: validatedResume.data.visibility,
        locked: validatedResume.data.locked,
        language: validatedResume.data.language,
        creator: { connect: { id: creatorId } },
        resume: { connect: { id: resumeId } },
        user: { connect: { id: userId } },
      };

      // Save variant
      const variant = await this.prisma.resumeVariant.create({
        data: variantData,
      });

      const validationResult = variantSchema.safeParse(variant);
      if (!validationResult.success) {
        throw new Error("Variant does not match VariantDto schema");
      }

      return validationResult.data as VariantDto;
    } catch (error) {
      Logger.error("Error creating variant", error);
      throw new InternalServerErrorException("Error creating variant", error);
    }
  }

  findAll(userId: string) {
    return this.prisma.resumeVariant.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  findOne(id: string, userId?: string) {
    if (userId) {
      return this.prisma.resumeVariant.findUniqueOrThrow({
        where: {
          id,
          userId,
        },
      });
    }
    return this.prisma.resumeVariant.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async printResume(variant: VariantDto) {
    const url = await this.printerService.printResume(variant);

    return url;
  }

  printPreview(resume: VariantDto) {
    return this.printerService.printPreview(resume);
  }

  async update(userId: string, id: string, updateVariantDto: UpdateResumeDto) {
    try {
      const { locked } = await this.prisma.resumeVariant.findUniqueOrThrow({
        where: { id },
        select: { locked: true },
      });

      if (locked) throw new BadRequestException(ERROR_MESSAGE.ResumeLocked);
      if (!updateVariantDto.data && !updateVariantDto.title)
        throw new BadRequestException("Invalid data");

      return await this.prisma.resumeVariant.update({
        data: {
          title: updateVariantDto.title,
          slug: updateVariantDto.slug,
          visibility: updateVariantDto.visibility,
          data: updateVariantDto.data,
          language: updateVariantDto.language,
        },
        where: { userId_id: { userId, id } },
      });
    } catch (error) {
      if (error.code === "P2025") {
        Logger.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  async remove(userId: string, id: string) {
    await Promise.all([
      // Remove files in storage, and their cached keys
      this.storageService.deleteObject(userId, "resumes", id),
      this.storageService.deleteObject(userId, "previews", id),
    ]);
    try {
      return await this.prisma.resumeVariant.delete({
        where: { userId_id: { userId, id } }, // Use the composite key
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new BadRequestException(error);
      }
      throw error;
    }
  }

  async translate(resume: ResumeDto) {
    if (!resume.language) throw new BadRequestException(ERROR_MESSAGE.InvalidLanguage);

    resume.data.sections = await translateSections(resume.data.sections, resume.language);
    return resume;
  }

  async saveVariant(resume: VariantDto) {
    try {
      const { id, slug, title, data, visibility, userId, creatorId, resumeId } = resume;
      const variantData = await this.prisma.resumeVariant.create({
        data: {
          id,
          slug,
          title,
          data,
          visibility,
          user: { connect: { id: userId } }, // Connect owner
          creator: { connect: { id: creatorId } }, // Connect creator
          resume: { connect: { id: resumeId } }, // Connect the related resume
        },
      });
      return variantData;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
