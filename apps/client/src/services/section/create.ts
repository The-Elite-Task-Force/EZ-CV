import {
  type CreateSectionItemDto,
  SECTION_FORMAT,
  type SectionItemDto,
} from "@reactive-resume/dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { SECTION_MAPPING_KEY, SECTIONS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { useResumeStore } from "@/client/stores/resume";

export const createSectionItem = async (data: CreateSectionItemDto) => {
  const response = await axios.post<
    CreateSectionItemDto,
    AxiosResponse<SectionItemDto>,
    CreateSectionItemDto
  >("/sectionItem", data);
  return response.data;
};

export const useCreateSectionItem = (id?: string) => {
  const queryClient = useQueryClient();
  const setValue = useResumeStore((state) => state.setValue);

  const {
    error,
    isPending: loading,
    mutateAsync: mutationFn,
  } = useMutation({
    mutationFn: createSectionItem,
    onSuccess: async (data: CreateSectionItemDto) => {
      if (data.format === SECTION_FORMAT.Basics) {
        setValue("basicsItemId", data.data.id);
      }
      await Promise.all([
        ...(id ? [queryClient.invalidateQueries({ queryKey: [SECTION_MAPPING_KEY, id] })] : []),
        queryClient.invalidateQueries({ queryKey: SECTIONS_KEY }),
      ]);
    },
  });

  return { createSectionItem: mutationFn, loading, error };
};
