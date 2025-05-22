import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { userSchema } from "../user";

export const createProjectMappingSchema = z.object({
  projectId: idSchema,
  userId: idSchema,
  resumeId: idSchema.optional(),
});

export const projectMappingSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  userId: idSchema,
  resumeId: idSchema.optional(),
  user: userSchema,
});

export class CreateProjectMappingDto extends createZodDto(createProjectMappingSchema) {}
export class ProjectMappingDto extends createZodDto(projectMappingSchema) {}
