import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const sectionMappingSchema = z.object({
  basics: z.array(z.string()),
  summary: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  awards: z.array(z.string()),
  certifications: z.array(z.string()),
  interests: z.array(z.string()),
  projects: z.array(z.string()),
  profiles: z.array(z.string()),
  publications: z.array(z.string()),
  volunteer: z.array(z.string()),
  references: z.array(z.string()),
  // OBS: FIX
  //custom: z.array(z.string()),
});

export class SectionMappingDto extends createZodDto(sectionMappingSchema) {}

export const sectionMappingItemSchema = z.object({
  itemId: idSchema,
  resumeId: idSchema,
});

export class SectionMappingItemDto extends createZodDto(sectionMappingItemSchema) {}
