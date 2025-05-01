import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import { CreateVariantDto, resumeSchema, VariantDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class VariantService {
  constructor(private readonly prisma: PrismaService) {}

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
}
