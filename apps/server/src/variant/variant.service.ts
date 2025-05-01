import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import { CreateVariantDto, resumeSchema, UpdateResumeDto, VariantDto } from "@reactive-resume/dto";
import { ERROR_MESSAGE } from "@reactive-resume/utils";
import { PrismaService } from "nestjs-prisma";

import { PrinterService } from "../printer/printer.service";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class VariantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly printerService: PrinterService,
  ) {}

  async createVariant(createVariantDto: CreateVariantDto) {
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

      // Transform the data to match Prisma's expected input
      const variantData: Prisma.ResumeVariantCreateInput = {
        ...validatedResume.data,
        id: createId(), // Generate a new ID for the variant
        creator: { connect: { id: creatorId } }, // Connect the creator
        resume: { connect: { id: resumeId } }, // Connect the resume
        user: {
          connect: { id: resume.userId }, // Properly structure the user property
        },
      };

      // Save the variant in the database
      const variant = await this.prisma.resumeVariant.create({
        data: variantData,
      });

      return variant;
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
      const { locked } = await this.prisma.resume.findUniqueOrThrow({
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

    return this.prisma.resume.delete({ where: { userId_id: { userId, id } } });
  }
}
