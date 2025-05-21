import type { CreateResumeDto, ResumeDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PUBLIC_RESUMES_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createResume = async (data: CreateResumeDto) => {
  const response = await axios.post<ResumeDto, AxiosResponse<ResumeDto>, CreateResumeDto>(
    "/resume",
    data,
  );

  return response.data;
};

export const useCreateResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createResumeFn,
  } = useMutation({
    mutationFn: createResume,
    onSuccess: async (data) => {
      const userId = data.userId;
      queryClient.setQueryData<ResumeDto>(["resume", { id: data.id }], data);

      await queryClient.invalidateQueries({
        queryKey: [PUBLIC_RESUMES_KEY, userId],
      });
      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createResume: createResumeFn, loading, error };
};
