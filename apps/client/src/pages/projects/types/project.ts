import type { ProjectDto, ProjectMappingDto, SearchResultDto, UserDto } from "@reactive-resume/dto";

export type ProjectPageContext = {
  query: string;
  isLoading: boolean;
  error: Error | null;
  filteredSearchResults: UserDto[];
  handleSearch: (query: string) => void;
  handleAddUser: (userId: string, resumeId?: string) => Promise<void>;
  handleRemoveUser: (userId: string) => Promise<void>;
  handleResumeDropdown: (userId: string, resumeId: string) => Promise<void>;
  members: ProjectMappingDto[] | undefined;
  membersLoading: boolean;
  membersError: Error | null;
  project: ProjectDto;
};

export type NormalizedUser = {
  user: UserDto | SearchResultDto;
  resumeId?: string;
};
