import { Injectable } from "@nestjs/common";
import { CreateProjectMappingDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class ProjectMappingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectMappingDto) {
    return await this.prisma.projectMapping.create({
      data: {
        projectId: dto.projectId,
        userId: dto.userId,
        ...(dto.resumeId && { resumeId: dto.resumeId }),
      },
    });
  }

  findByProjectId(projectId: string) {
    return this.prisma.projectMapping.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    });
  }

  update(dto: { projectId: string; userId: string; resumeId?: string }) {
    return this.prisma.projectMapping.update({
      where: {
        projectId_userId: {
          projectId: dto.projectId,
          userId: dto.userId,
        },
      },
      data: {
        resumeId: dto.resumeId ?? null,
      },
    });
  }

  delete(dto: { projectId: string; userId: string }) {
    return this.prisma.projectMapping.delete({
      where: {
        projectId_userId: {
          projectId: dto.projectId,
          userId: dto.userId,
        },
      },
    });
  }
}
