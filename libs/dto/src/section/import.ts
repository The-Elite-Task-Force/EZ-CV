import type { ResumeData } from "@reactive-resume/schema";
import { urlSchema } from "@reactive-resume/schema";
import { z } from "zod";

const linkedInProfileSchema = z.object({
  id: z.string().optional(),
  url: urlSchema,
  network: z.string().optional(),
  username: z.string().optional(),
});

const linkedInBasicsSchema = z.object({
  name: z.string().optional(),
  email: z.literal("").or(z.string().email()),
  phone: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  birthdate: z.string().optional(),
  website: z.string().optional(),
  profiles: z.array(linkedInProfileSchema).optional(),
  location: z.string().optional(),
  picture: z.object({
    url: z.string(),
    size: z.number().default(64),
    aspectRatio: z.number().default(1),
    borderRadius: z.number().default(0),
    effects: z.object({
      hidden: z.boolean().default(false),
      border: z.boolean().default(false),
      grayscale: z.boolean().default(false),
    }),
  }),
});

const linkedInSectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["basic", "work", "custom"]),
  columns: z.coerce.number().or(z.null()).default(1),
  visible: z.boolean(),
});

const linkedInWorkSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    name: z.string().optional(),
    position: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkedInAwardSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    title: z.string().optional(),
    awarder: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkedInSkillSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    level: z.number().optional(),
    keywords: z.array(z.string().nullable()).optional(),
  })
  .nullable();

const linkedInProjectSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    name: z.string().optional(),
    summary: z.string().nullable().optional(),
    keywords: z.array(z.string().nullable()).optional(),
    description: z.string().optional(),
  })
  .nullable();

const linkedInEducationSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    area: z.string().optional(),
    date: z.string().optional(),
    score: z.string().optional(),
    degree: z.string().optional(),
    courses: z.record(z.string(), z.any()).optional(),
    summary: z.string().nullable().optional(),
    institution: z.string().optional(),
  })
  .nullable();

const linkedInInterestSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    keywords: z.array(z.string().nullable()).optional(),
  })
  .nullable();

const linkedInLanguageSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    level: z.number().optional(),
  })
  .nullable();

const linkedInVolunteerSchema = z
  .object({
    id: z.string().optional(),
    organization: z.string().optional(),
    position: z.string().optional(),
    date: z.string().optional(),
    url: urlSchema,
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkedInReferenceSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    summary: z.string().nullable().optional(),
    relationship: z.string().optional(),
  })
  .nullable();

const linkedInPublicationSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    name: z.string().optional(),
    publisher: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkedInCertificationSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    name: z.string().optional(),
    issuer: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

export const linkedInImportSectionsSchema = z.object({
  basics: z.array(linkedInBasicsSchema).optional(),
  work: z.array(linkedInWorkSchema).optional(),
  skills: z.array(linkedInSkillSchema).optional(),
  projects: z.array(linkedInProjectSchema).optional(),
  education: z.array(linkedInEducationSchema).optional(),
  languages: z.array(linkedInLanguageSchema).optional(),
  certifications: z.array(linkedInCertificationSchema).optional(),
  references: z.array(linkedInReferenceSchema).optional(),

  // These are not currently included in the LinkedIn zip file, but it needs to be double checked before deleted

  // awards: awardSchema.optional(),
  // interests: interestSchema.optional(),
  // volunteer: volunteerSchema.optional(),
  // publications: publicationSchema.optional(),
  // certifications: sectionSchema
  //   .extend({
  //     items: z.array(certificationSchema),
  //   })
  //   .optional(),
});

export type LinkedInImportSections = z.infer<typeof linkedInImportSectionsSchema>;

export type LinkedInProfile = z.infer<typeof linkedInProfileSchema>;
export type LinkedInBasics = z.infer<typeof linkedInBasicsSchema>;
export type LinkedInSection = z.infer<typeof linkedInSectionSchema>;
export type LinkedInWork = z.infer<typeof linkedInWorkSchema>;
export type LinkedInAward = z.infer<typeof linkedInAwardSchema>;
export type LinkedInSkill = z.infer<typeof linkedInSkillSchema>;
export type LinkedInProject = z.infer<typeof linkedInProjectSchema>;
export type LinkedInEducation = z.infer<typeof linkedInEducationSchema>;
export type LinkedInInterest = z.infer<typeof linkedInInterestSchema>;
export type LinkedInLanguage = z.infer<typeof linkedInLanguageSchema>;
export type LinkedInVolunteer = z.infer<typeof linkedInVolunteerSchema>;
export type LinkedInReference = z.infer<typeof linkedInReferenceSchema>;
export type LinkedInPublication = z.infer<typeof linkedInPublicationSchema>;
export type LinkedInCertification = z.infer<typeof linkedInCertificationSchema>;

export const transformLinkedInData = (data: ResumeData): LinkedInImportSections => {
  const transformedData: LinkedInImportSections = {
    basics: data.sections.basics.items,
    work: data.sections.experience.items,
    skills: data.sections.skills.items,
    projects: data.sections.projects.items,
    education: data.sections.education.items,
    languages: data.sections.languages.items,
    certifications: data.sections.certifications.items,
    references: data.sections.references.items,
  };

  return transformedData;
};
