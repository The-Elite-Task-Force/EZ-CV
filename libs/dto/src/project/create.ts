import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  companyId: z.string(),
});

export class CreateProjectDto extends createZodDto(createProjectSchema){}
