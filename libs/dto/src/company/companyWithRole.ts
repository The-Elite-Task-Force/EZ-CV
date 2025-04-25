import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { companySchema } from "./company";

const roleSchema = z
  .object({
    id: z.number(), // or z.string() if that's the case
    name: z.string(),
    updatedAt: z.preprocess(
      (arg) => (arg instanceof Date ? arg : new Date(arg as string | number)),
      z.date(),
    ),
  })
  .nullable();

export const companyWithRoleSchema = companySchema.extend({
  role: roleSchema,
});

export class CompanyWithRoleDto extends createZodDto(companyWithRoleSchema) {}
