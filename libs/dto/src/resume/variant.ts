import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { resumeSchema } from "./resume";

export const variantSchema = resumeSchema.extend({
  creatorId: z.string().optional(),
  resumeId: z.string(),
});

export const createVariantSchema = z.object({
  resumeId: z.string(),
  userId: z.string(),
  creatorId: z.string().optional(),
});

export const updateVariantSchema = variantSchema.partial();

export const deleteVariantSchema = z.object({
  id: z.string(),
});

export class UpdateVariantDto extends createZodDto(updateVariantSchema) {}
export class VariantDto extends createZodDto(variantSchema) {}
export class CreateVariantDto extends createZodDto(createVariantSchema) {}
