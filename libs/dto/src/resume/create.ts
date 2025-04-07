import { createId } from "@paralleldrive/cuid2";
import { languageEnum } from "@reactive-resume/utils";
import slugify from "@sindresorhus/slugify";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .transform((value) => {
      const slug = slugify(value);
      if (!slug) return createId();
      return slug;
    })
    .optional(),
  visibility: z.enum(["public", "private"]).default("private"),
  language: languageEnum.default("en-US"),
});

export class CreateResumeDto extends createZodDto(createResumeSchema) {}
