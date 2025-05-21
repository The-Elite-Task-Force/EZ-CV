import type { CompanyDto, EmployeeDto, ProjectDto } from "@reactive-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router";

import { EMPLOYEES_KEY, PROJECTS_KEY } from "@/client/constants/query-keys";
import { DetailsForm } from "@/client/pages/dashboard/company/_dialogs/details-form";
import { fetchEmployees } from "@/client/services/company/company";
import { fetchProjectsFromCompany } from "@/client/services/project/projects";

import ProjectList from "../projects/layouts/project-list";
import InviteUserForm from "./_dialogs/InviteUserForm";
import EmployeeList from "./_layouts/employeeList";

export const CompanyPage = () => {
  const [companyState, setCompanyState] = useState<CompanyDto>(useLoaderData());

  const { data: employees = [], refetch: refetchEmployees } = useQuery<EmployeeDto[]>({
    queryKey: [EMPLOYEES_KEY, companyState.id],
    queryFn: () => fetchEmployees(companyState.id),
  });

  const { data: projects = [] } = useQuery<ProjectDto[]>({
    queryKey: [PROJECTS_KEY, companyState.id],
    queryFn: () => fetchProjectsFromCompany(companyState.id),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">{companyState.name}</h1>
      <DetailsForm companyState={companyState} setCompanyState={setCompanyState} />
      <EmployeeList
        employees={employees}
        company={companyState}
        refetchEmployees={refetchEmployees}
      />
      <InviteUserForm companyId={companyState.id} />
      <ProjectList projects={projects} />
    </div>
  );
};
