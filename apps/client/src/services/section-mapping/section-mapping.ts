import type { SectionMappingDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useEffect } from "react";

import { SECTION_MAPPING_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { useSectionMappingStore } from "@/client/stores/section-mapping";

export const fetchSectionMappings = async (id: string) => {
  const response = await axios.get<SectionMappingDto, AxiosResponse<SectionMappingDto>>(
    `/sectionItem/mappings/${id}`,
  );

  return response.data;
};

export const useSectionMappings = (id: string) => {
  const setSectionMappings = useSectionMappingStore((state) => state.setMappings);

  const {
    error,
    isPending: loading,
    data: mappings,
  } = useQuery({
    queryKey: [SECTION_MAPPING_KEY, id],
    queryFn: () => fetchSectionMappings(id),
  });

  useEffect(() => {
    if (mappings) {
      setSectionMappings(mappings);
    }
  }, [mappings, setSectionMappings]);

  return { mappings, loading, error };
};
