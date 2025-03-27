import type { CompanyDto } from "@reactive-resume/dto";
import type { CreateCompanyDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { COMPANY_KEY, OWNCOMPANIES_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const createCompany = async (data: CreateCompanyDto) => {
  const response = await axios.post<CompanyDto, AxiosResponse<CompanyDto>, CreateCompanyDto>(
    "/company",
    data,
  );

  return response.data;
};

export const useCreateCompany = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createCompanyFn,
  } = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      // The individual company is now stored under the key ['company', data.id]
      queryClient.setQueryData<CompanyDto>([COMPANY_KEY[0], data.id], data);

      // The owned companies list is updated with the new company
      queryClient.setQueryData<CompanyDto[]>(OWNCOMPANIES_KEY, (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createCompany: createCompanyFn, loading, error };
};
