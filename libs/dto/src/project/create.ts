import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
});

export class CreateProjectDto extends createZodDto(createProjectSchema){}
