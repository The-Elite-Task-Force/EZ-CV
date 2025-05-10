import type { ProjectDto } from "@reactive-resume/dto";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

export const fetchProjectsFromCompany = async (companyId: string) => {
  const response = await axios.get<ProjectDto[], AxiosResponse<ProjectDto[]>>(
    `/project/${companyId}`,
  );
  return response.data;
};
