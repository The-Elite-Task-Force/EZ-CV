import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import {
  CreateSectionItemDto,
  CreateSectionMappingDto,
  DeleteMappingDto,
  LinkedInBasics,
  LinkedInCertification,
  LinkedInEducation,
  LinkedInImportSections,
  LinkedInLanguage,
  LinkedInProject,
  LinkedInReference,
  LinkedInSkill,
  LinkedInWork,
  ResumeDto,
  SECTION_FORMAT,
  SectionMappingDto,
  UpdateSectionItemDto,
} from "@reactive-resume/dto";
import {
  defaultBasics,
  defaultCertification,
  defaultEducation,
  defaultExperience,
  defaultLanguage,
  defaultProject,
  defaultReference,
  defaultSkill,
} from "@reactive-resume/schema";
import { PrismaService } from "nestjs-prisma";

import { ResumeService } from "../resume/resume.service";
import {
  parseAwardData,
  parseBasicData,
  parseCertificationData,
  parseCustomData,
  parseEducationData,
  parseExperienceData,
  parseInterestData,
  parseLanguageData,
  parseProfileData,
  parseProjectData,
  parsePublicationData,
  parseReferenceData,
  parseSkillData,
  parseSummaryData,
  parseVolunteerData,
} from "../utils/section-parsers";

