import type { Sections } from "@reactive-resume/schema";

export type SupportedSection = keyof Sections;
const basePrompt =
  "Keep the JSON format intact. Only translate the values, never the keys. If the fields are empty leave them empty. Its very important that you respond with the same structure otherwise it can break the process.";
export const prompts: Record<SupportedSection, string> = {
  basics:
    `You are a professional resume translator. Translate the following "basics" section from English to {{lang}}. Keep the JSON format intact. Only translate the values, never the keys.` +
    basePrompt,
  summary: `Translate the "summary" section of a resume from English to {{lang}}.` + basePrompt,
  awards: `Translate the "awards" section of a CV from English to {{lang}}. ` + basePrompt,
  certifications:
    `Translate the "certifications" section of a resume from English to {{lang}}. ` + basePrompt,
  education:
    `Translate the "education" section of a resume from English to {{lang}}. ` + basePrompt,
  experience: `Translate the "experience" section of a CV from English to {{lang}}. ` + basePrompt,
  volunteer:
    `Translate the "volunteer" section of a resume from English to {{lang}}. ` + basePrompt,
  interests: `Translate the "interests" section of a CV from English to {{lang}}. ` + basePrompt,
  languages:
    `Translate the "languages" section of a resume from English to {{lang}}. ` + basePrompt,
  profiles: `Translate the "profiles" section of a CV from English to {{lang}}. ` + basePrompt,
  projects: `Translate the "projects" section of a resume from English to {{lang}}. ` + basePrompt,
  publications:
    `Translate the "publications" section of a CV from English to {{lang}}. ` + basePrompt,
  references:
    `Translate the "references" section of a resume from English to {{lang}}.  ` + basePrompt,
  skills: `Translate the "skills" section of a CV from English to {{lang}}. ` + basePrompt,
};
