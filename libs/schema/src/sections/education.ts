import { z } from "zod";

import { defaultItem, defaultUrl, itemSchema, urlSchema } from "../shared";

// Schema
export const educationSchema = itemSchema.extend({
  institution: z.string().min(1),
  studyType: z.string(),
  area: z.string(),
  score: z.string(),
  date: z.string(),
  summary: z.string(),
  url: urlSchema,
  degree: z.string(),
  courses: z.record(z.string(), z.any()),
});

// Type
export type Education = z.infer<typeof educationSchema>;

// Defaults
export const defaultEducation: Education = {
  ...defaultItem,
  institution: "",
  studyType: "",
  area: "",
  score: "",
  date: "",
  summary: "",
  url: defaultUrl,
  degree: "",
  courses: {},
};
