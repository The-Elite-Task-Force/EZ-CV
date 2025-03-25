import { createId } from "@paralleldrive/cuid2";
import type { Basics } from "@reactive-resume/schema";
import {
  defaultBasics,
  defaultCertification,
  defaultEducation,
  defaultExperience,
  defaultLanguage,
  defaultProfile,
  defaultProject,
  defaultReference,
  defaultResumeData,
  defaultSkill,
  defaultUrl,
  resumeDataSchema,
} from "@reactive-resume/schema";
import type { Json } from "@reactive-resume/utils";
import { extractUrl, parseArrayLikeCSVEntry, parseCSV } from "@reactive-resume/utils";
import * as JSZip from "jszip";
import type { Schema } from "zod";

import type { Parser } from "../interfaces/parser";
import type { LinkedIn } from "./schema";
import { linkedInSchema } from "./schema";

export * from "./schema";

const avoidTooShort = (name: string, len: number) => {
  if (!name || name.length < len) return "Unknown";
  return name;
};

const extractFirstWebsiteLink = (entry: string) =>
  (parseArrayLikeCSVEntry(entry)[0] ?? "").replace(/.*?:/, "");
export class LinkedInParser implements Parser<JSZip, LinkedIn> {
  schema: Schema;

  constructor() {
    this.schema = linkedInSchema;
  }

  async readFile(file: File): Promise<JSZip> {
    const data = await JSZip.loadAsync(file);

    if (Object.keys(data.files).length === 0) {
      throw new Error("ParserError: There were no files found inside the zip archive.");
    }

    return data;
  }

  async validate(data: JSZip) {
    const result: Json = {};

    for (const [name, file] of Object.entries(data.files)) {
      for (const key of Object.keys(linkedInSchema.shape)) {
        if (name.replace(".csv", "") === key) {
          const content = await file.async("text");
          result[key] = await parseCSV(content);
        }
      }
    }

    return linkedInSchema.parse(result);
  }

  convert(data: LinkedIn) {
    const result = JSON.parse(JSON.stringify(defaultResumeData));
    delete result.basics.id;

    // Profile
    if (data.Profile && data.Profile.length > 0) {
      for (const profile of data.Profile) {
        const twitterHandle = profile["Twitter Handles"];
        const profileBasic: Basics = defaultBasics;

        profileBasic.name = `${profile["First Name"]} ${profile["Last Name"]}`;
        profileBasic.location = profile["Geo Location"];
        profileBasic.headline = profile.Headline;

        // profile.Websites is represented as an array-like structure f.e. [COMPANY:https://some.link,PORTFOLIO:...]
        profileBasic.url.href = extractUrl(extractFirstWebsiteLink(profile.Websites)) ?? "";
        profileBasic.summary = profile.Summary;

        if (twitterHandle) {
          result.sections.profiles.items.push({
            ...defaultProfile,
            id: createId(),
            icon: "twitter",
            network: "Twitter",
            username: twitterHandle,
            url: { ...defaultProfile.url, href: `https://twitter.com/${twitterHandle}` },
          });
        }

        result.sections.basics.items.push(profileBasic);
      }
    }

    // Email Addresses
    if (data["Email Addresses"] && data["Email Addresses"].length > 0) {
      const email = data["Email Addresses"][0];

      result.basics.email = email["Email Address"];
    }

    // Positions
    if (data.Positions && data.Positions.length > 0) {
      for (const position of data.Positions) {
        result.sections.experience.items.push({
          ...defaultExperience,
          id: createId(),
          company: position["Company Name"],
          position: position.Title,
          location: position.Location,
          summary: position.Description ?? "",
          date: `${position["Started On"]} - ${position["Finished On"] ?? "Present"}`,
        });
      }
    }

    // Education
    if (data.Education && data.Education.length > 0) {
      for (const education of data.Education) {
        result.sections.education.items.push({
          ...defaultEducation,
          id: createId(),
          institution: avoidTooShort(education["School Name"], 2),
          studyType: avoidTooShort(education["Degree Name"], 2),
          summary: avoidTooShort(education.Notes ?? "", 2),
          date: `${education["Start Date"]} - ${education["End Date"] ?? "Present"}`,
        });
      }
    }

    // Skills
    if (data.Skills && data.Skills.length > 0) {
      for (const skill of data.Skills) {
        result.sections.skills.items.push({
          ...defaultSkill,
          id: createId(),
          name: skill.Name,
        });
      }
    }

    // Languages
    if (data.Languages && data.Languages.length > 0) {
      for (const language of data.Languages) {
        result.sections.languages.items.push({
          ...defaultLanguage,
          id: createId(),
          name: language.Name,
          description: language.Proficiency ?? "",
        });
      }
    }

    // Certifications
    if (data.Certifications && data.Certifications.length > 0) {
      for (const certification of data.Certifications) {
        result.sections.certifications.items.push({
          ...defaultCertification,
          id: createId(),
          name: certification.Name,
          issuer: certification.Authority,
          url: { ...defaultCertification.url, href: certification.Url },
          date: `${certification["Started On"]} - ${certification["Finished On"] ?? "Present"}`,
        });
      }
    }

    // Projects
    if (data.Projects && data.Projects.length > 0) {
      for (const project of data.Projects) {
        result.sections.projects.items.push({
          ...defaultProject,
          id: createId(),
          name: project.Title,
          description: project.Description,
          url: { ...defaultProject.url, href: project.Url ?? "" },
          date: `${project["Started On"]} - ${project["Finished On"] ?? "Present"}`,
        });
      }
    }

    // References
    if (data.Recommendations_Received && data.Recommendations_Received.length > 0) {
      for (const reference of data.Recommendations_Received) {
        result.sections.references.items.push({
          ...defaultReference,
          id: createId(),
          name: `${reference["First Name"]} ${reference["Last Name"]}`,
          description: reference.Company,
          summary: reference.Text ?? "",
          url: defaultUrl,
        });
      }
    }

    result.sections.basics.items[0].id = createId();
    return resumeDataSchema.parse(result);
  }
}
