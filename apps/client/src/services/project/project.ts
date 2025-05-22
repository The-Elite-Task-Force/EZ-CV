import type { ProjectDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PROJECT_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchProjectByProjectId = async (projectId: string) => {
  const response = await axios.get<ProjectDto, AxiosResponse<ProjectDto>>(`/project/${projectId}`);
  return response.data;
};

export const useProjectByProjectId = (projectId: string | undefined) => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [PROJECT_KEY, projectId],
    queryFn: () => {
      if (!projectId) throw new Error("projectId is undefined");
      return fetchProjectByProjectId(projectId);
    },
  });

  return { data, loading, error };
};
