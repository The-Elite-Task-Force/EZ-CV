import type { ProjectDto, ResumeDto } from "@reactive-resume/dto";
import type { SectionItemKeys } from "@reactive-resume/schema";

export const sectionItemFilterKeys: SectionItemKeys[] = [
  "title",
  "name",
  "description",
  "institution",
  "network",
  "username",
  "company",
  "position",
  "issuer",
  "awarder",
  "publisher",
  "organization",
];

export const resumeFilterKeys: (keyof ResumeDto)[] = ["title", "slug"];

export const projectFilterKeys: (keyof ProjectDto)[] = ["name"];
