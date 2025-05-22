import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateProjectDto } from "@reactive-resume/dto";
import { Role } from "@reactive-resume/dto";
import { ERROR_MESSAGE } from "@reactive-resume/utils";

import { TwoFactorGuard } from "@/server/auth/guards/two-factor.guard";

import { AllowedRoles, CompanyRoleGuard } from "../company/guards/company.role.guard";
import { User } from "../user/decorators/user.decorator";
import { ProjectService } from "./project.service";

@ApiTags("Project")
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(TwoFactorGuard, CompanyRoleGuard)
  @AllowedRoles(Role.Admin.name, Role.Owner.name, Role.Bidmanager.name)
  async create(@User() user: UserEntity, @Body() createProjectDto: CreateProjectDto) {
    try {
      return await this.projectService.create(user.id, createProjectDto);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ERROR_MESSAGE.ProjectNameAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(":id")
  async findOneByProjectId(@Param("id") projectId: string) {
    try {
      const data = await this.projectService.findOneByProjectId(projectId);
      return data;
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get("company/:companyId")
  async findProjectsFromCompany(@Param("companyId") companyId: string) {
    try {
      return await this.projectService.findProjectsFromCompany(companyId);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get("own/:id")
  @UseGuards(TwoFactorGuard)
  async findOwnByCompanyId(@User() user: UserEntity, @Param("id") companyId: string) {
    try {
      const data = await this.projectService.findUserProjectsByCompanyId(user.id, companyId);
      return data;
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
