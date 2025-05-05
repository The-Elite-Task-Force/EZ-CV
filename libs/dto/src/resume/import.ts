import { createId } from "@paralleldrive/cuid2";
import { resumeDataSchema } from "@reactive-resume/schema";
import { idSchema } from "@reactive-resume/schema";
import { languageEnum } from "@reactive-resume/utils";
import slugify from "@sindresorhus/slugify";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";
export const importResumeSchema = z.object({
  title: z.string().optional(),
  id: idSchema.optional(),
  slug: z
    .string()
    .min(1)
    .transform((value) => {
      const slug = slugify(value);
      if (slug === "") return createId();
      return slug;
    })
    .optional(),
  visibility: z.enum(["public", "private"]).default("private").optional(),
  data: resumeDataSchema,
  language: languageEnum.default("en-US").optional(),
});

export class ImportResumeDto extends createZodDto(importResumeSchema) {}
