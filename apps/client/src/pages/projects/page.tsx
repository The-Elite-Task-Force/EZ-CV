/* eslint-disable lingui/no-unlocalized-strings */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";

import {
  useCreateProjectMapping,
  useDeleteProjectMapping,
  useProjectMappingsByProjectId,
} from "@/client/services/project-mapping";
import { useSearch } from "@/client/services/search/search";

import { SearchBar } from "../dashboard/search/searchbar";
import { useResetSearchCache } from "../dashboard/search/use-reset-search-cache";
import { UserCardList } from "./user-card-list";

export const ProjectPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [query, setQuery] = useState("");
  const [totalResults] = useState(10);
  useResetSearchCache();

  const { data, isLoading, error, refetch } = useSearch(query, totalResults);
  const { createProjectMapping } = useCreateProjectMapping();
  const { deleteProjectMapping } = useDeleteProjectMapping();
  const {
    data: members,
    loading: membersLoading,
    error: membersError,
  } = useProjectMappingsByProjectId(projectId);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    void refetch();
  };

  const handleAddUser = async (userId: string) => {
    if (!projectId) return;
    await createProjectMapping({ userId, projectId });
  };

  const handleRemoveUser = async (userId: string) => {
    if (!projectId) return;
    await deleteProjectMapping({ userId, projectId });
  };

  // Just doing this so page shows some users on first load
  // without having to search for something
  useEffect(() => {
    void refetch();
  }, []);

  if (!projectId) return null;

  const memberIds = new Set(members?.map((m) => m.user.id));
  const filteredSearchResults = data?.filter((item) => !memberIds.has(item.id)) ?? [];

  return (
    <div>
      <Helmet>
        <title>Projects - EzCV</title>
      </Helmet>

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
            />
          </div>
        </div>

        <div className="flex h-full w-1/2 flex-col">
          <div className="flex w-full items-center justify-between p-8">
            <h2 className="text-3xl font-bold">CV Portfolio</h2>
            {membersLoading ? (
              <p className="pr-8 text-lg">Loading members...</p>
            ) :
            membersError ? (
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};
