import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ResumeDto, VariantDto } from "@reactive-resume/dto";
import { ERROR_MESSAGE } from "@reactive-resume/utils";
import { PrismaService } from "nestjs-prisma";

import { translateSections } from "../ai/translator";

@Injectable()
export class VariantService {
  constructor(private readonly prisma: PrismaService) {}

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
