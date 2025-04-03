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

import { TwoFactorGuard } from "@/server/auth/guards/two-factor.guard";
import { CompanyService } from "@/server/company/company.service";

import { User } from "../user/decorators/user.decorator";

@ApiTags("Company")
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(TwoFactorGuard)
  async get(@User() user: UserEntity) {
    try {
      const data = await this.companyService.getCompanies(user.id);
      return data;
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get("/own")
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

  @Get(":id")
  @UseGuards(TwoFactorGuard)
  async getById(@User() user: UserEntity, @Param("id") id: string) {
    try {
      return await this.companyService.getCompanyById(id);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
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

  @Patch()
  @UseGuards(TwoFactorGuard)
  async update(@User() user: UserEntity, @Body() updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.companyService.update(updateCompanyDto);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(":id")
  @UseGuards(TwoFactorGuard)
  delete(@User() user: UserEntity, @Param("id") id: string) {
    try {
      return this.companyService.delete(user.id, id);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(":id/employees")
  @UseGuards(TwoFactorGuard)
  async getEmployees(@Param("id") companyId: string) {
    try {
      return await this.companyService.getEmployees(companyId);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(":id/remove")
  @UseGuards(TwoFactorGuard)
  async removeUserFromCompany(@Param("id") companyId: string, @Body("username") username: string) {
    try {
      return await this.companyService.removeUserFromCompany(companyId, username);
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post("invite")
  @UseGuards(TwoFactorGuard)
  async linkUserToCompany(@Body() data: CreateCompanyMappingDto) {
    try {
      await this.companyService.inviteUserToCompany(data);
      return { message: "User invited successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch("changeEmploymentStatus")
  @UseGuards(TwoFactorGuard)
  async changeEmploymentStatus(@Body() data: { companyMappingId: string; status: COMPANY_STATUS }) {
    try {
      await this.companyService.changeEmploymentStatus(data.companyMappingId, data.status);
      return { message: "Employment status updated successfully" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get("activeInvitations/:userId")
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
