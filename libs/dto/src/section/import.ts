import { urlSchema } from "@reactive-resume/schema";
import { z } from "zod";

const linkInProfileSchema = z.object({
  id: z.string().optional(),
  url: urlSchema,
  network: z.string().optional(),
  username: z.string().optional(),
});

const linkInBasicsSchema = z.object({
  name: z.string().optional(),
  email: z.literal("").or(z.string().email()),
  phone: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  birthdate: z.string().optional(),
  website: z.string().optional(),
  profiles: z.array(linkInProfileSchema).optional(),
  location: z.string().optional(),
  photo: z.object({
    visible: z.boolean(),
    url: urlSchema,
    filters: z.object({
      shape: z.string().nullable().optional(),
      size: z.coerce.number(),
      border: z.boolean(),
      grayscale: z.boolean(),
    }),
  }),
});

const linkInSectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["basic", "work", "custom"]),
  columns: z.coerce.number().or(z.null()).default(1),
  visible: z.boolean(),
});

const linkInWorkSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    name: z.string().optional(),
    position: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkInAwardSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    title: z.string().optional(),
    awarder: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkInSkillSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    level: z.number().optional(),
    keywords: z.array(z.string().nullable()).optional(),
  })
  .nullable();

const linkInProjectSchema = z
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

const linkInEducationSchema = z
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

const linkInInterestSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    keywords: z.array(z.string().nullable()).optional(),
  })
  .nullable();

const linkInLanguageSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    level: z.number().optional(),
  })
  .nullable();

const linkInVolunteerSchema = z
  .object({
    id: z.string().optional(),
    organization: z.string().optional(),
    position: z.string().optional(),
    date: z.string().optional(),
    url: urlSchema,
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkInReferenceSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    summary: z.string().nullable().optional(),
    relationship: z.string().optional(),
  })
  .nullable();

const linkInPublicationSchema = z
  .object({
    id: z.string().optional(),
    url: urlSchema,
    date: z.string().optional(),
    name: z.string().optional(),
    publisher: z.string().optional(),
    summary: z.string().nullable().optional(),
  })
  .nullable();

const linkInCertificationSchema = z
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
  basics: z.array(linkInBasicsSchema).optional(),
  work: z.array(linkInWorkSchema).optional(),
  skills: z.array(linkInSkillSchema).optional(),
  projects: z.array(linkInProjectSchema).optional(),
  education: z.array(linkInEducationSchema).optional(),
  languages: z.array(linkInLanguageSchema).optional(),
  certifications: z.array(linkInCertificationSchema).optional(),

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

export type LinkInProfile = z.infer<typeof linkInProfileSchema>;
export type LinkInBasics = z.infer<typeof linkInBasicsSchema>;
export type LinkInSection = z.infer<typeof linkInSectionSchema>;
export type LinkInWork = z.infer<typeof linkInWorkSchema>;
export type LinkInAward = z.infer<typeof linkInAwardSchema>;
export type LinkInSkill = z.infer<typeof linkInSkillSchema>;
export type LinkInProject = z.infer<typeof linkInProjectSchema>;
export type LinkInEducation = z.infer<typeof linkInEducationSchema>;
export type LinkInInterest = z.infer<typeof linkInInterestSchema>;
export type LinkInLanguage = z.infer<typeof linkInLanguageSchema>;
export type LinkInVolunteer = z.infer<typeof linkInVolunteerSchema>;
export type LinkInReference = z.infer<typeof linkInReferenceSchema>;
export type LinkInPublication = z.infer<typeof linkInPublicationSchema>;
export type LinkInCertification = z.infer<typeof linkInCertificationSchema>;

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
