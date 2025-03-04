import { t } from "@lingui/macro";
import type {
  activeInvitationsDTO,
  COMPANY_STATUS,
  CompanyDto,
  CreateCompanyMappingDto,
} from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { COMPANIES_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";

export const fetchCompanies = async () => {
  const response = await axios.get<CompanyDto[], AxiosResponse<CompanyDto[]>>("/company");
  return response.data;
};

export const useCompanies = () => {
  const {
    error,
    isPending: loading,
    data: companies,
  } = useQuery({
    queryKey: COMPANIES_KEY,
    queryFn: fetchCompanies,
  });

  return { companies, loading, error };
};

export const setDefault = async (data: { companyId: string; userId: string }) => {
  const response = await axios.patch(`/company/${data.companyId}/setDefault`, {
    userId: data.userId,
  });
  return response.data;
};

export const inviteToCompany = async (data: CreateCompanyMappingDto) => {
  try {
    const response = await axios.post(`/company/invite`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    return t`An unexpected error occurred`;
  }
};

export const getActiveInvitations = async (userId: string) => {
  try {
    const response = await axios.get<{ activeInvitations: activeInvitationsDTO[] }, AxiosResponse>(
      `/company/activeInvitations/${userId}`,
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const changeEmploymentStatus = async (companyMappingId: string, status: COMPANY_STATUS) => {
  const response = await axios.patch(`/company/changeEmploymentStatus`, {
    companyMappingId,
    status,
  });
  return response.data;
};
