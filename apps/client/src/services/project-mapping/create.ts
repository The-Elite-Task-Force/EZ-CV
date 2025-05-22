import type { CreateProjectMappingDto, ProjectMappingDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PROJECT_MAPPINGS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createProjectMapping = async (data: CreateProjectMappingDto) => {
  const response = await axios.post<
    ProjectMappingDto,
    AxiosResponse<ProjectMappingDto>,
    CreateProjectMappingDto
  >("/projectMapping", data);
  return response.data;
};

export const useCreateProjectMapping = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createProjectMappingFn,
  } = useMutation({
    mutationFn: createProjectMapping,
    onSuccess: async (data) => {
      const projectId = data.projectId;
      await queryClient.invalidateQueries({ queryKey: [PROJECT_MAPPINGS_KEY, projectId] });
    },
  });

  return { createProjectMapping: createProjectMappingFn, loading, error };
};
