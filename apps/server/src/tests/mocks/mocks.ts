import { Provider } from "@prisma/client";
import type { UserWithSecrets } from "@reactive-resume/dto";

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

export const mockCreateCompany = {
  name: "Mock company",
  description: "Mock description",
  location: "Mock location",
};
