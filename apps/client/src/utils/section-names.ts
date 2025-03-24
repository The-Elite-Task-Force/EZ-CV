export enum SECTION_NAMES {
  basics = "Basic",
  interests = "Interest",
  education = "Education",
  experience = "Experience",
  skills = "Skill",
  projects = "Project",
  profiles = "Profile",
  publications = "Publication",
  certifications = "Certification",
  languages = "Language",
  references = "Reference",
  volunteer = "Volunteering",
  summary = "Summary",
  awards = "Award",
  custom = "Custom",
}

export function getSectionNameFromId(id: string) {
  return Object.keys(SECTION_NAMES).includes(id as SECTION_NAMES)
    ? SECTION_NAMES[id as keyof typeof SECTION_NAMES]
    : SECTION_NAMES.custom;
}
