import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateProjectDto } from "@reactive-resume/dto";
import { ERROR_MESSAGE } from "@reactive-resume/utils";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Role } from "libs/dto/src/company/types/roles";

import { TwoFactorGuard } from "@/server/auth/guards/two-factor.guard";

import { AllowedRoles, CompanyRoleGuard } from "../company/guards/company.role.guard";
import { User } from "../user/decorators/user.decorator";
import { ProjectService } from "./project.service";

@ApiTags("Project")
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post() // Create a new project
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
}
