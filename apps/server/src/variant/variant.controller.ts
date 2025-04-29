import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { createId } from "@paralleldrive/cuid2";
import { User as UserEntity } from "@prisma/client";
import { ResumeDto } from "@reactive-resume/dto";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { ResumeService } from "../resume/resume.service";
import { User } from "../user/decorators/user.decorator";
import { VariantService } from "./variant.service";
@ApiTags("Variant")
@Controller("variant")
export class VariantController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly variantService: VariantService,
  ) {}
  @UseGuards(TwoFactorGuard)
  @Post("/translate")
  async translate(@User() user: UserEntity, @Body() resume: ResumeDto) {
    try {
      const translatedData = await this.variantService.translate(resume);

      const variantDto = {
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        ...translatedData,
        id: createId(),
        resumeId: translatedData.id,
        creatorId: user.id,
        userId: user.id,
      };
      return await this.variantService.saveVariant(variantDto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
