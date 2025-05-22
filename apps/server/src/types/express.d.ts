import type { Resume, ResumeVariant, User as PrismaUser } from "@prisma/client";

type RequestPayload = {
  resume?: Resume;
  variant?: ResumeVariant;
  // Add other custom payload types here
};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: PrismaUser;
      payload?: RequestPayload;
    }
  }
}

export {};
