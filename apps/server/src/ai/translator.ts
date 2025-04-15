import type { Sections } from "@reactive-resume/schema";
import { sectionsSchema } from "@reactive-resume/schema";
import { OpenAI } from "openai";

import { prompts } from "./prompts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const maxAttempts = 2;

export async function translateBasicSection(
  basics: Sections["basics"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["basics"]> {
  if (basics.items.length === 0) {
    return basics;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(basics.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.basics.parse({
          ...basics,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateBasicsSection");
}

export async function translateSummarySection(
  summary: Sections["summary"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["summary"]> {
  if (summary.items.length === 0) {
    return summary;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(summary.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.summary.parse({
          ...summary,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateSummarySection");
}

export async function translateAwardsSection(
  awards: Sections["awards"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["awards"]> {
  if (awards.items.length === 0) {
    return awards;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(awards.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.awards.parse({
          ...awards,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateAwardsSection");
}

export async function translateCertificationsSection(
  certifications: Sections["certifications"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["certifications"]> {
  if (certifications.items.length === 0) {
    return certifications;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(certifications.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.certifications.parse({
          ...certifications,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateCertificationsSection");
}

export async function translateEducationSection(
  education: Sections["education"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["education"]> {
  if (education.items.length === 0) {
    return education;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(education.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.education.parse({
          ...education,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateEducationsSection");
}

export async function translateExperienceSection(
  experience: Sections["experience"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["experience"]> {
  if (experience.items.length === 0) {
    return experience;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(experience.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.experience.parse({
          ...experience,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Unexpected error in translateExperienceSection");
}

export async function translateVolunteerSection(
  volunteer: Sections["volunteer"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["volunteer"]> {
  if (volunteer.items.length === 0) {
    return volunteer;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(volunteer.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.volunteer.parse({
          ...volunteer,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateVolunteerSection");
}

export async function translateInterestsSection(
  interests: Sections["interests"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["interests"]> {
  if (interests.items.length === 0) {
    return interests;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(interests.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.interests.parse({
          ...interests,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateInterestsSection");
}

export async function translateLanguagesSection(
  languages: Sections["languages"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["languages"]> {
  if (languages.items.length === 0) {
    return languages;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(languages.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.languages.parse({
          ...languages,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateLanguageSection");
}

export async function translateProfilesSection(
  profiles: Sections["profiles"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["profiles"]> {
  if (profiles.items.length === 0) {
    return profiles;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(profiles.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.profiles.parse({
          ...profiles,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateProfilesSection");
}

export async function translateProjectsSection(
  projects: Sections["projects"],
  targetLang: string,
  maxAttempts = 3,
): Promise<Sections["projects"]> {
  if (projects.items.length === 0) {
    return projects;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(projects.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.projects.parse({
          ...projects,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateProjectsSection");
}

export async function translatePublicationsSection(
  publications: Sections["publications"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["publications"]> {
  if (publications.items.length === 0) {
    return publications;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(publications.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.publications.parse({
          ...publications,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translatePublicationsSection");
}

export async function translateReferencesSection(
  references: Sections["references"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["references"]> {
  if (references.items.length === 0) {
    return references;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(references.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.references.parse({
          ...references,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateReferencesSection");
}

export async function translateSkillsSection(
  skills: Sections["skills"],
  targetLang: string,
  maxAttempts = 2,
): Promise<Sections["skills"]> {
  if (skills.items.length === 0) {
    return skills;
  }
  // Create the messages array once.
  const basePrompt = prompts.projects.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: basePrompt },
    { role: "user", content: JSON.stringify(skills.items) },
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.3,
      });

      const rawContent = response.choices[0].message.content ?? "[]";

      messages.push({
        role: "assistant",
        content: rawContent,
      });
      try {
        const parsedItems = JSON.parse(rawContent);
        const validatedSection = sectionsSchema.shape.skills.parse({
          ...skills,
          items: parsedItems,
        });
        return validatedSection;
      } catch (error) {
        const errorMsg = `Error parsing JSON. PLEASE TRY AGAIN: ${error}`;
        messages.push({
          role: "user",
          content: errorMsg,
        });
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Unexpected error in translateSkillsSection");
}

export async function translateSections(sections: Sections, targetLang: string): Promise<Sections> {
  return {
    basics: await translateBasicSection(sections.basics, targetLang),
    summary: await translateSummarySection(sections.summary, targetLang),
    awards: await translateAwardsSection(sections.awards, targetLang),
    certifications: await translateCertificationsSection(sections.certifications, targetLang),
    education: await translateEducationSection(sections.education, targetLang),
    experience: await translateExperienceSection(sections.experience, targetLang),
    volunteer: await translateVolunteerSection(sections.volunteer, targetLang),
    interests: await translateInterestsSection(sections.interests, targetLang),
    languages: await translateLanguagesSection(sections.languages, targetLang),
    profiles: await translateProfilesSection(sections.profiles, targetLang),
    projects: await translateProjectsSection(sections.projects, targetLang),
    publications: await translatePublicationsSection(sections.publications, targetLang),
    references: await translateReferencesSection(sections.references, targetLang),
    skills: await translateSkillsSection(sections.skills, targetLang),
  };
}
