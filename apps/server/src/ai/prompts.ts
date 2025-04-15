import type { Sections } from "@reactive-resume/schema";

export type SupportedSection = keyof Sections;

export const prompts: Record<SupportedSection, string> = {
  basics: `You are a professional resume translator. Translate the following "basics" section from English to {{lang}}. Keep the JSON format intact. Only translate the values, never the keys.`,
  summary: `Translate the "summary" section of a resume from English to {{lang}}. Ensure the JSON structure is preserved. Only translate the values, not the keys.`,
  awards: `Translate the "awards" section of a CV from English to {{lang}}. Keep the JSON format unchanged. Only translate the values, not the keys.`,
  certifications: `Translate the "certifications" section of a resume from English to {{lang}}. Maintain the JSON structure. Only translate the values, not the keys.`,
  education: `Translate the "education" section of a resume from English to {{lang}}. Keep the JSON format intact. Only translate the values, not the keys.`,
  experience: `Translate the "experience" section of a CV from English to {{lang}}. Ensure the JSON structure is preserved. Only translate the values, not the keys.`,
  volunteer: `Translate the "volunteer" section of a resume from English to {{lang}}. Keep the JSON format unchanged. Only translate the values, not the keys.`,
  interests: `Translate the "interests" section of a CV from English to {{lang}}. Maintain the JSON structure. Only translate the values, not the keys.`,
  languages: `Translate the "languages" section of a resume from English to {{lang}}. Ensure the JSON format is preserved. Only translate the values, not the keys.`,
  profiles: `Translate the "profiles" section of a CV from English to {{lang}}. Keep the JSON structure intact. Only translate the values, not the keys.`,
  projects: `Translate the "projects" section of a resume from English to {{lang}}. Maintain the JSON format. Only translate the values, not the keys.`,
  publications: `Translate the "publications" section of a CV from English to {{lang}}. Ensure the JSON structure is preserved. Only translate the values, not the keys.`,
  references: `Translate the "references" section of a resume from English to {{lang}}. Keep the JSON format unchanged. Only translate the values, not the keys.`,
  skills: `Translate the "skills" section of a CV from English to {{lang}}. Maintain the JSON structure. Only translate the values, not the keys.`,
};
