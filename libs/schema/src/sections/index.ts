import { z } from "zod";

import { basicsSchema } from "../basics";
import type { FilterKeys } from "../shared";
import { idSchema } from "../shared";
import { awardSchema } from "./award";
import { certificationSchema } from "./certification";
import { customSectionSchema } from "./custom-section";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";
import { interestSchema } from "./interest";
import { languageSchema } from "./language";
import { profileSchema } from "./profile";
import { projectSchema } from "./project";
import { publicationSchema } from "./publication";
import { referenceSchema } from "./reference";
import { skillSchema } from "./skill";
import { summarySchema } from "./summary";
import { volunteerSchema } from "./volunteer";

// Schema
export const sectionSchema = z.object({
  name: z.string(),
  columns: z.number().min(1).max(5).default(1),
  separateLinks: z.boolean().default(true),
});

const sectionDataSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// Example: Combine `sectionSchema` with `sectionDataSchema`
export const sectionSchemaWithData = sectionSchema.extend({
  data: sectionDataSchema,
  format: z.enum([
    "Basics",
    "Profiles",
    "Experience",
    "Education",
    "Skills",
    "Languages",
    "Awards",
    "Certifications",
    "Interests",
    "Projects",
    "Publications",
    "Volunteering",
    "References",
    "Custom",
  ]),
});
// Schema
export const customSchema = sectionSchema.extend({
  id: idSchema,
  items: z.array(customSectionSchema),
});

export const sectionsSchema = z.object({
  basics: sectionSchema.extend({
    id: z.literal("basics"),
    items: z.array(basicsSchema),
  }),
  summary: sectionSchema.extend({
    id: z.literal("summary"),
    items: z.array(summarySchema),
  }),
  awards: sectionSchema.extend({
    id: z.literal("awards"),
    items: z.array(awardSchema),
  }),
  certifications: sectionSchema.extend({
    id: z.literal("certifications"),
    items: z.array(certificationSchema),
  }),
  education: sectionSchema.extend({
    id: z.literal("education"),
    items: z.array(educationSchema),
  }),
  experience: sectionSchema.extend({
    id: z.literal("experience"),
    items: z.array(experienceSchema),
  }),
  volunteer: sectionSchema.extend({
    id: z.literal("volunteer"),
    items: z.array(volunteerSchema),
  }),
  interests: sectionSchema.extend({
    id: z.literal("interests"),
    items: z.array(interestSchema),
  }),
  languages: sectionSchema.extend({
    id: z.literal("languages"),
    items: z.array(languageSchema),
  }),
  profiles: sectionSchema.extend({
    id: z.literal("profiles"),
    items: z.array(profileSchema),
  }),
  projects: sectionSchema.extend({
    id: z.literal("projects"),
    items: z.array(projectSchema),
  }),
  publications: sectionSchema.extend({
    id: z.literal("publications"),
    items: z.array(publicationSchema),
  }),
  references: sectionSchema.extend({
    id: z.literal("references"),
    items: z.array(referenceSchema),
  }),
  skills: sectionSchema.extend({
    id: z.literal("skills"),
    items: z.array(skillSchema),
  }),
  //OBS: FIX CUSTOM,
  //custom: z.record(z.string(), customSchema),
});

// Detailed Types
export type Section = z.infer<typeof sectionSchema>;
export type Sections = z.infer<typeof sectionsSchema>;

export type SectionKey = "basics" | keyof Sections | `custom.${string}`;

export type SectionWithItem<T = unknown> = Sections[FilterKeys<Sections, { items: T[] }>];
export type SectionItem = SectionWithItem["items"][number];
export type CustomSectionGroup = z.infer<typeof customSchema>;

// Defaults
export const defaultSection: Section = {
  name: "",
  columns: 1,
  separateLinks: true,
};

export const defaultSections: Sections = {
  basics: { ...defaultSection, id: "basics", name: "Basics", items: [] },
  summary: { ...defaultSection, id: "summary", name: "Summary", items: [] },
  awards: { ...defaultSection, id: "awards", name: "Awards", items: [] },
  certifications: { ...defaultSection, id: "certifications", name: "Certifications", items: [] },
  education: { ...defaultSection, id: "education", name: "Education", items: [] },
  experience: { ...defaultSection, id: "experience", name: "Experience", items: [] },
  volunteer: { ...defaultSection, id: "volunteer", name: "Volunteering", items: [] },
  interests: { ...defaultSection, id: "interests", name: "Interests", items: [] },
  languages: { ...defaultSection, id: "languages", name: "Languages", items: [] },
  profiles: { ...defaultSection, id: "profiles", name: "Profiles", items: [] },
  projects: { ...defaultSection, id: "projects", name: "Projects", items: [] },
  publications: { ...defaultSection, id: "publications", name: "Publications", items: [] },
  references: { ...defaultSection, id: "references", name: "References", items: [] },
  skills: { ...defaultSection, id: "skills", name: "Skills", items: [] },
  //OBS: FIX CUSTOM,
  //custom: {},
};

export type SectionItemKeys =
  | keyof z.infer<typeof basicsSchema>
  | keyof z.infer<typeof summarySchema>
  | keyof z.infer<typeof awardSchema>
  | keyof z.infer<typeof certificationSchema>
  | keyof z.infer<typeof educationSchema>
  | keyof z.infer<typeof experienceSchema>
  | keyof z.infer<typeof volunteerSchema>
  | keyof z.infer<typeof interestSchema>
  | keyof z.infer<typeof languageSchema>
  | keyof z.infer<typeof profileSchema>
  | keyof z.infer<typeof projectSchema>
  | keyof z.infer<typeof publicationSchema>
  | keyof z.infer<typeof referenceSchema>
  | keyof z.infer<typeof skillSchema>;

export * from "./award";
export * from "./certification";
export * from "./custom-section";
export * from "./education";
export * from "./experience";
export * from "./interest";
export * from "./language";
export * from "./profile";
export * from "./project";
export * from "./publication";
export * from "./reference";
export * from "./skill";
export * from "./summary";
export * from "./volunteer";
