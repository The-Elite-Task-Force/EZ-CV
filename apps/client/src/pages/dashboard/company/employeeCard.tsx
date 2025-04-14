/* eslint-disable lingui/no-unlocalized-strings */
import type { CompanyDto, EmployeeDto } from "@reactive-resume/dto";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { assignRole, removeUserFromCompany } from "@/client/services/company";

type EmployeeCardProps = {
  employee: EmployeeDto;
  company: CompanyDto;
  refetchEmployees: () => void;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, company, refetchEmployees }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [roleDropdownPosition, setRoleDropdownPosition] = useState("left-full"); // default position
  const dropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const availableRoles = ["Owner", "Admin", "Bidmanager", "Member"];

  const handleRemoveUser = async () => {
    await removeUserFromCompany({
      companyId: company.id,
      username: employee.username,
    });
    refetchEmployees();
  };

  const handleAssignRole = async (role: string) => {
    await assignRole({
      companyId: company.id,
      userId: employee.id,
      roleId: role,
    });
    refetchEmployees();
    setRoleDropdownOpen(false);
    setDropdownOpen(false);
  };

  const handleViewProfile = () => {
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
  }, []);

  // Adjust dropdown position on open
  useEffect(() => {
    if (roleDropdownOpen && roleDropdownRef.current) {
      const rect = roleDropdownRef.current.getBoundingClientRect();
      // If the dropdown would go off-screen on the right, change alignment.
      if (rect.right > window.innerWidth) {
        setRoleDropdownPosition("right-full");
      } else {
        setRoleDropdownPosition("left-full");
      }
    }
  }, [roleDropdownOpen]);

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
          <ul className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-black">
            <li>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-black"
                onClick={handleViewProfile}
              >
                View Profile
              </button>
            </li>
            <li className="relative">
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-black"
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                }}
              >
                Assign Role
              </button>
              {roleDropdownOpen && (
                <ul
                  ref={roleDropdownRef}
                  className={`absolute top-0 ml-2 mt-0 w-36 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-black ${roleDropdownPosition}`}
                >
                  {availableRoles.map((role) => (
                    <li key={role}>
                      <button
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-black"
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
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-black"
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
