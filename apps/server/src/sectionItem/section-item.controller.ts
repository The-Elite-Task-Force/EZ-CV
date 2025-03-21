import {
  BadRequestException,
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
import { User as UserEntity } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  CreateSectionItemDto,
  CreateSectionMappingDto,
  LinkedInImportSections,
  SECTION_FORMAT,
  UpdateSectionItemDto,
} from "@reactive-resume/dto";
import { DeleteMappingDto } from "@reactive-resume/dto";
import { sectionSchemaWithData } from "@reactive-resume/schema";
import { ERROR_MESSAGE } from "@reactive-resume/utils";
import zodToJsonSchema from "zod-to-json-schema";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { User } from "../user/decorators/user.decorator";
import { SectionItemService } from "./section-item.service";

@ApiTags("SectionItem")
@Controller("sectionItem")
export class SectionItemController {
  constructor(private readonly sectionItemService: SectionItemService) {}

  @Get("schema")
  getSchema() {
    return zodToJsonSchema(sectionSchemaWithData);
  }

  @Get()
  @UseGuards(TwoFactorGuard)
  findAll(@User() user: UserEntity) {
    return this.sectionItemService.findAll(user.id);
  }

  @Post()
  @UseGuards(TwoFactorGuard)
  async create(@User() user: UserEntity, @Body() createSectionDto: CreateSectionItemDto) {
    try {
      return await this.sectionItemService.createSectionItem(user.id, createSectionDto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(":id")
  @UseGuards(TwoFactorGuard)
  async update(
    @User() user: UserEntity,
    @Param("id") id: string,
    @Body() updateSectionDto: UpdateSectionItemDto,
  ) {
    try {
      return await this.sectionItemService.updateSectionItem(user.id, id, updateSectionDto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post("import")
  @UseGuards(TwoFactorGuard)
  async import(
    @User() user: UserEntity,
    @Body("sections") importSectionsDto: LinkedInImportSections,
    @Body("createResume") createResume: boolean,
    @Body("resumeTitle") resumeTitle: string,
  ) {
    try {
      return await this.sectionItemService.import(
        user.id,
        importSectionsDto,
        createResume,
        resumeTitle,
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ERROR_MESSAGE.ResumeSlugAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(":id/:format")
  @UseGuards(TwoFactorGuard)
  async delete(
    @User() user: UserEntity,
    @Param("id") id: string,
    @Param("format") format: SECTION_FORMAT,
  ) {
    try {
      return await this.sectionItemService.deleteSectionItem(user.id, format, id);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get("mappings/:id")
  @UseGuards(TwoFactorGuard)
  async getMappings(@User() user: UserEntity, @Param("id") id: string) {
    try {
      return await this.sectionItemService.getMappings(id);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post("mappings")
  @UseGuards(TwoFactorGuard)
  async createMappings(@User() user: UserEntity, @Body() data: CreateSectionMappingDto) {
    try {
      return await this.sectionItemService.createMapping(data);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete("mappings")
  @UseGuards(TwoFactorGuard)
  async deleteMappings(@User() user: UserEntity, @Body() data: DeleteMappingDto) {
    try {
      return await this.sectionItemService.deleteMapping(data);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
