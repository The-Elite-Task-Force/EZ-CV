import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { resumeSchema } from "./resume";

export const variantSchema = resumeSchema.extend({
  creatorId: z.string().optional(),
  resumeId: z.string(),
});

export const duplicateAsVariantSchema = z.object({
  resumeId: z.string(),
  userId: z.string(),
  title: z.string(),
  slug: z.string(),
  creatorId: z.string().optional(),
});

export const updateVariantSchema = variantSchema.partial();

export const deleteVariantSchema = z.object({
  id: z.string(),
});

export class UpdateVariantDto extends createZodDto(updateVariantSchema) {}
export class DuplicateAsVariantDto extends createZodDto(duplicateAsVariantSchema) {}
export class VariantDto extends createZodDto(variantSchema) {}
