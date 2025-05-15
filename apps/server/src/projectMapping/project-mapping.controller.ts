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
import { CreateProjectMappingDto } from "@reactive-resume/dto";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { ProjectMappingService } from "./project-mapping.service";

@ApiTags("ProjectMapping")
@Controller("projectMapping")
export class ProjectMappingController {
  constructor(private readonly service: ProjectMappingService) {}

  @Post()
  @UseGuards(TwoFactorGuard)
  async create(@Body() dto: CreateProjectMappingDto) {
    try {
      return await this.service.create(dto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(":projectId")
  @UseGuards(TwoFactorGuard)
  async findByProjectId(@Param("projectId") projectId: string) {
    try {
      return await this.service.findByProjectId(projectId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(":projectId/:userId")
  @UseGuards(TwoFactorGuard)
  async update(
    @Param("projectId") projectId: string,
    @Param("userId") userId: string,
    @Body() body: { resumeId?: string },
  ) {
    try {
      return await this.service.update({
        projectId,
        userId,
        resumeId: body.resumeId,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(":projectId/:userId")
  @UseGuards(TwoFactorGuard)
  async delete(@Param("projectId") projectId: string, @Param("userId") userId: string) {
    try {
      return await this.service.delete({ projectId, userId });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
