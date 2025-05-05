import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { resumeSchema } from "./resume";

export const variantSchema = resumeSchema.extend({
  creatorId: z.string().optional(),
  resumeId: z.string(),
});

export class VariantDto extends createZodDto(variantSchema) {}
