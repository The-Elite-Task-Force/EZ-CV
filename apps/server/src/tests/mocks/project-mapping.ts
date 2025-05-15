import { mockUserId, mockUserWithoutPRI } from "./mocks";
import { mockProjectId } from "./project";

export const mockProjectMapping = {
  id: "mapping-1",
  projectId: mockProjectId,
  userId: mockUserWithoutPRI.id,
  resumeId: "resume-789",
  user: mockUserWithoutPRI,
};

export const mockProjectMapping2 = {
  id: "mapping-2",
  projectId: mockProjectId,
  userId: mockUserWithoutPRI.id,
  resumeId: "resume-456",
  user: mockUserWithoutPRI,
};

export const mockCreateProjectMapping = {
  projectId: mockProjectId,
  userId: mockUserId,
  resumeId: "resume-1",
};

export const mockProjectMappingList = [mockProjectMapping, mockProjectMapping2];

export const mockUpdateResumeId = "updated-resume-id";
