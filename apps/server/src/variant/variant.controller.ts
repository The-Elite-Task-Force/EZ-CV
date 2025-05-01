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
import { ResumeDto, CreateVariantDto, VariantDto } from "@reactive-resume/dto";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { User } from "../user/decorators/user.decorator";
import { VariantService } from "./variant.service";
import { Resume } from "../resume/decorators/resume.decorator";
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

  @Get("print/:preview")
  @UseGuards(TwoFactorGuard)
  async printPreview(@Resume() variant: VariantDto) {
    try {
      const url =  await this.variantService.printPreview(variant);
      return {url}
  }

  @Get("print/:id/preview")
  @UseGuards(TwoFactorGuard)
  async printResume(@User("id") userId: string | undefined, @Resume() variant: ResumeDto) {
    try {
      const url = await this.variantService.printResume(variant, userId);
      return { url };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

}
