import { Logger } from "@nestjs/common";
import type { ResumeData } from "@reactive-resume/schema";

import {
  translateAwardsSection,
  translateBasicSection,
  translateCertificationsSection,
  translateEducationSection,
  translateExperienceSection,
  translateInterestsSection,
  translateLanguagesSection,
  translateProfilesSection,
  translateProjectsSection,
  translatePublicationsSection,
  translateReferencesSection,
  translateSkillsSection,
  translateSummarySection,
  translateVolunteerSection,
} from "./translator";

export async function translateSections(data: ResumeData, targetLang: string): Promise<ResumeData> {
  try {
    const [
      basics,
      summary,
      awards,
      certifications,
      education,
      experience,
      volunteer,
      interests,
      languages,
      profiles,
      projects,
      publications,
      references,
      skills,
    ] = await Promise.all([
      translateBasicSection(data.sections.basics, targetLang),
      translateSummarySection(data.sections.summary, targetLang),
      translateAwardsSection(data.sections.awards, targetLang),
      translateCertificationsSection(data.sections.certifications, targetLang),
      translateEducationSection(data.sections.education, targetLang),
      translateExperienceSection(data.sections.experience, targetLang),
      translateVolunteerSection(data.sections.volunteer, targetLang),
      translateInterestsSection(data.sections.interests, targetLang),
      translateLanguagesSection(data.sections.languages, targetLang),
      translateProfilesSection(data.sections.profiles, targetLang),
      translateProjectsSection(data.sections.projects, targetLang),
      translatePublicationsSection(data.sections.publications, targetLang),
      translateReferencesSection(data.sections.references, targetLang),
      translateSkillsSection(data.sections.skills, targetLang),
    ]);

    return {
      ...data,
      sections: {
        basics,
        summary,
        awards,
        certifications,
        education,
        experience,
        volunteer,
        interests,
        languages,
        profiles,
        projects,
        publications,
        references,
        skills,
      },
    };
  } catch (error) {
    Logger.error("Error translating sections:", error);
    throw new Error("Failed to translate all sections.");
  }
}
