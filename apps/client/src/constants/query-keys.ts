import type { QueryKey } from "@tanstack/react-query";

export const USER_KEY: QueryKey = ["user"];
export const AUTH_PROVIDERS_KEY: QueryKey = ["auth", "providers"];

export const LANGUAGES_KEY: QueryKey = ["translation", "languages"];

export const RESUME_KEY: QueryKey = ["resume"];
export const RESUMES_KEY: QueryKey = ["resumes"];
export const RESUME_PREVIEW_KEY: QueryKey = ["resume", "preview"];
export const RESUME_ID_KEY: QueryKey = ["resume", "id"];
export const PUBLIC_RESUMES_KEY: QueryKey = ["resumes", "userId"];

export const SECTIONS_KEY: QueryKey = ["sections"];
export const SECTION_MAPPING_KEY: QueryKey = ["mappings", "id"];

export const COMPANY_KEY: QueryKey = ["company"];
export const COMPANIES_KEY: QueryKey = ["companies"];
export const OWNCOMPANIES_KEY: QueryKey = ["owned-companies"];
export const EMPLOYEES_KEY: QueryKey = ["employees"];

export const PROJECT_KEY: QueryKey = ["project", "id"];
export const PROJECTS_KEY: QueryKey = ["projects"];
export const PROJECT_MAPPINGS_KEY: QueryKey = ["project-mappings", "projectId"];
