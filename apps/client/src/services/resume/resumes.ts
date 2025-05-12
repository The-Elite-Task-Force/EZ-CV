import type { ResumeDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { PUBLIC_RESUMES_KEY, RESUMES_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchResumes = async () => {
  const response = await axios.get<ResumeDto[], AxiosResponse<ResumeDto[]>>("/resume/all");

  return response.data;
};

export const useResumes = () => {
  const {
    error,
    isPending: loading,
    data: resumes,
  } = useQuery({
    queryKey: RESUMES_KEY,
    queryFn: fetchResumes,
  });

  return { resumes, loading, error };
};

export const fetchPublicResumes = async (userId: string) => {
  const response = await axios.get<ResumeDto[], AxiosResponse<ResumeDto[]>>(
    `/resume/public/all/${userId}`,
  );

  return response.data;
};

export const usePublicResumes = (userId: string) => {
  const {
    error,
    isPending: loading,
    data: resumes,
    refetch,
  } = useQuery({
    queryKey: [PUBLIC_RESUMES_KEY, userId],
    queryFn: () => fetchPublicResumes(userId),
    enabled: false,
  });

  return { resumes, loading, error, refetch };
};
