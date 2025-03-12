import { EnvelopeSimple, Plus } from "@phosphor-icons/react";
import type { SearchResultDto } from "@reactive-resume/dto";
import React from "react";

import { DropdownCompanyInviter } from "@/client/pages/dashboard/companies/dm-invite";

type SearchResultItemProps = {
  searchResult: SearchResultDto;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ searchResult }) => {
  return (
    <div className="mb-4 flex items-center rounded-xl border border-gray-300 p-4 shadow-md dark:border-gray-700">
      <div className="shrink-0">
        <img
          className="size-16 rounded-full"
          src={
            searchResult.picture ??
            "https://img.freepik.com/premium-vector/profile-icon-vector-illustration-design-template_827767-5831.jpg?w=740"
          }
          alt={searchResult.name}
        />
      </div>
      <div className="ml-4">
        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {searchResult.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{searchResult.username}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{searchResult.email}</div>
      </div>
      <div className="ml-auto flex space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <EnvelopeSimple size={24} />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Plus size={24} />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <DropdownCompanyInviter invitedUserId={searchResult.id} />
        </button>
      </div>
    </div>
  );
};

export default SearchResultItem;
