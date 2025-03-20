import { type LinkedInImportSections, transformLinkedInData } from "@reactive-resume/dto";
import type { ResumeData } from "@reactive-resume/schema";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const importSections = async (data: ResumeData) => {
  const sections = transformLinkedInData(data);

  const response = await axios.post<
    LinkedInImportSections,
    AxiosResponse<LinkedInImportSections>,
    LinkedInImportSections
  >("/sectionItem/import", sections);

  return response.data;
};

export const useImportSections = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: importSectionsFn,
  } = useMutation({
    mutationFn: importSections,
    onSuccess: (data) => {
      queryClient.setQueryData<LinkedInImportSections>(["sections"], data);
      queryClient.setQueryData<LinkedInImportSections[]>(["sections"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { importSections: importSectionsFn, loading, error };
};
