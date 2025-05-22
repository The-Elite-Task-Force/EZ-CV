import type { DuplicateAsVariantDto, ResumeDto, VariantDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createVariant = async (data: DuplicateAsVariantDto) => {
  const response = await axios.post<VariantDto, AxiosResponse<VariantDto>, DuplicateAsVariantDto>(
    "/variant/duplicateFromResume/",
    data,
  );

  return response.data;
};

export const useCreateVariantFromResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createVariantFn,
  } = useMutation({
    mutationFn: createVariant,
    onSuccess: (data) => {
      queryClient.setQueryData<ResumeDto>(["resume", { id: data.id }], data);

      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createVariant: createVariantFn, loading, error };
};
