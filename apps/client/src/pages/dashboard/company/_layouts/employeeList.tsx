import type { CompanyDto, EmployeeDto } from "@reactive-resume/dto";
import EmployeeCard from "../employeeCard";

type EmployeeListProps = {
  employees: EmployeeDto[];
  company: CompanyDto;
  refetchEmployees: () => void;
};

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, company, refetchEmployees }) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Employees</h2>
      <ul className="space-y-4">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            company={company}
            refetchEmployees={refetchEmployees}
          />
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
