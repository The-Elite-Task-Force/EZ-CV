import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
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
  create(@Body() dto: CreateProjectMappingDto) {
    return this.service.create(dto);
  }

  @Get(":projectId")
  @UseGuards(TwoFactorGuard)
  findByProjectId(@Param("projectId") projectId: string) {
    return this.service.findByProjectId(projectId);
  }

  @Patch(":projectId/:userId")
  @UseGuards(TwoFactorGuard)
  update(
    @Param("projectId") projectId: string,
    @Param("userId") userId: string,
    @Body() body: { resumeId?: string },
  ) {
    return this.service.update({
      projectId,
      userId,
      resumeId: body.resumeId,
    });
  }

  @Delete(":projectId/:userId")
  @UseGuards(TwoFactorGuard)
  delete(@Param("projectId") projectId: string, @Param("userId") userId: string) {
    return this.service.delete({ projectId, userId });
  }
}
