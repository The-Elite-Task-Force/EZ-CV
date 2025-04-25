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
  COMPANY_STATUS,
  CreateCompanyDto,
  CreateCompanyMappingDto,
  UpdateCompanyDto,
} from "@reactive-resume/dto";
import { ERROR_MESSAGE } from "@reactive-resume/utils";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Role } from "libs/dto/src/company/types/roles";

import { TwoFactorGuard } from "@/server/auth/guards/two-factor.guard";
import { CompanyService } from "@/server/company/company.service";

import { User } from "../user/decorators/user.decorator";
import { AllowedRoles } from "./guards/company.role.guard";
import { CompanyRoleGuard } from "./guards/company.role.guard";
@ApiTags("Company")
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(TwoFactorGuard) // Get all companies for the user
  async get(@User() user: UserEntity) {
    try {
      const data = await this.companyService.getCompanies(user.id);
      return data;
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get("/own") // Get companies owned by the user
  @UseGuards(TwoFactorGuard)
  async getByOwnerId(@User() user: UserEntity) {
    try {
      const data = await this.companyService.getCompanyByOwnerId(user.id);
      return data;
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(":id") // Get a company by ID
  @UseGuards(TwoFactorGuard)
  async getById(@User() user: UserEntity, @Param("id") id: string) {
    try {
      return await this.companyService.getCompanyById(id);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post() // Create a new company
  @UseGuards(TwoFactorGuard)
  async create(@User() user: UserEntity, @Body() createCompanyDto: CreateCompanyDto) {
    try {
      return await this.companyService.create(user.id, createCompanyDto);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ERROR_MESSAGE.CompanyNameAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Patch() // Update a company
  @UseGuards(TwoFactorGuard, CompanyRoleGuard)
  @AllowedRoles(Role.Admin.name, Role.Owner.name) // Only Admin and Owner can update a company
  async update(@User() user: UserEntity, @Body() updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.companyService.update(updateCompanyDto);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(":id") // Delete a company
  @UseGuards(TwoFactorGuard, CompanyRoleGuard)
  @AllowedRoles(Role.Owner.name) // Only Admin and Owner can delete a company
  delete(@User() user: UserEntity, @Param("id") id: string) {
    try {
      return this.companyService.delete(user.id, id);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(":id/employees") // Get employees of a company
  @UseGuards(TwoFactorGuard)
  async getEmployees(@Param("id") companyId: string) {
    try {
      return await this.companyService.getEmployees(companyId);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(":id/remove/:username") // Removed the typo so username is a separate route parameter
  @UseGuards(TwoFactorGuard, CompanyRoleGuard)
  @AllowedRoles(Role.Admin.name, Role.Owner.name) // Only Admin and Owner can remove users
  async removeUserFromCompany(@Param("id") companyId: string, @Param("username") username: string) {
    try {
      return await this.companyService.removeUserFromCompany(companyId, username);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post("invite") // Invite a user to a company
  @UseGuards(TwoFactorGuard, CompanyRoleGuard)
  @AllowedRoles(Role.Admin.name, Role.Owner.name) // Only Admin and Owner can invite users
  async linkUserToCompany(@Body() data: CreateCompanyMappingDto) {
    try {
      await this.companyService.inviteUserToCompany(data);
      return { message: "User invited successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch("assignRole") // Assign a role to a user in a company
  @UseGuards(TwoFactorGuard, CompanyRoleGuard)
  @AllowedRoles(Role.Admin.name, Role.Owner.name) // Only Admin and Owner can assign roles
  async assignRole(@Body() data: { companyId: string; userId: string; roleId: string | number }) {
    try {
      await this.companyService.assignRole(data.companyId, data.userId, data.roleId);
      return { message: "Role assigned successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch("changeEmploymentStatus") // Change employment status of a user in a company
  @UseGuards(TwoFactorGuard)
  async changeEmploymentStatus(@Body() data: { companyMappingId: string; status: COMPANY_STATUS }) {
    try {
      await this.companyService.changeEmploymentStatus(data.companyMappingId, data.status);
      return { message: "Employment status updated successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get("activeInvitations/:userId") // Get active invitations for a user
  @UseGuards(TwoFactorGuard)
  async getActiveInvitations(@Param("userId") userId: string) {
    try {
      return await this.companyService.getActiveInvitations(userId);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
