import type { CreateProjectDto, ProjectDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PROJECT_KEY, PROJECTS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createProject = async (data: CreateProjectDto) => {
  const response = await axios.post<ProjectDto, AxiosResponse<ProjectDto>, CreateProjectDto>(
    "/project",
    data,
  );

  return response.data;
};

export const useCreateProject = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createProjectFn,
  } = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.setQueryData<ProjectDto>([PROJECT_KEY[0], data.id], data);

      queryClient.setQueryData<ProjectDto[]>(PROJECTS_KEY, (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createProject: createProjectFn, loading, error };
};
