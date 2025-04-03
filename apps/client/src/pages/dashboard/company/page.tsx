import type { CompanyDto, EmployeeDto } from "@reactive-resume/dto";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import { DetailsForm } from "@/client/pages/dashboard/company/_dialogs/details-form";
import { fetchEmployees } from "@/client/services/company/company";

import InviteUserForm from "./_dialogs/InviteUserForm";
import EmployeeList from "./_layouts/employeeList";

export const CompanyPage = () => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [companyState, setCompanyState] = useState<CompanyDto>(useLoaderData());
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await fetchEmployees(companyState.id);
        setEmployees(employeesData);
      } catch {
        //console.error(error);
      }
    };

    void loadEmployees();
  }, [companyState]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">{companyState.name}</h1>
      <DetailsForm companyState={companyState} setCompanyState={setCompanyState} />
      <EmployeeList employees={employees} company={companyState} />
      <InviteUserForm companyId={companyState.id} />
    </div>
  );
};
