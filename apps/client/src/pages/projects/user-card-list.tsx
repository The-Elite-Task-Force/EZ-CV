/* eslint-disable lingui/no-unlocalized-strings */
import type { ProjectMappingDto, SearchResultDto } from "@reactive-resume/dto";

import { UserCard } from "../dashboard/search/user-card";
import type { NormalizedUser } from "./types/project";

type UserCardListProps = {
  users: ProjectMappingDto[] | SearchResultDto[] | undefined;
  usersLoading: boolean;
  usersError: Error | null;
  data: boolean;
  handleAddUser?: (userId: string, resumeId?: string) => void;
  handleRemoveUser?: (userId: string) => void;
  handleResumeDropdown?: (userId: string, resumeId: string) => void;
  resumeDropdown?: boolean;
};

export const UserCardList = ({
  users,
  usersLoading,
  usersError,
  data,
  handleAddUser,
  handleRemoveUser,
  handleResumeDropdown,
  resumeDropdown,
}: UserCardListProps) => {
  const normalizedUsers: NormalizedUser[] | undefined = users?.map((item) =>
    "user" in item ? { user: item.user, resumeId: item.resumeId } : { user: item },
  );

  return (
    <>
      {usersLoading && <p>Loading...</p>}
      {usersError && <p>Error: {usersError.message}</p>}
      {!usersLoading && normalizedUsers && normalizedUsers.length > 0 ? (
        <ul>
          {normalizedUsers.map(({ user, resumeId }, index) => (
            <li key={index}>
              <UserCard
                user={user}
                projectResumeId={resumeId}
                handleAddUser={handleAddUser}
                handleRemoveUser={handleRemoveUser}
                handleResumeDropdown={handleResumeDropdown}
                resumeDropdown={resumeDropdown}
              />
            </li>
          ))}
        </ul>
      ) : (
        !usersLoading && data && <p>No results found</p>
      )}
    </>
  );
};
