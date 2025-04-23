import type { ResumeDto, SectionMappingDto, UpdateResumeDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { mapSections } from "@/client/pages/builder/page";

export const updateResume = async (data: UpdateResumeDto, mappings: SectionMappingDto) => {
  let resumeMappedSections = data;
  if (data.data?.sections) {
    const mappedSections = mapSections(data.data.sections, mappings);
    resumeMappedSections = {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...data,
      data: {
        ...data.data,
        sections: mappedSections,
      },
    };
  }
  const response = await axios.patch<ResumeDto, AxiosResponse<ResumeDto>, UpdateResumeDto>(
    `/resume/${data.id}`,
    resumeMappedSections,
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

export const debouncedUpdateResume = debounce(updateResume, 500);

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
