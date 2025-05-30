import type { ConfigService } from "@nestjs/config";
import { Provider } from "@prisma/client";
import type { UserWithSecrets } from "@reactive-resume/dto";
import { vi } from "vitest";

import type { IStorageProvider } from "@/server/storage/adapters/storage.adapter.interface";

export const mockUserId = "user-123";

export const mockUserWithoutPRI: UserWithSecrets = {
  id: mockUserId,
  name: "John Doe",
  picture: "https://example.com/johndoe.jpg",
  username: "johndoe",
  email: "johndoe@example.com",
  locale: "en-US",
  emailVerified: true,
  twoFactorEnabled: false,
  profileResumeId: null,
  provider: "email",
  createdAt: new Date(),
  updatedAt: new Date(),
  secrets: null,
};

export const mockCreateUser = {
  name: "John Doe",
  picture: "https://example.com/johndoe.jpg",
  username: "johndoe",
  email: "johndoe@example.com",
  locale: "en-US",
  emailVerified: true,
  twoFactorEnabled: false,
  profileResumeId: null,
  provider: Provider.email,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCreateSecondUser = {
  name: "Jane Smith",
  picture: "https://example.com/janesmith.jpg",
  username: "janesmith",
  email: "janesmith@example.com",
  locale: "en-GB",
  emailVerified: true,
  twoFactorEnabled: false,
  profileResumeId: null,
  provider: Provider.email,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCreateCompany = {
  name: "Mock company",
  description: "Mock description",
  location: "Mock location",
};

export const mockStorageAdapter: IStorageProvider = {
  uploadObject: vi.fn().mockResolvedValue("mocked-upload-url"),
  deleteObject: vi.fn().mockResolvedValue(null),
  deleteFolder: vi.fn().mockResolvedValue(null),
  containerExists: vi.fn().mockResolvedValue(true),
};

export const mockConfigService = {
  getOrThrow: vi.fn((key: string) => {
    switch (key) {
      case "CHROME_URL": {
        return "ws://mock-chrome-url";
      }
      case "CHROME_TOKEN": {
        return "mock-token";
      }
      case "CHROME_IGNORE_HTTPS_ERRORS": {
        return false;
      }
      case "PUBLIC_URL": {
        return "http://localhost";
      }
      case "STORAGE_URL": {
        return "http://localhost";
      }
      default: {
        throw new Error(`Unexpected config key: ${key}`);
      }
    }
  }),
} as unknown as ConfigService<unknown>;
