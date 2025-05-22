/* eslint-disable lingui/no-unlocalized-strings */
import { useState } from "react";

import { useSearch } from "@/client/services/search/search";

import { UserCardList } from "../../projects/user-card-list";
import { SearchBar } from "./searchbar";
import { useResetSearchCache } from "./use-reset-search-cache";

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [totalResults] = useState(10);
  useResetSearchCache();

  const { data, isLoading, error, refetch } = useSearch(query, totalResults);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    void refetch();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Search</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4 w-full max-w-3xl">
        <UserCardList
          users={data}
          usersError={error}
          usersLoading={isLoading}
          data={Boolean(query)}
        />
      </div>
    </div>
  );
};
