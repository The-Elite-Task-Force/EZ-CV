import type { ProjectMappingDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PROJECT_MAPPINGS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const deleteProjectMapping = async (params: { projectId: string; userId: string }) => {
  const { projectId, userId } = params;

  const response = await axios.delete<ProjectMappingDto, AxiosResponse<ProjectMappingDto>>(
    `/projectMapping/${projectId}/${userId}`,
  );

  return response.data;
};

export const useDeleteProjectMapping = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteProjectMappingFn,
  } = useMutation({
    mutationFn: deleteProjectMapping,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [PROJECT_MAPPINGS_KEY, data.projectId] });
    },
  });

  return { deleteProjectMapping: deleteProjectMappingFn, loading, error };
};
