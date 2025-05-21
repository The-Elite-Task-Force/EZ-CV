/* eslint-disable lingui/no-unlocalized-strings */
// ProjectManagePage.tsx
import { useOutletContext } from "react-router";

import { SearchBar } from "../dashboard/search/searchbar";
import type { ProjectPageContext } from "./types/project";
import { UserCardList } from "./user-card-list";

export const ProjectManagePage = () => {
  const {
    query,
    isLoading,
    error,
    filteredSearchResults,
    handleSearch,
    handleAddUser,
    handleRemoveUser,
    handleResumeDropdown,
    members,
    membersLoading,
    membersError,
  } = useOutletContext<ProjectPageContext>();

  return (
    <div className="flex h-screen items-stretch gap-12 p-8">
      <div className="flex h-full w-1/2 flex-col">
        <div className="w-full py-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="w-full grow overflow-auto rounded-2xl bg-secondary/70 p-6 shadow-md">
          <UserCardList
            users={filteredSearchResults}
            usersError={error}
            usersLoading={isLoading}
            handleAddUser={handleAddUser}
            data={Boolean(query)}
            resumeDropdown={true}
          />
        </div>
      </div>

      <div className="flex h-full w-1/2 flex-col">
        <div className="flex w-full items-center justify-between p-8">
          <h2 className="text-3xl font-bold">Resume Portfolio</h2>
          {membersLoading ? (
            <p className="pr-8 text-lg">Loading members...</p>
          ) : membersError ? (
            <p className="pr-8 text-lg text-red-500">Error loading members</p>
          ) : (
            <p className="pr-8 text-lg">Members count: {members?.length ?? 0}</p>
          )}
        </div>
        <div className="w-full grow overflow-auto rounded-2xl bg-secondary/70 p-6 shadow-md">
          <UserCardList
            users={members}
            usersError={membersError}
            usersLoading={membersLoading}
            handleRemoveUser={handleRemoveUser}
            data={Boolean(members)}
            handleResumeDropdown={handleResumeDropdown}
            resumeDropdown={true}
          />
        </div>
      </div>
    </div>
  );
};
