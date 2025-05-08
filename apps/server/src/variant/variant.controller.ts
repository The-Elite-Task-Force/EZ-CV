import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { createId } from "@paralleldrive/cuid2";
import { User as UserEntity } from "@prisma/client";
import { DuplicateAsVariantDto, UpdateVariantDto, VariantDto } from "@reactive-resume/dto";
import { ResumeDto } from "@reactive-resume/dto";

import { OptionalGuard } from "../auth/guards/optional.guard";
import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { User } from "../user/decorators/user.decorator";
import { Variant } from "./decorators/variant.decorator";
import { VariantGuard } from "./guards/variant.guard";
import { VariantService } from "./variant.service";

@ApiTags("Variant")
@Controller("variant")
export class VariantController {
  constructor(private readonly variantService: VariantService) {}
  @UseGuards(TwoFactorGuard)
  @Post("/duplicateFromResume/")
  async create(@Body() createVariantDto: DuplicateAsVariantDto) {
    try {
      return await this.variantService.createVariant(createVariantDto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(":id")
  @UseGuards(TwoFactorGuard)
  remove(@User() user: UserEntity, @Param("id") id: string) {
    return this.variantService.remove(user.id, id);
  }

  @Patch(":id")
  @UseGuards(TwoFactorGuard)
  update(
    @User() user: UserEntity,
    @Param("id") id: string,
    @Body() updateResumeDto: UpdateVariantDto,
  ) {
    return this.variantService.update(user.id, id, updateResumeDto);
  }

  @Get(":id")
  @UseGuards(TwoFactorGuard, VariantGuard)
  findOne(@Variant() variant: VariantDto) {
    return variant;
  }

  @Get("getall/:id")
  @UseGuards(TwoFactorGuard)
  async findall(@Param("id") id: string) {
    return await this.variantService.findAll(id);
  }

  @Get("/print/:id")
  @UseGuards(OptionalGuard, VariantGuard)
  async printResume(@User("id") userId: string | undefined, @Variant() variant: VariantDto) {
    try {
      const url = await this.variantService.printResume(variant);

      return { url };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get("/print/:id/preview")
  @UseGuards(TwoFactorGuard, VariantGuard)
  async printPreview(@Variant() variant: VariantDto) {
    try {
      const url = await this.variantService.printPreview(variant);

      return { url };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

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
