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
      // void queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
      // void queryClient.invalidateQueries({ queryKey: SECTION_MAPPING_KEY });
    },
  });

  return { translateResume: translateResumeFn, loading, error };
};
