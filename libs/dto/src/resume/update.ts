import { resumeDataSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";

import { resumeSchema } from "./resume";

export const updateResumeDataSchema = resumeDataSchema.extend({
  sections: resumeDataSchema.shape.sections.optional(),
});

export const updateResumeSchema = resumeSchema.extend({
  data: updateResumeDataSchema,
});

export class UpdateResumeDto extends createZodDto(updateResumeSchema.partial()) {}
