/* eslint-disable lingui/no-unlocalized-strings */
import type { SearchResultDto, UserDto } from "@reactive-resume/dto";

import { UserCard } from "../dashboard/search/user-card";

type UserCardListProps = {
  users: { user: UserDto }[] | SearchResultDto[] | undefined;
  usersLoading: boolean;
  usersError: Error | null;
  data: boolean;
  handleAddUser?: (userId: string) => void;
  handleRemoveUser?: (userId: string) => void;
  handleResumeDropdown?: (userId: string, resumeId: string) => void;
};

export const UserCardList = ({
  users,
  usersLoading,
  usersError,
  data,
  handleAddUser,
  handleRemoveUser,
  handleResumeDropdown,
}: UserCardListProps) => {
  const normalizedUsers: UserDto[] | SearchResultDto[] | undefined = users?.map((item) =>
    "user" in item ? item.user : item,
  );

  return (
    <>
      {usersLoading && <p>Loading...</p>}
      {usersError && <p>Error: {usersError.message}</p>}
      {!usersLoading && normalizedUsers && normalizedUsers.length > 0 ? (
        <ul>
          {normalizedUsers.map((user, index) => (
            <li key={index}>
              <UserCard
                user={user}
                handleAddUser={handleAddUser}
                handleRemoveUser={handleRemoveUser}
                handleResumeDropdown={handleResumeDropdown}
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
