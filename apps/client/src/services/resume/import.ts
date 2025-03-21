import type { SectionsDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useEffect } from "react";

import { SECTIONS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { useSectionsStore } from "@/client/stores/section";

export const fetchSections = async (): Promise<SectionsDto> => {
  const response = await axios.get<SectionsDto, AxiosResponse<SectionsDto>>("/sectionItem");
  return response.data;
};

export const useSections = () => {
  const setSections = useSectionsStore((state) => state.setSections);

  const {
    data: sections,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: SECTIONS_KEY,
    queryFn: fetchSections,
  });

  useEffect(() => {
    if (sections) {
      setSections(sections);
    }
  }, [sections, setSections]);

  return { sections, loading, error };
};
