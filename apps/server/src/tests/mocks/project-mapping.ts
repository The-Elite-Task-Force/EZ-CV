import { mockUserId, mockUserWithoutPRI } from "./mocks";
import { mockProjectId } from "./project";

export const mockProjectMapping = {
  id: "mapping-1",
  projectId: mockProjectId,
  userId: mockUserWithoutPRI.id,
  resumeId: "resume-789",
  user: mockUserWithoutPRI,
};

export const createProjectMappingDto = {
  projectId: mockProjectId,
  userId: mockUserId,
  resumeId: "resume-1",
};
