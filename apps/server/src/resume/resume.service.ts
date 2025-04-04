import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { createId } from "@paralleldrive/cuid2";
import { CreateResumeDto, ImportResumeDto, ResumeDto, UpdateResumeDto } from "@reactive-resume/dto";
import { defaultResumeData, ResumeData } from "@reactive-resume/schema";
import { DeepPartial, ERROR_MESSAGE, generateRandomName } from "@reactive-resume/utils";
import slugify from "@sindresorhus/slugify";
import deepmerge from "deepmerge";
import { PrismaService } from "nestjs-prisma";

import { PrinterService } from "@/server/printer/printer.service";

import { StorageService } from "../storage/storage.service";

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly printerService: PrinterService,
    private readonly storageService: StorageService,
  ) {}

  async create(userId: string, createResumeDto: CreateResumeDto) {
    const data = deepmerge(defaultResumeData, {} satisfies DeepPartial<ResumeData>);

    return this.prisma.resume.create({
      data: {
        data,
        userId,
        title: createResumeDto.title,
        visibility: createResumeDto.visibility,
        slug: createResumeDto.slug ?? slugify(createResumeDto.title),
      },
    });
  }

  async import(userId: string, importResumeDto: ImportResumeDto) {
    const randomTitle = generateRandomName();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const title = importResumeDto.title || randomTitle;

    const basicItemResult = await this.prisma.basicsItem.create({
      data: { ...importResumeDto.data.basics, userId: userId, id: createId() },
    });

    const result = await this.prisma.resume.create({
      data: {
        userId,
        visibility: "private",
        data: importResumeDto.data,
        id: createId(),
        title: title,
        slug: slugify(title),
        basicsItemId: basicItemResult.id,
      },
    });

    for (const [index, item] of importResumeDto.data.sections.summary.items.entries()) {
      const summaryItemResult = await this.prisma.summaryItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeSummaryItemMapping.create({
        data: { resumeId: result.id, order: index, summaryItemId: summaryItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.awards.items.entries()) {
      const awardItemResult = await this.prisma.awardItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeAwardItemMapping.create({
        data: { resumeId: result.id, order: index, awardItemId: awardItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.certifications.items.entries()) {
      const certificationItemResult = await this.prisma.certificationItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeCertificationItemMapping.create({
        data: {
          resumeId: result.id,
          order: index,
          certificationItemId: certificationItemResult.id,
        },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.education.items.entries()) {
      const educationItemResult = await this.prisma.educationItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeEducationItemMapping.create({
        data: { resumeId: result.id, order: index, educationItemId: educationItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.experience.items.entries()) {
      const workItemResult = await this.prisma.workItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeWorkItemMapping.create({
        data: { resumeId: result.id, order: index, workItemId: workItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.volunteer.items.entries()) {
      const volunteerItemResult = await this.prisma.volunteerItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeVolunteerItemMapping.create({
        data: { resumeId: result.id, order: index, volunteerItemId: volunteerItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.projects.items.entries()) {
      const projectItemResult = await this.prisma.projectItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeProjectItemMapping.create({
        data: { resumeId: result.id, order: index, projectItemId: projectItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.publications.items.entries()) {
      const publicationItemResult = await this.prisma.publicationItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumePublicationItemMapping.create({
        data: { resumeId: result.id, order: index, publicationItemId: publicationItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.references.items.entries()) {
      const referenceItemResult = await this.prisma.referenceItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeReferenceItemMapping.create({
        data: { resumeId: result.id, order: index, referenceItemId: referenceItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.skills.items.entries()) {
      const skillItemResult = await this.prisma.skillItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeSkillItemMapping.create({
        data: { resumeId: result.id, order: index, skillItemId: skillItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.languages.items.entries()) {
      const languageItemResult = await this.prisma.languageItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeLanguageItemMapping.create({
        data: { resumeId: result.id, order: index, languageItemId: languageItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.interests.items.entries()) {
      const interestItemResult = await this.prisma.interestItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeInterestItemMapping.create({
        data: { resumeId: result.id, order: index, interestItemId: interestItemResult.id },
      });
    }

    for (const [index, item] of importResumeDto.data.sections.profiles.items.entries()) {
      const profileItemResult = await this.prisma.profileItem.create({
        data: { ...item, userId: userId, id: createId() },
      });
      await this.prisma.resumeProfileItemMapping.create({
        data: { resumeId: result.id, order: index, profileItemId: profileItemResult.id },
      });
    }

    //OBS: Fix custom section
    // This is just pseudo code, it never worked
    // for (const [index, item] of importResumeDto.data.sections.custom.items.entries()) {
    //   const customItemResult = await this.prisma.customItem.create({
    //     data: { ...item, userId: userId, id: createId() },
    //   });
    //   await this.prisma.resumeCustomItemMapping.create({
    //     data: { resumeId: result.id, order: index, customItemId: customItemResult.id },
    //   });
    // }

    return result;
  }

  createEmptyResume(userId: string, resumeTitle?: string) {
    const randomTitle = generateRandomName();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const title = resumeTitle || randomTitle;

    return this.prisma.resume.create({
      data: {
        userId,
        visibility: "private",
        data: defaultResumeData,
        title: title,
        slug: slugify(title),
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.resume.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  }

  findOne(id: string, userId?: string) {
    if (userId) {
      return this.prisma.resume.findUniqueOrThrow({ where: { userId_id: { userId, id } } });
    }

    return this.prisma.resume.findUniqueOrThrow({ where: { id } });
  }

  async findOneStatistics(id: string) {
    const result = await this.prisma.statistics.findFirst({
      select: { views: true, downloads: true },
      where: { resumeId: id },
    });

    return {
      views: result?.views ?? 0,
      downloads: result?.downloads ?? 0,
    };
  }

  async findOneByUsernameSlug(username: string, slug: string, userId?: string) {
    const resume = await this.prisma.resume.findFirstOrThrow({
      where: { user: { username }, slug, visibility: "public" },
    });

    // Update statistics: increment the number of views by 1
    if (!userId) {
      await this.prisma.statistics.upsert({
        where: { resumeId: resume.id },
        create: { views: 1, downloads: 0, resumeId: resume.id },
        update: { views: { increment: 1 } },
      });
    }

    return resume;
  }

  async update(userId: string, id: string, updateResumeDto: UpdateResumeDto) {
    try {
      const { locked } = await this.prisma.resume.findUniqueOrThrow({
        where: { id },
        select: { locked: true },
      });

      if (locked) throw new BadRequestException(ERROR_MESSAGE.ResumeLocked);
      if (!updateResumeDto.data && !updateResumeDto.title)
        throw new BadRequestException("Invalid data");

      return await this.prisma.resume.update({
        data: {
          title: updateResumeDto.title,
          slug: updateResumeDto.slug,
          visibility: updateResumeDto.visibility,
          data: updateResumeDto.data,
        },
        where: { userId_id: { userId, id } },
      });
    } catch (error) {
      if (error.code === "P2025") {
        Logger.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  lock(userId: string, id: string, set: boolean) {
    return this.prisma.resume.update({
      data: { locked: set },
      where: { userId_id: { userId, id } },
    });
  }

  async remove(userId: string, id: string) {
    await Promise.all([
      // Remove files in storage, and their cached keys
      this.storageService.deleteObject(userId, "resumes", id),
      this.storageService.deleteObject(userId, "previews", id),
    ]);

    return this.prisma.resume.delete({ where: { userId_id: { userId, id } } });
  }

  async findOnePublicByUsername(username: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });

    if (user.profileResumeId == null) throw new BadRequestException(ERROR_MESSAGE.NOPUBLICRESUME);

    return await this.prisma.resume.findUniqueOrThrow({
      where: { id: user.profileResumeId },
    });
  }

  async printResume(resume: ResumeDto, userId?: string) {
    const url = await this.printerService.printResume(resume);

    // Update statistics: increment the number of downloads by 1
    if (!userId) {
      await this.prisma.statistics.upsert({
        where: { resumeId: resume.id },
        create: { views: 0, downloads: 1, resumeId: resume.id },
        update: { downloads: { increment: 1 } },
      });
    }

    return url;
  }

  printPreview(resume: ResumeDto) {
    return this.printerService.printPreview(resume);
  }

  async setDefault(userId: string, resumeId: string | null, setDefaultProfile: boolean) {
    return await (setDefaultProfile
      ? this.prisma.user.update({
          where: { id: userId },
          data: { profileResumeId: resumeId },
        })
      : this.prisma.user.update({
          where: { id: userId },
          data: { profileResumeId: null },
        }));
  }
}
