import type { SearchResultDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

export const fetchSearchResults = async (query: string, k: number) => {
  const response = await axios.get<SearchResultDto[], AxiosResponse<SearchResultDto[]>>(
    `http://localhost:5173/api/search?query=${encodeURIComponent(query)}&k=${k}`,
  );
  return response.data;
};

export const useSearch = (query: string, k = 10) => {
  return useQuery({
    queryKey: ["search", query, k],
    queryFn: () => fetchSearchResults(query, k),
    enabled: !!query, // Only run the query if there is a search query
  });
};
