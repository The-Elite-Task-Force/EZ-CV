/* eslint-disable lingui/no-unlocalized-strings */
import type { CompanyDto, EmployeeDto } from "@reactive-resume/dto";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { assignRole, removeUserFromCompany } from "@/client/services/company";

type EmployeeCardProps = {
  employee: EmployeeDto;
  company: CompanyDto;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, company }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Example roles – adjust as needed
  const availableRoles = ["Owner", "Admin", "Bidmanager", "User"];

  const handleRemoveUser = () => {
    // Placeholder function for removing user
    void removeUserFromCompany({
      companyId: company.id,
      username: employee.username,
    });
  };

  const handleAssignRole = async (role: string) => {
    await assignRole({
      companyId: company.id,
      userId: employee.id,
      roleId: role,
    });
    // Close both dropdowns after role assignment
    setRoleDropdownOpen(false);
    setDropdownOpen(false);
  };

  const handleViewProfile = () => {
    // Redirect to the public profile page
    void navigate(`/publicprofile/${employee.username}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setRoleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <li className="flex items-center space-x-4">
      <div className="shrink-0">
        <img
          className="size-10 rounded-full"
          src={
            employee.picture ?? `https://avatars.dicebear.com/api/initials/${employee.username}.svg`
          }
          alt={employee.username}
        />
      </div>
      <div className="flex-1">
        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {employee.username}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
        {employee.role && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Role: {employee.role.join(", ")}
          </div>
        )}
      </div>
      <div ref={dropdownRef} className="relative">
        <button
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
        >
          ...
        </button>
        {dropdownOpen && (
          <ul className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <li>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={handleViewProfile}
              >
                View Profile
              </button>
            </li>
            <li className="relative">
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                }}
              >
                Assign Role
              </button>
              {roleDropdownOpen && (
                <ul className="absolute left-full top-0 ml-2 mt-0 w-36 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {availableRoles.map((role) => (
                    <li key={role}>
                      <button
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleAssignRole(role)}
                      >
                        {role}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={handleRemoveUser}
              >
                Remove User
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  );
};

export default EmployeeCard;
