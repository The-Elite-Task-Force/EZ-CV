import type { ProjectMappingDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PROJECT_MAPPINGS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const getProjectMappingsByProjectId = async (projectId: string) => {
  const response = await axios.get<ProjectMappingDto[], AxiosResponse<ProjectMappingDto[]>>(
    `/projectMapping/${projectId}`,
  );
  return response.data;
};

export const useProjectMappingsByProjectId = (projectId: string | undefined) => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [PROJECT_MAPPINGS_KEY, projectId],
    queryFn: () => {
      if (!projectId) throw new Error("projectId is undefined");
      return getProjectMappingsByProjectId(projectId);
    },
  });

  return { data, loading, error };
};
