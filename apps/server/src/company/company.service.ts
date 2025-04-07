import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  COMPANY_STATUS,
  CompanyDto,
  CompanyWithRoleDto,
  CreateCompanyDto,
  CreateCompanyMappingDto,
  EmployeeDto,
  UpdateCompanyDto,
} from "@reactive-resume/dto";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Role } from "libs/dto/src/company/types/roles";
import { PrismaService } from "nestjs-prisma";
@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyByOwnerId(id: string): Promise<CompanyDto[]> {
    return this.prisma.company.findMany({
      where: { ownerId: id },
    });
  }

  async getCompanies(userId: string): Promise<CompanyWithRoleDto[]> {
    const mappings = await this.prisma.companyMapping.findMany({
      where: { userId, status: COMPANY_STATUS.ACCEPTED },
      include: { company: true, role: true },
    });

    return mappings.map((mapping) => ({
      ...mapping.company,
      role: mapping.role, // returns the role object as is
    }));
  }

  async getCompanyById(id: string): Promise<CompanyDto> {
    return this.prisma.company.findUniqueOrThrow({
      where: { id },
    });
  }

  async create(id: string, createCompanyDto: CreateCompanyDto) {
    const company = await this.prisma.company.create({
      data: {
        name: createCompanyDto.name,
        ownerId: id,
        description: "",
        location: "",
      },
    });

    await this.prisma.companyMapping.create({
      data: {
        company: { connect: { id: company.id } },
        user: { connect: { id } },
        role: { connect: { id: Role.Owner.getId() } },
        status: COMPANY_STATUS.ACCEPTED,
        invitedAt: new Date().toString(),
      },
    });

    return company;
  }

  async update(updateCompanyDto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id: updateCompanyDto.id },
      data: updateCompanyDto,
    });
  }

  async delete(user: string, id: string) {
    return this.prisma.company.delete({
      where: { id, ownerId: user },
    });
  }

  async getEmployees(companyId: string): Promise<EmployeeDto[]> {
    const mappings = await this.prisma.companyMapping.findMany({
      where: { companyId, status: "ACCEPTED" },
      include: { user: true, role: true },
    });

    return mappings.map((mapping) => ({
      id: mapping.user.id,
      email: mapping.user.email,
      username: mapping.user.username,
      role: mapping.role ? [mapping.role.name] : null,
      updatedAt: mapping.user.updatedAt,
      picture: mapping.user.picture,
    }));
  }

  async removeUserFromCompany(companyId: string, username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException(`User with identifier ${username} not found`);
    }

    return this.prisma.companyMapping.delete({
      where: { userId_companyId: { userId: user.id, companyId } },
    });
  }

  async inviteUserToCompany(createCompanyMappingDto: CreateCompanyMappingDto) {
    const { username, companyId } = createCompanyMappingDto;
    let { userId } = createCompanyMappingDto;

    //Throw error if the dto contains no username or userId
    if (!userId && !username) {
      throw new BadRequestException("No user identifier provided");
    }
    //Gets the userId if the username is provided
    if (!userId && username) {
      const user = await this.prisma.user.findUnique({
        where: { username: createCompanyMappingDto.username },
      });
      if (!user?.id) {
        throw new NotFoundException("User not found");
      }
      userId = user.id;
    }

    if (!userId) {
      // User id should not be undefined with the logic in the previous code snippet, but typescript is constantly complaining so I added this check
      throw new BadRequestException("No user identifier provided");
    }

    const existingMapping = await this.prisma.companyMapping.findUnique({
      where: {
        userId_companyId: { userId: userId, companyId },
      },
    });

    if (existingMapping && existingMapping.status === COMPANY_STATUS.ACCEPTED) {
      throw new Error("User is already part of the company.");
    } else if (existingMapping && existingMapping.status === COMPANY_STATUS.PENDING) {
      throw new Error("User already has a pending invite to the company.");
    }

    await this.prisma.companyMapping.upsert({
      where: {
        userId_companyId: { userId, companyId },
      },
      update: {
        status: COMPANY_STATUS.PENDING,
        invitedAt: new Date().toString(),
      },
      create: {
        company: { connect: { id: companyId } },
        user: { connect: { id: userId } },
        invitedAt: new Date().toString(),
        role: { connect: { id: Role.Member.getId() } },
      },
    });
  }

  async assignRole(companyId: string, userId: string, roleId: number | string) {
    if (typeof roleId === "string") {
      roleId = Role[roleId as "Owner" | "Admin" | "Bidmanager" | "Member"].getId();
    }
    return this.prisma.companyMapping.update({
      where: { userId_companyId: { userId, companyId } },
      data: { roleId },
    });
  }

  async getActiveInvitations(userId: string) {
    try {
      const data = await this.prisma.companyMapping.findMany({
        where: { userId, status: COMPANY_STATUS.PENDING },
        include: { company: true },
      });

      return data;
    } catch (error) {
      throw new Error(`Error occurred while fetching invitations: ${error}`);
    }
  }

  async changeEmploymentStatus(companyMappingId: string, status: COMPANY_STATUS) {
    try {
      const data = await this.prisma.companyMapping.update({
        where: { id: companyMappingId },
        data: { status: status, respondedAt: new Date().toString() },
      });

      return data;
    } catch (error) {
      throw new Error(`Error occurred while fetching invitations: ${error}`);
    }
  }

  async getMapping(userId: string, companyId: string) {
    return this.prisma.companyMapping.findUnique({
      where: { userId_companyId: { userId, companyId } },
      include: { role: true },
    });
  }
}
