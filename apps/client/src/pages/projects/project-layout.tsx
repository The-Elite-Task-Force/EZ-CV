/* eslint-disable lingui/no-unlocalized-strings */
// ProjectPageLayout.tsx
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useParams } from "react-router";

import { useProjectByProjectId } from "@/client/services/project/project";
import {
  useCreateProjectMapping,
  useDeleteProjectMapping,
  useProjectMappingsByProjectId,
  useUpdateProjectMapping,
} from "@/client/services/project-mapping";
import { useSearch } from "@/client/services/search/search";

import { useResetSearchCache } from "../dashboard/search/use-reset-search-cache";

export const ProjectPageLayout = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [query, setQuery] = useState("");
  const [totalResults] = useState(10);
  useResetSearchCache();

  const { data, isLoading, error, refetch } = useSearch(query, totalResults);
  const { createProjectMapping } = useCreateProjectMapping();
  const { deleteProjectMapping } = useDeleteProjectMapping();
  const { updateProjectMapping } = useUpdateProjectMapping();
  const { data: project } = useProjectByProjectId(projectId);

  const {
    data: members,
    loading: membersLoading,
    error: membersError,
  } = useProjectMappingsByProjectId(projectId);

  useEffect(() => {
    void refetch();
  }, []);

  if (!projectId || !project) return null;

  const memberIds = new Set(members?.map((m) => m.user.id));
  const filteredSearchResults = data?.filter((item) => !memberIds.has(item.id)) ?? [];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    void refetch();
  };

  const handleAddUser = async (userId: string, resumeId?: string) => {
    if (!projectId) return;
    await createProjectMapping({
      userId,
      projectId,
      ...(resumeId && { resumeId }),
    });
  };

  const handleRemoveUser = async (userId: string) => {
    if (!projectId) return;
    await deleteProjectMapping({ userId, projectId });
  };

  const handleResumeDropdown = async (userId: string, resumeId: string) => {
    if (!projectId) return;
    await updateProjectMapping({ projectId, userId, resumeId });
  };

  return (
    <div>
      <Helmet>
        <title>Projects - EzCV</title>
      </Helmet>
      <Outlet
        context={{
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
          project,
        }}
      />
    </div>
  );
};
