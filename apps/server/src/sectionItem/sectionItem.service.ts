import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { CreateSectionItemDto, UpdateSectionItemDto, DeleteDto } from "@reactive-resume/dto";

@Injectable()
export class SectionItemService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.sectionItem.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  }

  async createSectionItem(userId: string, createSectionDto: CreateSectionItemDto) {
    try {
      // Create the new section
      return await this.prisma.sectionItem.create({
        data: {
          data: createSectionDto.data,
          format: createSectionDto.format,
          userId: userId,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateSectionItem(userId: string, id: string, updateSectionDto: UpdateSectionItemDto) {
    try {
      return await this.prisma.sectionItem.update({
        data: {
          data: updateSectionDto.data,
        },
        where: { userId_id: { userId, id } },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteSectionItem(id: string) {
    try {
      return await this.prisma.sectionItem.delete({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
