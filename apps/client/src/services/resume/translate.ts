import type { ResumeDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

export const translateResume = async (data: ResumeDto) => {
  const response = await axios.post<ResumeDto, AxiosResponse<ResumeDto>, ResumeDto>(
    "/variant/translate",
    data,
  );

  return response.data;
};

export const useTranslateResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: translateResumeFn,
  } = useMutation({
    mutationFn: translateResume,
    onSuccess: (data) => {
      // Add logic here to update the cache after translation
      // Invalidate the Resumes and sections to refetch the data
    },
  });

  return { translateResume: translateResumeFn, loading, error };
};
