/* eslint-disable lingui/no-unlocalized-strings */
import { EnvelopeSimple, MinusCircle, Plus } from "@phosphor-icons/react";
import type { SearchResultDto } from "@reactive-resume/dto";
import { Combobox } from "@reactive-resume/ui";
import React, { useState } from "react";

import { DropdownCompanyInviter } from "@/client/pages/dashboard/companies/dm-invite";
import { usePublicResumes } from "@/client/services/resume";

type UserCardProps = {
  user: SearchResultDto;
  projectResumeId?: string;
  handleAddUser?: (userId: string, resumeId?: string) => void;
  handleRemoveUser?: (userId: string) => void;
  handleResumeDropdown?: (userId: string, resumeId: string) => void;
  resumeDropdown?: boolean;
};

export const UserCard: React.FC<UserCardProps> = ({
  user,
  projectResumeId,
  handleAddUser,
  handleRemoveUser,
  handleResumeDropdown,
  resumeDropdown,
}) => {
  const [resumeId, setResumeId] = useState<string | undefined>(projectResumeId);
  const { resumes, refetch } = usePublicResumes(user.id);

  return (
    <div className="mb-4 flex items-center rounded-xl border border-gray-300 bg-primary/10 p-4 shadow-md dark:border-gray-700">
      <div className="shrink-0">
        <img
          className="size-16 rounded-full"
          src={
            user.picture ??
            "https://img.freepik.com/premium-vector/profile-icon-vector-illustration-design-template_827767-5831.jpg?w=740"
          }
          alt={user.name}
        />
      </div>
      <div className="ml-4">
        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{user.username}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
      </div>
      <div className="ml-auto flex space-x-4">
        {resumeDropdown && (
          <div
            className="min-w-[160px] max-w-[160px] overflow-hidden"
            onClick={async () => {
              if (!resumes) await refetch();
            }}
          >
            <Combobox
              value={resumeId}
              options={
                resumes?.map((r) => ({
                  label: r.title,
                  value: r.id,
                })) ?? []
              }
              selectPlaceholder="Select resume"
              onValueChange={(value) => {
                setResumeId(value);
                handleResumeDropdown && handleResumeDropdown(user.id, value);
              }}
            />
          </div>
        )}

        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <EnvelopeSimple size={24} />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <DropdownCompanyInviter invitedUserId={user.id} />
        </button>
        {handleAddUser ? (
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => {
              handleAddUser(user.id, resumeId);
            }}
          >
            <Plus size={24} />
          </button>
        ) : handleRemoveUser ? (
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => {
              handleRemoveUser(user.id);
            }}
          >
            <MinusCircle size={24} />
          </button>
        ) : null}
      </div>
    </div>
  );
};
