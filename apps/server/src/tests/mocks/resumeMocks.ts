import { createId } from "@paralleldrive/cuid2";
import type { ResumeDto, VariantDto } from "@reactive-resume/dto";

// Mock Resume
export const mockResume: ResumeDto = {
  title: "Tremendous Multiple Earwig1",
  slug: "tremendous-multiple-earwig1",
  data: {
    basics: {
      id: "q0vfwb1va3ebuex6fz7yzryt",
      url: { href: "", label: "" },
      name: "Kristofer pedersen",
      email: "kristofer_p@hotmail.com",
      phone: "",
      userId: "cm9v2uf50000012jdhly3lbo4",
      picture: {
        url: "",
        size: 64,
        effects: { border: false, hidden: false, grayscale: false },
        aspectRatio: 1,
        borderRadius: 0,
      },
      summary: "",
      headline: "",
      location: "",
      birthdate: "",
      updatedAt: new Date("2025-03-20T13:04:26.935Z"),
      customFields: [],
    },
    metadata: {
      css: { value: "* {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}", visible: false },
      page: { format: "a4", margin: 12, options: { breakLine: true, pageNumbers: true } },
      notes: "",
      theme: { text: "#000000", primary: "#0284c7", background: "#ffffff" },
      layout: [
        [["profiles", "summary", "experience", "education", "references"]],
        [["skills", "interests", "certifications", "awards", "publications", "languages"]],
      ],
      template: "chikorita",
      typography: {
        font: { size: 13.6, family: "IBM Plex Sans", subset: "latin", variants: ["regular"] },
        hideIcons: false,
        lineHeight: 1.5,
        underlineLinks: true,
      },
    },
    sections: {
      awards: {
        id: "awards",
        name: "Awards",
        items: [
          {
            id: "ff9231aklmqwuw2kp7szbe9w",
            url: {
              href: "https://microsoft.com",
              label: "",
            },
            date: "March 20023",
            title: "Azure",
            userId: "cm9v2uf50000012jdhly3lbo4",
            awarder: "Microsoft",
            summary: "<p>Whoops this is an award and not a certificate</p>",
            updatedAt: new Date("2025-03-20T13:11:56.179Z"),
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      basics: {
        id: "basics",
        name: "Basics",
        items: [
          {
            id: "wkrbd3tkiq830pv5wbzfh6hp",
            url: {
              href: "",
              label: "",
            },
            name: "",
            email: "",
            phone: "",
            userId: "cm9v2uf50000012jdhly3lbo4",
            picture: {
              url: "",
              size: 64,
              effects: {
                border: false,
                hidden: false,
                grayscale: false,
              },
              aspectRatio: 1,
              borderRadius: 0,
            },
            summary: "",
            headline: "",
            location: "",
            birthdate: "",
            updatedAt: new Date("2025-03-25T10:13:16.097Z"),
            customFields: [],
          },
          {
            id: "q0vfwb1va3ebuex6fz7yzryt",
            url: {
              href: "",
              label: "",
            },
            name: "Inugami Korone",
            email: "doggodp@hotmail.com",
            phone: "",
            userId: "cm9v2uf50000012jdhly3lbo4",
            picture: {
              url: "",
              size: 64,
              effects: {
                border: false,
                hidden: false,
                grayscale: false,
              },
              aspectRatio: 1,
              borderRadius: 0,
            },
            summary: "",
            headline: "",
            location: "",
            birthdate: "",
            updatedAt: new Date("2025-03-20T13:04:26.935Z"),
            customFields: [],
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      skills: {
        id: "skills",
        name: "Skills",
        items: [
          {
            id: "xjq5a0xml3msnh4wo2gcy5bg",
            name: "Baking",
            level: 0,
            userId: "cm9v2uf50000012jdhly3lbo4",
            keywords: [],
            updatedAt: new Date("2025-03-20T13:09:39.717Z"),
            description: "I love bread",
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      summary: {
        id: "summary",
        name: "Summary",
        items: [
          {
            id: "kejl0rui88dxkqrwvuy6uvsi",
            name: "hidden summary",
            userId: "cm9v2uf50000012jdhly3lbo4",
            content: "",
            updatedAt: new Date("2025-03-24T09:43:56.450Z"),
            description: "",
          },
          {
            id: "ecutzhbrbwyj4sjcezd0bnaw",
            name: "My summary",
            userId: "cm9v2uf50000012jdhly3lbo4",
            content: "<p>My name is INUGAMI korone #420</p>",
            updatedAt: new Date("2025-03-20T13:11:19.942Z"),
            description: "This is the description to my summary",
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      profiles: {
        id: "profiles",
        name: "Profiles",
        items: [
          {
            id: "tnnv1rhlhpmfxduvkdri66jf",
            url: {
              href: "https://github.com/DogGod",
              label: "",
            },
            icon: "github",
            userId: "cm9v2uf50000012jdhly3lbo4",
            network: "github",
            username: "doginumaki",
            updatedAt: new Date("2025-03-20T13:06:30.086Z"),
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      projects: {
        id: "projects",
        name: "Projects",
        items: [],
        columns: 1,
        separateLinks: true,
      },
      education: {
        id: "education",
        name: "Education",
        items: [
          {
            id: "dmh3gbdr5ig1yznxzqmepnv0",
            url: {
              href: "",
              label: "",
            },
            area: "baking",
            date: "1900-2003",
            score: "10",
            degree: "",
            userId: "cm9v2uf50000012jdhly3lbo4",
            courses: {},
            summary: "",
            studyType: "Masters",
            updatedAt: new Date("2025-03-20T13:08:58.533Z"),
            institution: "education",
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      interests: {
        id: "interests",
        name: "Interests",
        items: [
          {
            id: "ahield3c1om5oqffb1kidqy8",
            name: "Gaming",
            userId: "cm9v2uf50000012jdhly3lbo4",
            keywords: ["Retro", "games"],
            updatedAt: new Date("2025-03-20T13:13:35.499Z"),
          },
          {
            id: "v9k4fz79rqykvd40ha6x6lrb",
            name: "Biting",
            userId: "cm9v2uf50000012jdhly3lbo4",
            keywords: [],
            updatedAt: new Date("2025-03-20T13:13:18.170Z"),
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      languages: {
        id: "languages",
        name: "Languages",
        items: [
          {
            id: "hv8p6wyc1um800gqlzuxniv4",
            name: "English",
            level: 1,
            userId: "cm9v2uf50000012jdhly3lbo4",
            updatedAt: new Date("2025-03-20T13:10:26.582Z"),
            description: "I Die, thankyou forever",
          },
          {
            id: "w19k6mxnqva4ikhrt8lg1z0i",
            name: "Japanese",
            level: 0,
            userId: "cm9v2uf50000012jdhly3lbo4",
            updatedAt: new Date("2025-03-20T13:10:10.917Z"),
            description: "NonNonNom",
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      volunteer: {
        id: "volunteer",
        name: "Volunteering",
        items: [
          {
            id: "imu77bzexbsgdw7kl90zynh9",
            url: {
              href: "",
              label: "",
            },
            date: "March20003",
            userId: "cm9v2uf50000012jdhly3lbo4",
            summary: "",
            location: "CountrySide",
            position: "Nurse",
            updatedAt: new Date("2025-03-20T13:21:32.534Z"),
            organization: "Helping grandma",
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      experience: {
        id: "experience",
        name: "Experience",
        items: [
          {
            id: "iasqcleusnb8i35mxqhz9owb",
            url: {
              href: "hhttps://myfakeschool.com",
              label: "",
            },
            date: "march-2003",
            name: "",
            userId: "cm9v2uf50000012jdhly3lbo4",
            company: "My workplace",
            summary: "<p>CEO of MY WORKPLACE</p>",
            location: "home",
            position: "CEO",
            updatedAt: new Date("2025-03-20T13:09:26.029Z"),
          },
          {
            id: "uv1mm6wyylgx4cmac4dqxseo",
            url: {
              href: "https://amys.bakin.co",
              label: "",
            },
            date: "March-2013",
            name: "",
            userId: "cm9v2uf50000012jdhly3lbo4",
            company: "BAker",
            summary: "<p>Best Baker in the word</p>",
            location: "",
            position: "03-12-94",
            updatedAt: new Date("2025-03-20T13:07:38.766Z"),
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      references: {
        id: "references",
        name: "References",
        items: [
          {
            id: "zd1n5uy1uph59pcajq1mr32e",
            url: {
              href: "",
              label: "",
            },
            name: "My reference",
            email: "",
            phone: "",
            userId: "cm9v2uf50000012jdhly3lbo4",
            summary: "<p>MIOSHA</p>",
            updatedAt: new Date("2025-03-20T13:21:10.263Z"),
            description: "",
            relationship: "",
          },
        ],
        columns: 1,
        separateLinks: true,
      },
      publications: {
        id: "publications",
        name: "Publications",
        items: [],
        columns: 1,
        separateLinks: true,
      },
      certifications: {
        id: "certifications",
        name: "Certifications",
        items: [
          {
            id: "uhlgslnj5d1bzja5tzt6mu0s",
            url: {
              href: "https://udemy.com",
              label: "",
            },
            date: "March 9991",
            name: "Biting Certificate",
            issuer: "Mio",
            userId: "cm9v2uf50000012jdhly3lbo4",
            summary: "<p>Wait this isn't an certificate</p>",
            updatedAt: new Date("2025-03-20T13:13:13.357Z"),
          },
        ],
        columns: 1,
        separateLinks: true,
      },
    },
  },
  id: "uzptmhp7pho7tbqs9204974u",
  language: "da-DK",
  userId: "",
  updatedAt: new Date(),
  visibility: "private",
  locked: false,
  createdAt: new Date(),
};

export enum Provider {
  Email = "email",
  GitHub = "github",
  Google = "google",
  OpenID = "openid",
  Microsoft = "microsoft",
}

// Mock User
export const mockUser = {
  id: "userId",
  updatedAt: new Date(),
  name: "Test User",
  email: "test@example.com",
  picture: null,
  username: "testuser",
  locale: "en",
  emailVerified: true,
  twoFactorEnabled: false,
  profileResumeId: null,
  provider: Provider.Email,
  createdAt: new Date(),
};

// Mock Translated Data
// eslint-disable-next-line @typescript-eslint/no-misused-spread
export const mockTranslatedData = { ...mockResume, id: "translatedResumeId" };

// Mock Saved Variant
export const mockSavedVariant: VariantDto = {
  ...mockTranslatedData,
  id: createId(),
  creatorId: mockUser.id,
  resumeId: mockTranslatedData.id,
  visibility: "public",
  locked: false,
  createdAt: new Date(),
  language: "en",
};

// Mock Summary
export const mockSummary = {
  id: "summary",
  items: [
    {
      id: "1",
      content: "Original Summary",
      name: "Summary Item",
      userId: "userId123",
      updatedAt: new Date(),
      description: "Description of the summary item",
    },
  ],
};

// Mock Chat Completion Response
export const mockResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify(mockSummary.items), // Return the same structure as input
      },
    },
  ],
};
