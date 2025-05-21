import type { Project } from "@prisma/client";
import type { CreateProjectDto } from "@reactive-resume/dto";

import { mockUserWithoutPRI } from "./mocks";

export const mockCompanyId = "company-456";

export const mockProjectId = "project-123";

export const mockCreateProjectDto: CreateProjectDto = {
  name: "My Project",
  companyId: mockCompanyId,
};

export const mockProject: Project = {
  id: mockProjectId,
  name: mockCreateProjectDto.name,
  companyId: mockCreateProjectDto.companyId,
  updatedAt: new Date(),
  userId: "user-123",
  description: "",
};

export const mockProjects = [
  {
    id: "project-1",
    name: "Project A",
    companyId: mockCompanyId,
    userId: mockUserWithoutPRI.id,
    updatedAt: new Date(),
    description: "Test project",
  },
];
