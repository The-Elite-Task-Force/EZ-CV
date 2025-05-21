import type {
  ResumeDto,
  UpdateResumeDto,
  UpdateVariantDto,
  VariantDto,
} from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const updateResume = async (data: UpdateResumeDto) => {
  const response = await axios.patch<ResumeDto, AxiosResponse<ResumeDto>, UpdateResumeDto>(
    `/resume/${data.id}`,
    data,
  );

  queryClient.setQueryData<ResumeDto>(["resume", { id: response.data.id }], response.data);

  queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
    if (!cache) return [response.data];
    return cache.map((resume) => {
      if (resume.id === response.data.id) return response.data;
      return resume;
    });
  });

  return response.data;
};

export const updateVariant = async (data: UpdateVariantDto) => {
  const response = await axios.patch<VariantDto, AxiosResponse<VariantDto>, UpdateVariantDto>(
    `/variant/${data.id}`,
    data,
  );

  queryClient.setQueryData<VariantDto>(["resume", { id: response.data.id }], response.data);

  queryClient.setQueryData<VariantDto[]>(["resumes"], (cache) => {
    if (!cache) return [response.data];
    return cache.map((resume) => {
      if (resume.id === response.data.id) return response.data;
      return resume;
    });
  });

  return response.data;
};

// Type guard to check if the data is UpdateVariantDto
const isUpdateVariantDto = (data: UpdateVariantDto | UpdateResumeDto): data is UpdateVariantDto => {
  return (
    (data as UpdateVariantDto).resumeId !== undefined &&
    (data as UpdateVariantDto).creatorId !== undefined
  );
};

// Debounced function to handle both updateVariant and updateResume
export const debouncedUpdateResume = debounce(async (data: UpdateVariantDto | UpdateResumeDto) => {
  isUpdateVariantDto(data) ? await updateVariant(data) : await updateResume(data);
}, 500);

export const useUpdateResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateResumeFn,
  } = useMutation({
    mutationFn: updateResume,
  });

  return { updateResume: updateResumeFn, loading, error };
};
