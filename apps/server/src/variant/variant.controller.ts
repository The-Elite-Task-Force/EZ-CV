import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { createId } from "@paralleldrive/cuid2";
import { User as UserEntity } from "@prisma/client";
import { CreateVariantDto, ResumeDto, VariantDto } from "@reactive-resume/dto";

import { OptionalGuard } from "../auth/guards/optional.guard";
import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { Resume } from "../resume/decorators/resume.decorator";
import { ResumeGuard } from "../resume/guards/resume.guard";
import { User } from "../user/decorators/user.decorator";
import { VariantService } from "./variant.service";
@ApiTags("Variant")
@Controller("variant")
export class VariantController {
  constructor(private readonly variantService: VariantService) {}
  @UseGuards(TwoFactorGuard)
  @Post()
  async create(createVariantDto: CreateVariantDto, @User() user: UserEntity) {
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
    return this.variantService.remove(id, user.id);
  }

  //Not sure how this works, but it should be similar to the resume controller
  @Get(":id")
  @UseGuards(TwoFactorGuard)
  findOne(@Resume() variant: VariantDto) {
    return variant;
  }

  @Get("getall/:id")
  @UseGuards(TwoFactorGuard)
  async findall(@Param("id") id: string) {
    return await this.variantService.findAll(id);
  }

  @Get("/print/:id")
  @UseGuards(OptionalGuard, ResumeGuard)
  async printResume(@User("id") userId: string | undefined, @Resume() variant: VariantDto) {
    try {
      const url = await this.variantService.printResume(variant);

      return { url };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get("/print/:id/preview")
  @UseGuards(TwoFactorGuard, ResumeGuard)
  async printPreview(@Resume() variant: VariantDto) {
    try {
      const url = await this.variantService.printPreview(variant);

      return { url };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