@Injectable()
export class SectionItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeService,
  ) {}

  async findAll(userId: string) {
    try {
      const basics = await this.prisma.basicsItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const summary = await this.prisma.summaryItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const profiles = await this.prisma.profileItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const experience = await this.prisma.workItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const education = await this.prisma.educationItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const skills = await this.prisma.skillItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const languages = await this.prisma.languageItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const awards = await this.prisma.awardItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const certifications = await this.prisma.certificationItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const interests = await this.prisma.interestItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const projects = await this.prisma.projectItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const publications = await this.prisma.publicationItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const volunteer = await this.prisma.volunteerItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const references = await this.prisma.referenceItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      const custom = await this.prisma.customItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      return {
        basics,
        profiles,
        summary,
        experience,
        education,
        skills,
        languages,
        awards,
        certifications,
        interests,
        projects,
        publications,
        volunteer,
        references,
        custom,
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createSectionItem(userId: string, createSectionDto: CreateSectionItemDto) {
    try {
      const { format, data, resumeId } = createSectionDto;

      let createdItem;
      switch (format) {
        case SECTION_FORMAT.Basics: {
          const parsedData = parseBasicData(data);
          createdItem = await this.prisma.basicsItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resume.update({
              where: { id: resumeId },
              data: { basicsItemId: createdItem.id },
            });
          }
          break;
        }
        case SECTION_FORMAT.Profiles: {
          const parsedData = parseProfileData(data);
          createdItem = await this.prisma.profileItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeProfileItemMapping.create({
              data: {
                resumeId,
                profileItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Experience: {
          const parsedData = parseExperienceData(data);
          createdItem = await this.prisma.workItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeWorkItemMapping.create({
              data: {
                resumeId,
                workItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Education: {
          const parsedData = parseEducationData(data);
          createdItem = await this.prisma.educationItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeEducationItemMapping.create({
              data: {
                resumeId,
                educationItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Skills: {
          const parsedData = parseSkillData(data);
          createdItem = await this.prisma.skillItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeSkillItemMapping.create({
              data: {
                resumeId,
                skillItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Languages: {
          const parsedData = parseLanguageData(data);
          createdItem = await this.prisma.languageItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeLanguageItemMapping.create({
              data: {
                resumeId,
                languageItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Awards: {
          const parsedData = parseAwardData(data);
          createdItem = await this.prisma.awardItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeAwardItemMapping.create({
              data: {
                resumeId,
                awardItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Certifications: {
          const parsedData = parseCertificationData(data);
          createdItem = await this.prisma.certificationItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeCertificationItemMapping.create({
              data: {
                resumeId,
                certificationItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Interests: {
          const parsedData = parseInterestData(data);
          createdItem = await this.prisma.interestItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeInterestItemMapping.create({
              data: {
                resumeId,
                interestItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Projects: {
          const parsedData = parseProjectData(data);
          createdItem = await this.prisma.projectItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeProjectItemMapping.create({
              data: {
                resumeId,
                projectItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Publications: {
          const parsedData = parsePublicationData(data);
          createdItem = await this.prisma.publicationItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumePublicationItemMapping.create({
              data: {
                resumeId,
                publicationItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Volunteering: {
          const parsedData = parseVolunteerData(data);
          createdItem = await this.prisma.volunteerItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeVolunteerItemMapping.create({
              data: {
                resumeId,
                volunteerItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.References: {
          const parsedData = parseReferenceData(data);
          createdItem = await this.prisma.referenceItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeReferenceItemMapping.create({
              data: {
                resumeId,
                referenceItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Summary: {
          const parsedData = parseSummaryData(data);
          createdItem = await this.prisma.summaryItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeSummaryItemMapping.create({
              data: {
                resumeId,
                summaryItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        case SECTION_FORMAT.Custom: {
          const parsedData = parseCustomData(data);
          createdItem = await this.prisma.customItem.create({
            data: {
              ...parsedData,
              userId: userId,
            },
          });
          if (resumeId) {
            await this.prisma.resumeCustomItemMapping.create({
              data: {
                resumeId,
                customItemId: createdItem.id,
                order: 0, // Set the order as needed
              },
            });
          }
          break;
        }
        default: {
          throw new Error("Invalid section type");
        }
      }
      return { format: format, data: createdItem };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateSectionItem(userId: string, id: string, updateSectionDto: UpdateSectionItemDto) {
    const { data, format } = updateSectionDto;
    if (!data || !format) {
      throw new Error("Data is required");
    }
    try {
      switch (format) {
        case SECTION_FORMAT.Basics: {
          const parsedData = parseBasicData(data);
          return await this.prisma.basicsItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Profiles: {
          const parsedData = parseProfileData(data);
          return await this.prisma.profileItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Experience: {
          const parsedData = parseExperienceData(data);
          return await this.prisma.workItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Education: {
          const parsedData = parseEducationData(data);
          return await this.prisma.educationItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Skills: {
          const parsedData = parseSkillData(data);
          return await this.prisma.skillItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Languages: {
          const parsedData = parseLanguageData(data);
          return await this.prisma.languageItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Awards: {
          const parsedData = parseAwardData(data);
          return await this.prisma.awardItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Certifications: {
          const parsedData = parseCertificationData(data);
          return await this.prisma.certificationItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Interests: {
          const parsedData = parseInterestData(data);
          return await this.prisma.interestItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Projects: {
          const parsedData = parseProjectData(data);
          return await this.prisma.projectItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Publications: {
          const parsedData = parsePublicationData(data);
          return await this.prisma.publicationItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Volunteering: {
          const parsedData = parseVolunteerData(data);
          return await this.prisma.volunteerItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.References: {
          const parsedData = parseReferenceData(data);
          return await this.prisma.referenceItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        case SECTION_FORMAT.Summary: {
          const parsedData = parseSummaryData(data);
          return await this.prisma.summaryItem.update({
            data: parsedData,
            where: { id: id },
          });
        }
        case SECTION_FORMAT.Custom: {
          const parsedData = parseCustomData(data);
          return await this.prisma.customItem.update({
            data: parsedData,
            where: { id: id },
          });
        }

        default: {
          throw new Error("Invalid section type");
        }
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteSectionItem(userId: string, format: SECTION_FORMAT, id: string) {
    try {
      switch (format) {
        case SECTION_FORMAT.Basics: {
          return await this.prisma.basicsItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Profiles: {
          return await this.prisma.profileItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Experience: {
          return await this.prisma.workItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Education: {
          return await this.prisma.educationItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Skills: {
          return await this.prisma.skillItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Languages: {
          return await this.prisma.languageItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Awards: {
          return await this.prisma.awardItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Certifications: {
          return await this.prisma.certificationItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Interests: {
          return await this.prisma.interestItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Projects: {
          return await this.prisma.projectItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Publications: {
          return await this.prisma.publicationItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Volunteering: {
          return await this.prisma.volunteerItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.References: {
          return await this.prisma.referenceItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Summary: {
          return await this.prisma.summaryItem.delete({ where: { id, userId } });
        }
        case SECTION_FORMAT.Custom: {
          return await this.prisma.customItem.delete({ where: { id, userId } });
        }
        default: {
          throw new Error("Invalid section type");
        }
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getMappings(resumeId: string) {
    try {
      const result: SectionMappingDto = new SectionMappingDto();

      const summary = await this.prisma.resumeSummaryItemMapping.findMany({ where: { resumeId } });
      result.summary = summary.map((t) => t.summaryItemId);

      const experience = await this.prisma.resumeWorkItemMapping.findMany({ where: { resumeId } });
      result.experience = experience.map((t) => t.workItemId);

      const education = await this.prisma.resumeEducationItemMapping.findMany({
        where: { resumeId },
      });
      result.education = education.map((t) => t.educationItemId);

      const skills = await this.prisma.resumeSkillItemMapping.findMany({ where: { resumeId } });
      result.skills = skills.map((t) => t.skillItemId);

      const languages = await this.prisma.resumeLanguageItemMapping.findMany({
        where: { resumeId },
      });
      result.languages = languages.map((t) => t.languageItemId);

      const awards = await this.prisma.resumeAwardItemMapping.findMany({ where: { resumeId } });
      result.awards = awards.map((t) => t.awardItemId);

      const certifications = await this.prisma.resumeCertificationItemMapping.findMany({
        where: { resumeId },
      });
      result.certifications = certifications.map((t) => t.certificationItemId);

      const interests = await this.prisma.resumeInterestItemMapping.findMany({
        where: { resumeId },
      });
      result.interests = interests.map((t) => t.interestItemId);

      const projects = await this.prisma.resumeProjectItemMapping.findMany({ where: { resumeId } });
      result.projects = projects.map((t) => t.projectItemId);

      const profiles = await this.prisma.resumeProfileItemMapping.findMany({ where: { resumeId } });
      result.profiles = profiles.map((t) => t.profileItemId);

      const publications = await this.prisma.resumePublicationItemMapping.findMany({
        where: { resumeId },
      });
      result.publications = publications.map((t) => t.publicationItemId);

      const volunteer = await this.prisma.resumeVolunteerItemMapping.findMany({
        where: { resumeId },
      });
      result.volunteer = volunteer.map((t) => t.volunteerItemId);

      const references = await this.prisma.resumeReferenceItemMapping.findMany({
        where: { resumeId },
      });
      result.references = references.map((t) => t.referenceItemId);

      const custom = await this.prisma.resumeCustomItemMapping.findMany({ where: { resumeId } });
      result.custom = custom.map((t) => t.customItemId);

      return result;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createMapping(data: CreateSectionMappingDto) {
    try {
      switch (data.format) {
        case "basics": {
          await this.prisma.resume.update({
            where: { id: data.resumeId },
            data: { basicsItemId: data.itemId },
          });
          return { resumeId: data.resumeId, itemId: data.itemId, format: data.format };
        }
        case "summary": {
          const item = await this.prisma.resumeSummaryItemMapping.create({
            data: { resumeId: data.resumeId, summaryItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.summaryItemId, format: data.format };
        }
        case "profiles": {
          const item = await this.prisma.resumeProfileItemMapping.create({
            data: { resumeId: data.resumeId, profileItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.profileItemId, format: data.format };
        }
        case "experience": {
          const item = await this.prisma.resumeWorkItemMapping.create({
            data: { resumeId: data.resumeId, workItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.workItemId, format: data.format };
        }
        case "education": {
          const item = await this.prisma.resumeEducationItemMapping.create({
            data: { resumeId: data.resumeId, educationItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.educationItemId, format: data.format };
        }
        case "skills": {
          const item = await this.prisma.resumeSkillItemMapping.create({
            data: { resumeId: data.resumeId, skillItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.skillItemId, format: data.format };
        }
        case "languages": {
          const item = await this.prisma.resumeLanguageItemMapping.create({
            data: { resumeId: data.resumeId, languageItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.languageItemId, format: data.format };
        }
        case "awards": {
          const item = await this.prisma.resumeAwardItemMapping.create({
            data: { resumeId: data.resumeId, awardItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.awardItemId, format: data.format };
        }
        case "certifications": {
          const item = await this.prisma.resumeCertificationItemMapping.create({
            data: { resumeId: data.resumeId, certificationItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.certificationItemId, format: data.format };
        }
        case "interests": {
          const item = await this.prisma.resumeInterestItemMapping.create({
            data: { resumeId: data.resumeId, interestItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.interestItemId, format: data.format };
        }
        case "projects": {
          const item = await this.prisma.resumeProjectItemMapping.create({
            data: { resumeId: data.resumeId, projectItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.projectItemId, format: data.format };
        }
        case "publications": {
          const item = await this.prisma.resumePublicationItemMapping.create({
            data: { resumeId: data.resumeId, publicationItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.publicationItemId, format: data.format };
        }
        case "volunteer": {
          const item = await this.prisma.resumeVolunteerItemMapping.create({
            data: { resumeId: data.resumeId, volunteerItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.volunteerItemId, format: data.format };
        }
        case "references": {
          const item = await this.prisma.resumeReferenceItemMapping.create({
            data: { resumeId: data.resumeId, referenceItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.referenceItemId, format: data.format };
        }
        case "custom": {
          const item = await this.prisma.resumeCustomItemMapping.create({
            data: { resumeId: data.resumeId, customItemId: data.itemId, order: 0 },
          });
          return { resumeId: item.resumeId, itemId: item.customItemId, format: data.format };
        }
        default: {
          throw new InternalServerErrorException(`Unknown format for ${data.format}`);
        }
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteMapping(data: DeleteMappingDto) {
    try {
      switch (data.format) {
        case "basics": {
          await this.prisma.resume.update({
            where: {
              id: data.resumeId,
              basicsItemId: data.id,
            },
            data: {
              basicsItemId: null,
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Basics };
        }
        case "summary": {
          await this.prisma.resumeSummaryItemMapping.delete({
            where: {
              resumeId_summaryItemId: {
                resumeId: data.resumeId,
                summaryItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Summary };
        }
        case "profiles": {
          await this.prisma.resumeProfileItemMapping.delete({
            where: {
              resumeId_profileItemId: {
                resumeId: data.resumeId,
                profileItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Profiles };
        }
        case "experience": {
          await this.prisma.resumeWorkItemMapping.delete({
            where: {
              resumeId_workItemId: {
                resumeId: data.resumeId,
                workItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Experience };
        }
        case "education": {
          await this.prisma.resumeEducationItemMapping.delete({
            where: {
              resumeId_educationItemId: {
                resumeId: data.resumeId,
                educationItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Education };
        }
        case "skills": {
          await this.prisma.resumeSkillItemMapping.delete({
            where: {
              resumeId_skillItemId: {
                resumeId: data.resumeId,
                skillItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Skills };
        }
        case "languages": {
          await this.prisma.resumeLanguageItemMapping.delete({
            where: {
              resumeId_languageItemId: {
                resumeId: data.resumeId,
                languageItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Languages };
        }
        case "awards": {
          await this.prisma.resumeAwardItemMapping.delete({
            where: {
              resumeId_awardItemId: {
                resumeId: data.resumeId,
                awardItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Awards };
        }
        case "certifications": {
          await this.prisma.resumeCertificationItemMapping.delete({
            where: {
              resumeId_certificationItemId: {
                resumeId: data.resumeId,
                certificationItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Certifications };
        }
        case "interests": {
          await this.prisma.resumeInterestItemMapping.delete({
            where: {
              resumeId_interestItemId: {
                resumeId: data.resumeId,
                interestItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Interests };
        }
        case "projects": {
          await this.prisma.resumeProjectItemMapping.delete({
            where: {
              resumeId_projectItemId: {
                resumeId: data.resumeId,
                projectItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Projects };
        }
        case "publications": {
          await this.prisma.resumePublicationItemMapping.delete({
            where: {
              resumeId_publicationItemId: {
                resumeId: data.resumeId,
                publicationItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Publications };
        }
        case "volunteer": {
          await this.prisma.resumeVolunteerItemMapping.delete({
            where: {
              resumeId_volunteerItemId: {
                resumeId: data.resumeId,
                volunteerItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Volunteering };
        }
        case "references": {
          await this.prisma.resumeReferenceItemMapping.delete({
            where: {
              resumeId_referenceItemId: {
                resumeId: data.resumeId,
                referenceItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.References };
        }
        case "custom": {
          await this.prisma.resumeCustomItemMapping.delete({
            where: {
              resumeId_customItemId: {
                resumeId: data.resumeId,
                customItemId: data.id,
              },
            },
          });
          return { resumeId: data.resumeId, format: SECTION_FORMAT.Custom };
        }
        default: {
          throw new InternalServerErrorException(`Unknown format for ${data.format}`);
        }
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async import(
    userId: string,
    sections: LinkedInImportSections,
    createResume: boolean,
    resumeTitle?: string,
  ): Promise<{ message: string; insertedData: LinkedInImportSections }> {
    try {
      const insertedData: LinkedInImportSections = {};
      let resume: ResumeDto | null = null;

      if (createResume) {
        resume = (await this.resumeService.createEmptyResume(
          userId,
          resumeTitle,
        )) as unknown as ResumeDto;
      }

      const insertItems = async <T>(
        items: Partial<T>[],
        model: keyof PrismaClient,
        defaultValues: Partial<T>,
        section: SECTION_FORMAT,
      ): Promise<T[]> => {
        const prismaModel = this.prisma[model] as PrismaClient[keyof PrismaClient] & {
          create: (args: unknown) => Promise<T>;
        };
        return Promise.all(
          items.map(async (item, index) => {
            const createdItem = (await prismaModel.create({
              data: {
                ...defaultValues,
                ...item,
                userId,
              },
            })) as T & { id: string };

            if (createResume && resume) {
              await this.createMapping({
                format: section,
                resumeId: resume.id,
                itemId: createdItem.id,
              });
            }

            return createdItem;
          }),
        ) as Promise<T[]>;
      };

      // Basics
      if (sections.basics) {
        insertedData.basics = await insertItems<LinkedInBasics>(
          sections.basics,
          "basicsItem",
          defaultBasics,
          SECTION_FORMAT.Basics,
        );
      }

      // Skills
      if (sections.skills) {
        insertedData.skills = await insertItems<LinkedInSkill>(
          sections.skills,
          "skillItem",
          defaultSkill,
          SECTION_FORMAT.Skills,
        );
      }

      // Work
      if (sections.work) {
        insertedData.work = await insertItems<LinkedInWork>(
          sections.work,
          "workItem",
          defaultExperience,
          SECTION_FORMAT.Experience,
        );
      }

      // Projects
      if (sections.projects) {
        insertedData.projects = await insertItems<LinkedInProject>(
          sections.projects,
          "projectItem",
          defaultProject,
          SECTION_FORMAT.Projects,
        );
      }

      // Education
      if (sections.education) {
        insertedData.education = await insertItems<LinkedInEducation>(
          sections.education,
          "educationItem",
          defaultEducation,
          SECTION_FORMAT.Education,
        );
      }

      // Languages
      if (sections.languages) {
        insertedData.languages = await insertItems<LinkedInLanguage>(
          sections.languages,
          "languageItem",
          defaultLanguage,
          SECTION_FORMAT.Languages,
        );
      }

      // Certifications
      if (sections.certifications) {
        insertedData.certifications = await insertItems<LinkedInCertification>(
          sections.certifications,
          "certificationItem",
          defaultCertification,
          SECTION_FORMAT.Certifications,
        );
      }

      // References
      if (sections.references) {
        insertedData.references = await insertItems<LinkedInReference>(
          sections.references,
          "referenceItem",
          defaultReference,
          SECTION_FORMAT.References,
        );
      }

      return { message: "Import successful", insertedData };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
