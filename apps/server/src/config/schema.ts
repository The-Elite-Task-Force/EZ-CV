import { z } from "zod";

export const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),

  // Ports
  PORT: z.coerce.number().default(3000),

  // URLs
  PUBLIC_URL: z.string().url(),
  STORAGE_URL: z.string().url(),

  // Database (Prisma)
  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  // Authentication Secrets
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  // Browser
  CHROME_TOKEN: z.string(),
  CHROME_URL: z.string().url(),
  CHROME_IGNORE_HTTPS_ERRORS: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),

  // Mail Server
  MAIL_FROM: z.string().includes("@").optional().default("noreply@localhost"),
  SMTP_URL: z
    .string()
    .url()
    .refine((url) => url.startsWith("smtp://") || url.startsWith("smtps://"))
    .optional(),

  // ---STORAGE---
  STORAGE_TYPE: z.string().default("azure_blob_storage"),
  // Azure Blob Storage

  AZURE_ACCOUNT_NAME: z.string(),
  AZURE_ACCOUNT_KEY: z.string(),
  AZURE_STORAGE_CONTAINER: z.string(),

  // Storage (minio)
  STORAGE_SKIP_BUCKET_CHECK: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),

  // Crowdin (Optional)
  CROWDIN_PROJECT_ID: z.coerce.number().optional(),
  CROWDIN_PERSONAL_TOKEN: z.string().optional(),

  // Feature Flags (Optional)
  DISABLE_SIGNUPS: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),
  DISABLE_EMAIL_AUTH: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),

  // GitHub (OAuth, Optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().url().optional(),

  // Google (OAuth, Optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),

  // OpenID (Optional)
  VITE_OPENID_NAME: z.string().optional(),
  OPENID_AUTHORIZATION_URL: z.string().url().optional(),
  OPENID_CALLBACK_URL: z.string().url().optional(),
  OPENID_CLIENT_ID: z.string().optional(),
  OPENID_CLIENT_SECRET: z.string().optional(),
  OPENID_ISSUER: z.string().optional(),
  OPENID_SCOPE: z.string().optional(),
  OPENID_TOKEN_URL: z.string().url().optional(),
  OPENID_USER_INFO_URL: z.string().url().optional(),

  // Microsoft (Optional)
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CALLBACK_URL: z.string().optional(),
  MICROSOFT_AUTHORIZATION_URL: z.string().optional(),
  MICROSOFT_TOKEN_URL: z.string().optional(),
  MICROSOFT_USER_INFO_URL: z.string().optional(),
  MICROSOFT_SCOPE: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;
