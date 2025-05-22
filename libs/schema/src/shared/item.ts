import { dateSchema } from "@reactive-resume/utils";
import { z } from "zod";

import { idSchema } from "./id";

// Schema
export const itemSchema = z.object({
  id: idSchema,
  userId: z.string(),
  updatedAt: dateSchema,
  visible: z.boolean().default(true).optional(),
});

// Type
export type Item = z.infer<typeof itemSchema>;

// Defaults
export const defaultItem: Item = {
  id: "",
  userId: "",
  updatedAt: new Date(),
};
