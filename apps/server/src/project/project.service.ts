import { Injectable } from "@nestjs/common";
import { CreateProjectDto, ProjectDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";
@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string, createProjectDto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        userId: id,
        description: "",
        companyId: createProjectDto.companyId,
      },
    });

    return project;
  }

  async getProjectsFromCompany(companyId: string): Promise<ProjectDto[]> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error(`Company with ID: ${companyId} - does not exist.`);
    }

    const mappings = await this.prisma.project.findMany({
      where: { companyId: companyId },
    });

    return mappings;
  }

  async getUserProjectsByCompanyId(userId: string, companyId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        userId,
        companyId,
      },
    });

    return projects;
  }
}
