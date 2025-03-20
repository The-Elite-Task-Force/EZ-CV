import { ResumeData } from "@reactive-resume/schema";
import { z } from "zod";

const dateSchema = z
  .object({ start: z.string().optional(), end: z.string().optional() })
  .optional();

const profileSchema = z.object({
  id: z.string().optional(),
  url: z.string().optional(),
  network: z.string().optional(),
  username: z.string().optional(),
});

const basicsSchema = z.object({
  name: z.string().optional(),
  email: z.literal("").or(z.string().email()),
  phone: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  birthdate: z.string().optional(),
  website: z.string().optional(),
  profiles: z.array(profileSchema).optional(),
  location: z.string().optional(),
  photo: z.object({
    visible: z.boolean(),
    url: z.string().optional(),
    filters: z.object({
      shape: z.string().nullable().optional(),
      size: z.coerce.number(),
      border: z.boolean(),
      grayscale: z.boolean(),
    }),
  }),
});

const sectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["basic", "work", "custom"]),
  columns: z.coerce.number().or(z.null()).default(1),
  visible: z.boolean(),
});

const workSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    date: z.string().optional(),
    name: z.string().optional(),
    position: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const awardSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    date: z.string().optional(),
    title: z.string().optional(),
    awarder: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const skillSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    level: z.number().optional(),
    keywords: z.array(z.string().nullable()).optional(),
  })
  .nullable();

const projectSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    date: z.string().optional(),
    name: z.string().optional(),
    summary: z.string().nullable().optional(),
    keywords: z.array(z.string().nullable()).optional(),
    description: z.string().optional(),
  })
  .nullable();

const educationSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    area: z.string().optional(),
    date: z.string().optional(),
    score: z.string().optional(),
    degree: z.string().optional(),
    courses: z.array(z.string().nullable()).optional(),
    summary: z.string().nullable().optional(),
    institution: z.string().optional(),
  })
  .nullable();

const interestSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    keywords: z.array(z.string().nullable()).optional(),
  })
  .nullable();

const languageSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    level: z.number().optional(),
  })
  .nullable();

const volunteerSchema = z
  .object({
    id: z.string().optional(),
    organization: z.string().optional(),
    position: z.string().optional(),
    date: z.string().optional(),
    url: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const referenceSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    summary: z.string().nullable().optional(),
    relationship: z.string().optional(),
  })
  .nullable();

const publicationSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    date: z.string().optional(),
    name: z.string().optional(),
    publisher: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const certificationSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    date: z.string().optional(),
    name: z.string().optional(),
    issuer: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

export const linkedInImportSectionsSchema = z.object({
  basics: z.array(basicsSchema).optional(),
  work: z.array(workSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
  education: z.array(educationSchema).optional(),
  languages: z.array(languageSchema).optional(),
  certifications: z.array(certificationSchema).optional(),

  // These are not currently included in the LinkedIn zip file, but it needs to be double checked before deleted

  // awards: awardSchema.optional(),
  // interests: interestSchema.optional(),
  // volunteer: volunteerSchema.optional(),
  // references: referenceSchema.optional(),
  // publications: publicationSchema.optional(),
  // certifications: sectionSchema
  //   .extend({
  //     items: z.array(certificationSchema),
  //   })
  //   .optional(),
});

export type LinkedInImportSections = z.infer<typeof linkedInImportSectionsSchema>;

export const transformLinkedInData = (data: /* ResumeData */ any): LinkedInImportSections => {
  const transformedData: LinkedInImportSections = {
    basics: data.sections.basics?.items,
    work: data.sections.experience?.items,
    skills: data.sections.skills?.items,
    projects: data.sections.projects?.items,
    education: data.sections.education?.items,
    languages: data.sections.languages?.items,
    certifications: data.sections.certifications?.items,
  };

  return transformedData;
};
