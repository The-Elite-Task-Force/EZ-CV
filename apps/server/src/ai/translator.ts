import type { Sections } from "@reactive-resume/schema";
import { sectionsSchema } from "@reactive-resume/schema";
import { OpenAI } from "openai";

import { prompts } from "./prompts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Extract the keys from the sections schem
export async function translateBasicSection(
  basics: Sections["basics"],
  targetLang: string,
): Promise<Sections["basics"]> {
  console.log("Translating basics section...");
  const prompt = prompts.basics.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(basics.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });
  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.basics.parse({
    ...basics,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateSummarySection(
  summary: Sections["summary"],
  targetLang: string,
): Promise<Sections["summary"]> {
  console.log("Translating summary section...");
  const prompt = prompts.summary.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(summary.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";

  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.summary.parse({
    ...summary,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateAwardsSection(
  awards: Sections["awards"],
  targetLang: string,
): Promise<Sections["awards"]> {
  console.log("Translating awards section...");
  const prompt = prompts.awards.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(awards.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.awards.parse({
    ...awards,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateCertificationsSection(
  certifications: Sections["certifications"],
  targetLang: string,
): Promise<Sections["certifications"]> {
  console.log("Translating certifications section...");
  const prompt = prompts.certifications.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(certifications.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.certifications.parse({
    ...certifications,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateEducationSection(
  education: Sections["education"],
  targetLang: string,
): Promise<Sections["education"]> {
  console.log("Translating education section...");
  const prompt = prompts.education.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(education.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.education.parse({
    ...education,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateExperienceSection(
  experience: Sections["experience"],
  targetLang: string,
): Promise<Sections["experience"]> {
  console.log("Translating experience section...");
  const prompt = prompts.experience.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(experience.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.experience.parse({
    ...experience,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateVolunteerSection(
  volunteer: Sections["volunteer"],
  targetLang: string,
): Promise<Sections["volunteer"]> {
  console.log("Translating volunteer section...");
  const prompt = prompts.volunteer.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(volunteer.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.volunteer.parse({
    ...volunteer,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateInterestsSection(
  interests: Sections["interests"],
  targetLang: string,
): Promise<Sections["interests"]> {
  console.log("Translating interests section...");
  const prompt = prompts.interests.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(interests.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.interests.parse({
    ...interests,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateLanguagesSection(
  languages: Sections["languages"],
  targetLang: string,
): Promise<Sections["languages"]> {
  console.log("Translating languages section...");
  const prompt = prompts.languages.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(languages.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.languages.parse({
    ...languages,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateProfilesSection(
  profiles: Sections["profiles"],
  targetLang: string,
): Promise<Sections["profiles"]> {
  console.log("Translating profiles section...");
  const prompt = prompts.profiles.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(profiles.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  console.log("Response content:", content);
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.profiles.parse({
    ...profiles,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateProjectsSection(
  projects: Sections["projects"],
  targetLang: string,
  maxAttempts = 3,
): Promise<Sections["projects"]> {
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
      console.log("Response content:", rawContent);

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
): Promise<Sections["publications"]> {
  const prompt = prompts.publications.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(publications.items) },
  ];

  console.log("Translating publications section...");
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  const parsedItems = JSON.parse(content);
  console.log("Response content:", content);
  const validatedSection = sectionsSchema.shape.publications.parse({
    ...publications,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateReferencesSection(
  references: Sections["references"],
  targetLang: string,
): Promise<Sections["references"]> {
  const prompt = prompts.references.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(references.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.references.parse({
    ...references,
    items: parsedItems,
  });
  return validatedSection;
}

export async function translateSkillsSection(
  skills: Sections["skills"],
  targetLang: string,
): Promise<Sections["skills"]> {
  console.log("Translating skills section...");
  const prompt = prompts.skills.replace("{{lang}}", targetLang);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    { role: "user", content: JSON.stringify(skills.items) },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0].message?.content ?? "[]";
  const parsedItems = JSON.parse(content);
  const validatedSection = sectionsSchema.shape.skills.parse({
    ...skills,
    items: parsedItems,
  });
  return validatedSection;
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
