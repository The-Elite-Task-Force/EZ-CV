import { type LinkedInImportSections, transformLinkedInData } from "@reactive-resume/dto";
import type { ResumeData } from "@reactive-resume/schema";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { RESUMES_KEY, SECTIONS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const importSections = async ({
  data,
  createResume,
  resumeTitle,
}: {
  data: ResumeData;
  createResume: boolean;
  resumeTitle?: string;
}) => {
  const sections = transformLinkedInData(data);

  const response = await axios.post<
    LinkedInImportSections,
    AxiosResponse<LinkedInImportSections>,
    { sections: LinkedInImportSections; createResume: boolean; resumeTitle: string | undefined }
  >("/sectionItem/import", {
    sections,
    createResume,
    resumeTitle,
  });

  await queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
  await queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });

  return response.data;
};

export const useImportSections = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: importSectionsFn,
  } = useMutation({
    mutationFn: (variables: {
      data: ResumeData;
      createResume: boolean;
      resumeTitle: string | undefined;
    }) => importSections(variables),
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
