import { t } from "@lingui/macro";
import type {
  activeInvitationsDTO,
  COMPANY_STATUS,
  CompanyDto,
  CompanyWithRoleDto,
  CreateCompanyMappingDto,
  EmployeeDto,
} from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { COMPANIES_KEY, OWNCOMPANIES_KEY } from "@/client/constants/query-keys";
import { toast } from "@/client/hooks/use-toast";
import { axios } from "@/client/libs/axios";

export const fetchOwnCompanies = async () => {
  const response = await axios.get<CompanyDto[], AxiosResponse<CompanyDto[]>>("/company/own");
  return response.data;
};

export const fetchCompanies = async () => {
  const response = await axios.get<CompanyDto[], AxiosResponse<CompanyWithRoleDto[]>>("/company");
  return response.data;
};

export const fetchCompany = async (companyId: string) => {
  const response = await axios.get<CompanyDto>(`/company/${companyId}`);
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

export const useOwnedCompanies = () => {
  const {
    error,
    isPending: loading,
    data: companies,
  } = useQuery({
    queryKey: OWNCOMPANIES_KEY,
    queryFn: fetchOwnCompanies,
  });
  return { companies, loading, error };
};

export const setDefault = async (data: { companyId: string; userId: string }) => {
  try {
    const response = await axios.patch(`/company/${data.companyId}/setDefault`, {
      userId: data.userId,
    });
    toast({
      variant: "success",
      title: t`Default company updated`,
      description: t`Your default company has been set successfully.`,
    });
    return response.data;
  } catch (error) {
    let errorMessage = t`An unexpected error occurred`;
    if (error instanceof Error) errorMessage = error.message;
    toast({
      variant: "error",
      title: t`Failed to update default company`,
    });
    throw error;
  }
};

export const removeUserFromCompany = async (data: { companyId: string; username: string }) => {
  try {
    const response = await axios.delete(`/company/${data.companyId}/remove/${data.username}`);
    toast({
      variant: "success",
      title: t`User removed successfully`,
      description: t`The user has been removed from the company.`,
    });
    return response.data;
  } catch (error) {
    let errorMessage = t`An unexpected error occurred`;
    if (error instanceof Error) errorMessage = error.message;
    toast({
      variant: "error",
      title: t`Failed to remove user`,
      description: errorMessage,
    });
    throw error;
  }
};

export const inviteUserToCompany = async (data: { companyId: string; username: string }) => {
  try {
    const response = await axios.post(`/company/${data.companyId}/invite`, {
      username: data.username,
    });
    toast({
      variant: "success",
      title: t`User invited successfully`,
      description: t`The invitation has been sent.`,
    });
    return response.data;
  } catch (error) {
    let errorMessage = t`An unexpected error occurred`;
    if (error instanceof Error) errorMessage = error.message;
    toast({
      variant: "error",
      title: t`Failed to send invitation`,
      description: errorMessage,
    });
    throw error;
  }
};

export const fetchEmployees = async (companyId: string) => {
  const response = await axios.get<EmployeeDto[], AxiosResponse<EmployeeDto[]>>(
    `/company/${companyId}/employees`,
  );
  return response.data;
};

export const inviteToCompany = async (data: CreateCompanyMappingDto) => {
  try {
    const response = await axios.post<
      CreateCompanyMappingDto,
      AxiosResponse<CreateCompanyMappingDto>
    >(`/company/invite`, data);
    toast({
      variant: "success",
      title: t`Invitation sent`,
      description: t`User has been invited to the company.`,
    });
    return response.data;
  } catch (error) {
    let errorMessage = t`An unexpected error occurred`;
    if (error instanceof Error) errorMessage = error.message;
    toast({
      variant: "error",
      title: t`Failed to send invitation`,
      description: errorMessage,
    });
    throw error;
  }
};

export const assignRole = async (data: {
  companyId: string;
  userId: string;
  roleId: string | number;
}) => {
  try {
    const response = await axios.patch<{
      companyId: string;
      userId: string;
      roleId: string | number;
    }>(`/company/assignRole`, data);

    // Check if the response status indicates an error (e.g. 403)
    if (response.status === 403) {
      const errorMessage = (response.data && (response.data as any).message) || t`Forbidden`;
      throw new Error(errorMessage);
    }

    toast({
      variant: "success",
      title: t`Role assigned successfully`,
      description: t`User role has been updated.`,
    });

    return response.data;
  } catch (error) {
    let errorMessage = t`An unexpected error occurred`;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast({
      variant: "error",
      title: t`Failed to assign role`,
      description: errorMessage,
    });
    throw error;
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
  try {
    const response = await axios.patch<
      { companyMappingId: string; status: COMPANY_STATUS },
      AxiosResponse<{ message: string }>
    >(`/company/changeEmploymentStatus`, {
      companyMappingId,
      status,
    });
    toast({
      variant: "success",
      title: t`Employment status changed`,
      description: t`The employment status has been updated successfully.`,
    });
    return response.data;
  } catch (error) {
    let errorMessage = t`An unexpected error occurred`;
    if (error instanceof Error) errorMessage = error.message;
    toast({
      variant: "error",
      title: t`Failed to change employment status`,
      description: errorMessage,
    });
    throw error;
  }
};
