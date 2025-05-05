import { Injectable } from "@nestjs/common";
import { CreateProjectDto } from "@reactive-resume/dto";
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
}
