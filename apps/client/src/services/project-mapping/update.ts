import type { ProjectMappingDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PROJECT_MAPPINGS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const updateProjectMapping = async (params: {
  projectId: string;
  userId: string;
  resumeId?: string;
}) => {
  const { projectId, userId, resumeId } = params;

  const response = await axios.patch<
    ProjectMappingDto,
    AxiosResponse<ProjectMappingDto>,
    { resumeId?: string }
  >(`/projectMapping/${projectId}/${userId}`, { resumeId });

  return response.data;
};

export const useUpdateProjectMapping = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateProjectMappingFn,
  } = useMutation({
    mutationFn: updateProjectMapping,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [PROJECT_MAPPINGS_KEY, data.projectId] });
    },
  });

  return { updateProjectMapping: updateProjectMappingFn, loading, error };
};
