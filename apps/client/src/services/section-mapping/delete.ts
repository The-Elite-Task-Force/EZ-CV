import type { DeleteMappingDto } from "@reactive-resume/dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SECTION_MAPPING_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { useResumeStore } from "@/client/stores/resume";

export const deleteSectionMapping = async (data: DeleteMappingDto) => {
  const response = await axios.delete(`sectionItem/mappings`, { data: data });

  return response.data;
};

export const useDeleteSectionMapping = (id: string) => {
  const queryClient = useQueryClient();
  const setValue = useResumeStore((state) => state.setValue);

  const {
    error,
    isPending: loading,
    mutateAsync: mutationFn,
  } = useMutation({
    mutationFn: deleteSectionMapping,
    onSuccess: async (data: DeleteMappingDto) => {
      if (data.format === "basics") {
        setValue("basicsItemId", null);
      } else {
        await queryClient.invalidateQueries({ queryKey: [SECTION_MAPPING_KEY, id] });
      }
    },
  });

  return { deleteSectionMapping: mutationFn, loading, error };
};
