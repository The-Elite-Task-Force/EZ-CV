import { defaultResumeData, idSchema, resumeDataSchema } from "@reactive-resume/schema";
import { dateSchema } from "@reactive-resume/utils";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { userSchema } from "../user";

export const sectionMappingSchema = z.object({
  sectionID: idSchema,
  resumeID: idSchema,
  order: z.number(),
});

export const resumeSchema = z.object({
  id: idSchema,
  title: z.string(),
  slug: z.string(),
  data: resumeDataSchema.default(defaultResumeData),
  visibility: z.enum(["private", "public"]).default("private"),
  locked: z.boolean().default(false),
  userId: idSchema,
  user: userSchema.optional(),
  sectionsMapping: z.array(sectionMappingSchema).optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export class ResumeDto extends createZodDto(resumeSchema) {}
