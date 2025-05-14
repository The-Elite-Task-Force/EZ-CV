import { idSchema } from "@reactive-resume/schema";
import { dateSchema } from "@reactive-resume/utils";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const projectSchema = z.object({
  id: idSchema,
  name: z.string(),
  description: z.string().nullable(),
  userId: idSchema,
  companyId: idSchema,
  updatedAt: dateSchema,
});

export class ProjectDto extends createZodDto(projectSchema) {}
