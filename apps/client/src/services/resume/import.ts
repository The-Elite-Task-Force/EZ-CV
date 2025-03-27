import type { ImportResumeDto, ResumeDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { SECTION_MAPPING_KEY, SECTIONS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const importResume = async (data: ImportResumeDto) => {
  const response = await axios.post<ResumeDto, AxiosResponse<ResumeDto>, ImportResumeDto>(
    "/resume/import",
    data,
  );

  return response.data;
};

export const useImportResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: importResumeFn,
  } = useMutation({
    mutationFn: importResume,
    onSuccess: (data) => {
      queryClient.setQueryData<ResumeDto>(["resume", { id: data.id }], data);
      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });

      // Invalidate these queries only after a successful mutation
      void queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
      void queryClient.invalidateQueries({ queryKey: SECTION_MAPPING_KEY });
    },
  });

  return { importResume: importResumeFn, loading, error };
};
