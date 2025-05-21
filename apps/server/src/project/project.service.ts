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
        description: null,
        companyId: createProjectDto.companyId,
      },
    });

    return project;
  }

  async findOneByProjectId(projectId: string): Promise<ProjectDto> {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
    });

    return project;
  }

  async findProjectsFromCompany(companyId: string): Promise<ProjectDto[]> {
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

  async findUserProjectsByCompanyId(userId: string, companyId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        userId,
        companyId,
      },
    });

    return projects;
  }
}
