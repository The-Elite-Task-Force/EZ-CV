import type { ProjectDto } from "@reactive-resume/dto";
import { type QueryFunctionContext, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

const fetchOwnProjectsByCompanyId = async ({
  queryKey,
}: QueryFunctionContext<[string, string]>) => {
  const [, companyId] = queryKey;

  const response = await axios.get<ProjectDto[], AxiosResponse<ProjectDto[]>>(
    `/project/own/${companyId}`,
  );

  return response.data;
};

export const useOwnProjectsByCompanyId = (companyId: string) => {
  const {
    error,
    isPending: loading,
    data: projects,
  } = useQuery({
    queryKey: ["own-projects", companyId],
    queryFn: fetchOwnProjectsByCompanyId,
    enabled: !!companyId,
  });

  return { projects, loading, error };
};
